import {
  CanvaCredentialError,
  loadCanvaAccessToken,
} from "./_credentials.js";
import { createCanvaPngExport } from "./_export.js";

const DESIGN_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

const firstQueryValue = (value) =>
  Array.isArray(value) ? value[0] : value;

const safeCanvaError = (status, res) => {
  if (status === 401) {
    return res.status(401).json({
      error: "Canva rejected the access token. Token refresh is required.",
    });
  }
  if (status === 403) {
    return res.status(403).json({
      error: "The Canva connection cannot export this design.",
    });
  }
  if (status === 404) {
    return res.status(404).json({
      error: "The requested Canva design or export was not found.",
    });
  }
  if (status === 429) {
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
  const mode = firstQueryValue(request.query?.mode);
  const quality = firstQueryValue(request.query?.quality) ?? "pro";
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

  if (quality !== "regular" && quality !== "pro") {
    return response.status(400).json({
      error: "Quality must be regular or pro.",
    });
  }

  try {
    const accessToken = await loadCanvaAccessToken();
    const result = await createCanvaPngExport({
      accessToken,
      designId,
      page,
      quality,
    });

    if (result.status === "provider_error") {
      return safeCanvaError(result.providerStatus, response);
    }

    if (result.status === "invalid_response") {
      return response.status(502).json({
        error: "Canva returned an invalid export response.",
      });
    }

    if (result.status === "success") {
      if (mode !== "json") {
        response.setHeader("Location", result.downloadUrl);
        return response.status(302).end();
      }

      return response.status(200).json({
        design_id: designId,
        page,
        format: "png",
        status: "success",
        download_url: result.downloadUrl,
      });
    }

    if (result.status === "failed") {
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
