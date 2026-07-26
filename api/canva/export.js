import {
  CanvaCredentialError,
  loadCanvaAccessToken,
} from "./_credentials.js";

const CANVA_EXPORT_URL = "https://api.canva.com/rest/v1/exports";
const DESIGN_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
const POLL_INTERVAL_MS = 500;
const POLL_TIMEOUT_MS = 8000;

const firstQueryValue = (value) =>
  Array.isArray(value) ? value[0] : value;

const safeCanvaError = (response, res) => {
  if (response.status === 401) {
    return res.status(401).json({
      error: "Canva rejected the access token. Token refresh is required.",
    });
  }
  if (response.status === 403) {
    return res.status(403).json({
      error: "The Canva connection cannot export this design.",
    });
  }
  if (response.status === 404) {
    return res.status(404).json({
      error: "The requested Canva design or export was not found.",
    });
  }
  if (response.status === 429) {
    return res.status(429).json({
      error: "Canva export rate limit reached. Try again later.",
    });
  }
  return res.status(502).json({
    error: "Canva could not complete the export request.",
  });
};

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const designId = firstQueryValue(request.query?.design_id);
  const requestedPage = firstQueryValue(request.query?.page);
  const page = Number(requestedPage);

  if (
    typeof designId !== "string" ||
    !DESIGN_ID_PATTERN.test(designId)
  ) {
    return response.status(400).json({
      error: "A valid design_id query parameter is required.",
    });
  }

  if (
    typeof requestedPage !== "string" ||
    !/^[1-9]\d*$/.test(requestedPage) ||
    !Number.isSafeInteger(page)
  ) {
    return response.status(400).json({
      error: "Page must be a positive integer.",
    });
  }

  try {
    const accessToken = await loadCanvaAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    const createResponse = await fetch(CANVA_EXPORT_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        design_id: designId,
        format: {
          type: "png",
          lossless: true,
          pages: [page],
        },
      }),
    });

    if (!createResponse.ok) {
      return safeCanvaError(createResponse, response);
    }

    let job = (await createResponse.json())?.job;
    if (!job?.id) {
      return response.status(502).json({
        error: "Canva returned an invalid export response.",
      });
    }

    const deadline = Date.now() + POLL_TIMEOUT_MS;
    while (job.status === "in_progress" && Date.now() < deadline) {
      await new Promise((resolve) =>
        setTimeout(resolve, POLL_INTERVAL_MS),
      );

      const statusResponse = await fetch(
        `${CANVA_EXPORT_URL}/${encodeURIComponent(job.id)}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (!statusResponse.ok) {
        return safeCanvaError(statusResponse, response);
      }
      job = (await statusResponse.json())?.job;
    }

    if (job?.status === "success" && typeof job.urls?.[0] === "string") {
      return response.status(200).json({
        design_id: designId,
        page,
        format: "png",
        status: "success",
        download_url: job.urls[0],
      });
    }

    if (job?.status === "failed") {
      return response.status(502).json({
        error: "Canva could not export the requested design page.",
      });
    }

    return response.status(504).json({
      error: "The Canva export did not finish before the timeout.",
    });
  } catch (error) {
    if (
      error instanceof CanvaCredentialError &&
      error.code === "refresh_required"
    ) {
      return response.status(401).json({
        error: "The Canva access token has expired. Token refresh is required.",
      });
    }

    if (error instanceof CanvaCredentialError) {
      return response.status(503).json({
        error: "The Canva connection is unavailable.",
      });
    }

    return response.status(502).json({
      error: "The Canva export is temporarily unavailable.",
    });
  }
}
