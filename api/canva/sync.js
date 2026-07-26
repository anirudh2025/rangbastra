import { timingSafeEqual } from "node:crypto";
import {
  CanvaCredentialError,
  loadCanvaAccessToken,
} from "./_credentials.js";
import {
  CloudinaryUploadError,
  uploadCanvaPngOriginal,
} from "./_cloudinary.js";
import { createCanvaPngExport } from "./_export.js";
import { CANVA_SYNC_MANIFEST } from "./_sync-manifest.js";
import { loadAllCanvaPages } from "./bindings.js";

const ALLOWED_PRODUCT = "gulnaar";
const EXPECTED_DIMENSIONS = Object.freeze({
  width: 2160,
  height: 2700,
});
const EXPECTED_GULNAAR_ASSETS = Object.freeze({
  "gulnaar-web-01": "hero",
  "gulnaar-web-02": "front",
  "gulnaar-web-03": "side",
  "gulnaar-web-04": "back",
  "gulnaar-web-05": "detail",
  "gulnaar-web-06": "drape",
});

const firstQueryValue = (value) =>
  Array.isArray(value) ? value[0] : value;

export const hasValidSyncAuthorization = (authorization, secret) => {
  if (
    typeof authorization !== "string" ||
    typeof secret !== "string" ||
    !secret
  ) {
    return false;
  }

  const prefix = "Bearer ";
  if (!authorization.startsWith(prefix)) return false;

  const supplied = Buffer.from(authorization.slice(prefix.length));
  const expected = Buffer.from(secret);
  return (
    supplied.length === expected.length &&
    timingSafeEqual(supplied, expected)
  );
};

const assertUnique = (values, label) => {
  if (new Set(values).size !== values.length) {
    throw new Error(`Duplicate ${label}.`);
  }
};

export const resolveGulnaarBindings = ({ manifest, pages }) => {
  const entries = manifest.filter(
    (entry) => entry.productSlug === ALLOWED_PRODUCT,
  );
  const expectedAssetKeys = Object.keys(EXPECTED_GULNAAR_ASSETS);

  if (
    entries.length !== expectedAssetKeys.length ||
    entries.some(
      (entry) =>
        !Object.hasOwn(EXPECTED_GULNAAR_ASSETS, entry.assetKey) ||
        EXPECTED_GULNAAR_ASSETS[entry.assetKey] !== entry.websiteRole,
    ) ||
    expectedAssetKeys.some(
      (assetKey) =>
        !entries.some((entry) => entry.assetKey === assetKey),
    )
  ) {
    throw new Error("Unexpected Gulnaar sync manifest.");
  }

  assertUnique(
    entries.map((entry) => entry.assetKey),
    "Gulnaar asset key",
  );
  assertUnique(
    entries.map((entry) => entry.canvaPageId),
    "Gulnaar Canva page ID",
  );
  assertUnique(
    entries.map((entry) => entry.publicId),
    "Gulnaar Cloudinary public ID",
  );

  const pagesById = new Map();
  for (const page of pages) {
    if (typeof page.id !== "string" || !page.id) continue;
    if (pagesById.has(page.id)) {
      throw new Error("Duplicate Canva design page ID.");
    }
    pagesById.set(page.id, page);
  }

  const resolved = entries.map((entry) => {
    const page = pagesById.get(entry.canvaPageId);
    if (!page) {
      throw new Error("A Gulnaar Canva page binding could not be resolved.");
    }
    if (
      !Number.isSafeInteger(page.page_number) ||
      page.page_number < 1
    ) {
      throw new Error("A Gulnaar Canva page number is invalid.");
    }
    if (
      page.dimensions?.width !== EXPECTED_DIMENSIONS.width ||
      page.dimensions?.height !== EXPECTED_DIMENSIONS.height
    ) {
      throw new Error("A Gulnaar Canva page has unexpected dimensions.");
    }

    return Object.freeze({
      entry,
      currentPageNumber: page.page_number,
    });
  });

  assertUnique(
    resolved.map(({ currentPageNumber }) => currentPageNumber),
    "resolved Gulnaar Canva page",
  );

  return Object.freeze(resolved);
};

