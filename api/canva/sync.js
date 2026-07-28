import { timingSafeEqual } from "node:crypto";
import sharp from "sharp";
import {
  CanvaCredentialError,
  loadCanvaAccessToken,
} from "./_credentials.js";
import {
  CloudinaryUploadError,
  downloadCanvaPng,
  isPngBuffer,
  uploadPngOriginal,
} from "./_cloudinary.js";
import { createCanvaPngExport } from "./_export.js";
import { CANVA_SYNC_MANIFEST } from "./_sync-manifest.js";
import { loadAllCanvaPages } from "./bindings.js";

export const SYNC_PRODUCTS = Object.freeze({
  gulnaar: 6,
  elara: 6,
  noor: 7,
  inaayat: 7,
  amaira: 6,
  naeyra: 6,
  mahira: 7,
  ayana: 7,
  chaarvi: 7,
  tiara: 7,
  bahaar: 7,
  aarini: 7,
  nirvi: 7,
  sahira: 7,
  zavira: 7,
  aureya: 7,
  mishka: 7,
  varnika: 7,
  lavanya: 7,
  ruhaaya: 7,
  eshaira: 7,
  eiraa: 7,
  ziana: 7,
  aavya: 7,
  anaahita: 7,
  riva: 7,
  iraaya: 7,
});
const PRODUCT_ROLES = Object.freeze([
  "hero",
  "front",
  "side",
  "back",
  "detail",
  "drape",
  "editorial",
]);
const EXPECTED_DIMENSIONS = Object.freeze({
  width: 2160,
  height: 2700,
});
const PRODUCTION_DIMENSIONS = Object.freeze({
  width: 1900,
  height: 2375,
});
const MAX_CLOUDINARY_IMAGE_BYTES = 10 * 1024 * 1024;
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

export const resolveProductBindings = ({ manifest, pages, product }) => {
  const expectedCount = SYNC_PRODUCTS[product];
  if (!expectedCount) {
    throw new Error("Product is not approved for synchronization.");
  }

  const entries = manifest.filter(
    (entry) => entry.productSlug === product,
  );
  const expectedAssetKeys = Array.from(
    { length: expectedCount },
    (_, index) =>
      `${product}-web-${String(index + 1).padStart(2, "0")}`,
  );

  if (
    entries.length !== expectedCount ||
    entries.some(
      (entry, index) =>
        entry.assetKey !== expectedAssetKeys[index] ||
        entry.websiteRole !== PRODUCT_ROLES[index],
    ) ||
    expectedAssetKeys.some(
      (assetKey) =>
        !entries.some((entry) => entry.assetKey === assetKey),
    )
  ) {
    throw new Error("Unexpected product sync manifest.");
  }

  assertUnique(
    entries.map((entry) => entry.assetKey),
    "product asset key",
  );
  assertUnique(
    entries.map((entry) => entry.canvaPageId),
    "product Canva page ID",
  );
  assertUnique(
    entries.map((entry) => entry.publicId),
    "product Cloudinary public ID",
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
      throw new Error("A Canva page binding could not be resolved.");
    }
    if (
      !Number.isSafeInteger(page.page_number) ||
      page.page_number < 1
    ) {
      throw new Error("A Canva page number is invalid.");
    }
    if (
      page.dimensions?.width !== EXPECTED_DIMENSIONS.width ||
      page.dimensions?.height !== EXPECTED_DIMENSIONS.height
    ) {
      throw new Error("A Canva page has unexpected dimensions.");
    }

    return Object.freeze({
      entry,
      currentPageNumber: page.page_number,
    });
  });

  assertUnique(
    resolved.map(({ currentPageNumber }) => currentPageNumber),
    "resolved Canva page",
  );

  return Object.freeze(resolved);
};

export const exportProductBindings = async ({
  bindings,
  accessToken,
  exportFn = createCanvaPngExport,
}) =>
  Promise.all(
    bindings.map(async (binding) => ({
      binding,
      exported: await exportFn({
        accessToken,
        designId: "DAHPSPnYCvY",
        page: binding.currentPageNumber,
        quality: "pro",
      }),
    })),
  );

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
    error: "Canva could not export every product asset.",
  });
};

