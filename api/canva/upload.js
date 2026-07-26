import {
  CanvaCredentialError,
  loadCanvaAccessToken,
} from "./_credentials.js";
import { uploadCanvaPngOriginal } from "./_cloudinary.js";
import { createCanvaPngExport } from "./_export.js";

const DESIGN_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

const firstQueryValue = (value) =>
  Array.isArray(value) ? value[0] : value;

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
    const exported = await createCanvaPngExport({
      accessToken,
      designId,
      page,
      quality: "pro",
    });

    if (
      exported.status === "provider_error" &&
      exported.providerStatus === 401
    ) {
      return response.status(401).json({
        error: "Canva rejected the access token. Token refresh is required.",
      });
    }

    if (exported.status !== "success") {
      return response.status(
        exported.status === "timeout" ? 504 : 502,
      ).json({
        error:
          exported.status === "timeout"
            ? "The Canva export did not finish before the timeout."
            : "Canva could not export the requested design page.",
      });
    }

    const uploaded = await uploadCanvaPngOriginal({
      downloadUrl: exported.downloadUrl,
      publicId: `rangbastra/canva-tests/${designId}-page-${page}`,
    });

    return response.status(200).json(uploaded);
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
      error: "The Canva upload is temporarily unavailable.",
    });
  }
}
