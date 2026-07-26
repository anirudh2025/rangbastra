import {
  CanvaCredentialError,
  loadCanvaAccessToken,
} from "./_credentials.js";
import {
  CloudinaryUploadError,
  uploadCanvaPngOriginal,
} from "./_cloudinary.js";
import { createCanvaPngExport } from "./_export.js";

const DESIGN_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

const REPLACEMENT_TARGETS = Object.freeze({
  "gulnaar-web-01": Object.freeze({
    designId: "DAHPSPnYCvY",
    page: 67,
    publicId: "Gulnaar_Web_01_gasunw",
  }),
});

const firstQueryValue = (value) =>
  Array.isArray(value) ? value[0] : value;

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const requestedTarget = firstQueryValue(request.query?.target);
  let designId;
  let page;
  let publicId;

  if (requestedTarget !== undefined) {
    if (
      typeof requestedTarget !== "string" ||
      !Object.hasOwn(REPLACEMENT_TARGETS, requestedTarget)
    ) {
      return response.status(400).json({
        error: "Unknown Canva replacement target.",
      });
    }

    const target = REPLACEMENT_TARGETS[requestedTarget];
    designId = target.designId;
    page = target.page;
    publicId = target.publicId;
  } else {
    const requestedDesignId = firstQueryValue(request.query?.design_id);
    const requestedPage = firstQueryValue(request.query?.page);
    const parsedPage = Number(requestedPage);

    if (
      typeof requestedDesignId !== "string" ||
      !DESIGN_ID_PATTERN.test(requestedDesignId)
    ) {
      return response.status(400).json({
        error: "A valid design_id query parameter is required.",
      });
    }

    if (
      typeof requestedPage !== "string" ||
      !/^[1-9]\d*$/.test(requestedPage) ||
      !Number.isSafeInteger(parsedPage)
    ) {
      return response.status(400).json({
        error: "Page must be a positive integer.",
      });
    }

    designId = requestedDesignId;
    page = parsedPage;
    publicId = `rangbastra/canva-tests/${designId}-page-${page}`;
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
      publicId,
    });

    return response.status(200).json(uploaded);
  } catch (error) {
    if (error instanceof CloudinaryUploadError) {
      return response.status(502).json({
        error: "Cloudinary upload failed",
        status: error.status,
        ...(error.providerMessage
          ? { provider_message: error.providerMessage }
          : {}),
        ...(error.providerCode
          ? { provider_code: error.providerCode }
          : {}),
      });
    }

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