const safeCanvaPageError = (status, response) => {
  if (status === 401) {
    return response.status(401).json({
      error: "Canva rejected the access token. Token refresh is required.",
    });
  }
  if (status === 403) {
    return response.status(403).json({
      error: "The Canva connection cannot access this design.",
    });
  }
  if (status === 404) {
    return response.status(404).json({
      error: "The Canva design was not found.",
    });
  }
  if (status === 429) {
    return response.status(429).json({
      error: "Canva rate limit reached. Try again later.",
    });
  }
  return response.status(502).json({
    error: "Canva could not retrieve the design pages.",
  });
};

const safeExportError = (status, response) => {
  if (status === 401) {
    return response.status(401).json({
      error: "Canva rejected the access token. Token refresh is required.",
    });
  }
  if (status === 429) {
    return response.status(429).json({
      error: "Canva export rate limit reached. Try again later.",
    });
  }
  return response.status(502).json({
    error: "Canva could not export every Gulnaar asset.",
  });
};

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const product = firstQueryValue(request.query?.product);
  if (product !== ALLOWED_PRODUCT) {
    return response.status(400).json({
      error: "Only the Gulnaar product can be synchronized.",
    });
  }

  const syncSecret = process.env.CANVA_SYNC_SECRET;
  if (!syncSecret) {
    return response.status(503).json({
      error: "Canva synchronization is not configured.",
    });
  }
  if (
    !hasValidSyncAuthorization(
      request.headers?.authorization,
      syncSecret,
    )
  ) {
    return response.status(401).json({
      error: "Canva synchronization authorization failed.",
    });
  }

  try {
    const accessToken = await loadCanvaAccessToken();
    const pageResult = await loadAllCanvaPages(accessToken);

    if (pageResult.status === "provider_error") {
      return safeCanvaPageError(pageResult.providerStatus, response);
    }
    if (pageResult.status !== "success") {
      return response.status(502).json({
        error: "Canva returned an invalid page response.",
      });
    }

    let resolved;
    try {
      resolved = resolveGulnaarBindings({
        manifest: CANVA_SYNC_MANIFEST,
        pages: pageResult.pages,
      });
    } catch {
      return response.status(409).json({
        error: "The Gulnaar asset bindings failed preflight validation.",
      });
    }

    const exports = [];
    for (const binding of resolved) {
      const exported = await createCanvaPngExport({
        accessToken,
        designId: "DAHPSPnYCvY",
        page: binding.currentPageNumber,
        quality: "pro",
      });

      if (exported.status === "provider_error") {
        return safeExportError(exported.providerStatus, response);
      }
      if (exported.status !== "success") {
        return response.status(
          exported.status === "timeout" ? 504 : 502,
        ).json({
          error:
            exported.status === "timeout"
              ? "A Gulnaar Canva export timed out."
              : "Canva could not export every Gulnaar asset.",
        });
      }

      exports.push({ binding, downloadUrl: exported.downloadUrl });
    }

    const assets = [];
    for (const exported of exports) {
      const uploaded = await uploadCanvaPngOriginal({
        downloadUrl: exported.downloadUrl,
        publicId: exported.binding.entry.publicId,
      });
      assets.push({
        asset_key: exported.binding.entry.assetKey,
        canva_page_id: exported.binding.entry.canvaPageId,
        current_page_number: exported.binding.currentPageNumber,
        ...uploaded,
      });
    }

    return response.status(200).json({
      product: ALLOWED_PRODUCT,
      assets,
    });
  } catch (error) {
    if (error instanceof CloudinaryUploadError) {
      return response.status(502).json({
        error: "A Gulnaar Cloudinary upload failed.",
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
      error: "The Gulnaar synchronization is temporarily unavailable.",
    });
  }
}