export const resizeCanvaPngForProduction = async (sourcePng) => {
  if (!isPngBuffer(sourcePng)) {
    throw new Error("The Canva source is not a valid PNG.");
  }

  const source = await sharp(sourcePng, {
    failOn: "error",
  }).metadata();
  if (
    source.format !== "png" ||
    source.width !== EXPECTED_DIMENSIONS.width ||
    source.height !== EXPECTED_DIMENSIONS.height ||
    !Number.isSafeInteger(source.channels) ||
    (source.depth !== "uchar" && source.depth !== "ushort")
  ) {
    throw new Error("The Canva source PNG is invalid.");
  }

  let pipeline = sharp(sourcePng, { failOn: "error" })
    .resize({
      width: PRODUCTION_DIMENSIONS.width,
      height: PRODUCTION_DIMENSIONS.height,
      fit: "inside",
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: true,
    })
    .keepMetadata();

  if (source.depth === "ushort") {
    pipeline = pipeline.toColourspace("rgb16");
  }

  const { data, info } = await pipeline
    .png({
      palette: false,
      compressionLevel: 9,
      adaptiveFiltering: true,
    })
    .toBuffer({ resolveWithObject: true });
  const final = await sharp(data, { failOn: "error" }).metadata();

  if (
    !isPngBuffer(data) ||
    info.format !== "png" ||
    info.width !== PRODUCTION_DIMENSIONS.width ||
    info.height !== PRODUCTION_DIMENSIONS.height ||
    final.format !== "png" ||
    final.width !== PRODUCTION_DIMENSIONS.width ||
    final.height !== PRODUCTION_DIMENSIONS.height ||
    final.channels !== source.channels ||
    final.hasAlpha !== source.hasAlpha ||
    final.depth !== source.depth
  ) {
    throw new Error("The production PNG failed validation.");
  }

  return Object.freeze({
    png: data,
    source: Object.freeze({
      width: source.width,
      height: source.height,
      bytes: sourcePng.length,
    }),
    final: Object.freeze({
      width: final.width,
      height: final.height,
      bytes: data.length,
    }),
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
  if (
    typeof product !== "string" ||
    !Object.hasOwn(SYNC_PRODUCTS, product)
  ) {
    return response.status(400).json({
      error: "The requested product is not approved for synchronization.",
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
      resolved = resolveProductBindings({
        manifest: CANVA_SYNC_MANIFEST,
        pages: pageResult.pages,
        product,
      });
    } catch {
      return response.status(409).json({
        error: "The product asset bindings failed preflight validation.",
      });
    }

    const exportResults = await exportProductBindings({
      bindings: resolved,
      accessToken,
    });

    for (const { binding, exported } of exportResults) {
      if (exported.status === "provider_error") {
        return safeExportError(exported.providerStatus, response);
      }
      if (exported.status !== "success") {
        const timeout =
          exported.status === "timeout"
            ? {
                asset_key: binding.entry.assetKey,
                canva_page_id: binding.entry.canvaPageId,
                current_page_number: binding.currentPageNumber,
                export_job_status: exported.jobStatus,
                elapsed_ms: exported.elapsedMs,
                poll_count: exported.pollCount,
              }
            : null;
        return response.status(
          exported.status === "timeout" ? 504 : 502,
        ).json({
          error:
            exported.status === "timeout"
              ? "A Canva export timed out."
              : "Canva could not export every product asset.",
          ...(timeout ? { timed_out_asset: timeout } : {}),
        });
      }
    }

    const prepared = [];
    for (const { binding, exported } of exportResults) {
      const sourcePng = await downloadCanvaPng(exported.downloadUrl);
      const resized = await resizeCanvaPngForProduction(sourcePng);
      prepared.push({ binding, ...resized });
    }

    const oversized = prepared
      .filter(({ final }) => final.bytes > MAX_CLOUDINARY_IMAGE_BYTES)
      .map(({ binding, final }) => ({
        assetKey: binding.entry.assetKey,
        publicId: binding.entry.publicId,
        finalBytes: final.bytes,
        maximumBytes: MAX_CLOUDINARY_IMAGE_BYTES,
      }));
    if (oversized.length > 0) {
      return response.status(413).json({
        error: "One or more production PNGs exceed the upload limit.",
        assets: oversized,
      });
    }

    const assets = [];
    for (const asset of prepared) {
      const uploaded = await uploadPngOriginal({
        png: asset.png,
        publicId: asset.binding.entry.publicId,
      });
      assets.push({
        asset_key: asset.binding.entry.assetKey,
        source_dimensions: {
          width: asset.source.width,
          height: asset.source.height,
        },
        final_dimensions: {
          width: asset.final.width,
          height: asset.final.height,
        },
        source_bytes: asset.source.bytes,
        final_bytes: asset.final.bytes,
        public_id: uploaded.public_id,
        version: uploaded.version,
        secure_url: uploaded.secure_url,
        format: uploaded.format,
      });
    }

    return response.status(200).json({
      product,
      assets,
    });
  } catch (error) {
    if (error instanceof CloudinaryUploadError) {
      return response.status(502).json({
        error: "A product Cloudinary upload failed.",
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
      error: "The product synchronization is temporarily unavailable.",
    });
  }
}
