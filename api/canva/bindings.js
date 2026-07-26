import {
  CanvaCredentialError,
  loadCanvaAccessToken,
} from "./_credentials.js";
import { CANVA_SYNC_MANIFEST } from "./_sync-manifest.js";
import { toSafeCanvaPage } from "./design.js";

const CANVA_DESIGN_ID = "DAHPSPnYCvY";
const CANVA_API_URL = "https://api.canva.com/rest/v1";
const PAGE_LIMIT = 200;
const MAX_PAGES = 500;

const BINDINGS_BY_PAGE_ID = new Map(
  CANVA_SYNC_MANIFEST.map((entry) => [
    entry.canvaPageId,
    {
      assetKey: entry.assetKey,
      productSlug: entry.productSlug,
    },
  ]),
);

export const toSafeCanvaBindingPage = (page) => {
  const safePage = toSafeCanvaPage(page);
  const binding = safePage.page_id
    ? BINDINGS_BY_PAGE_ID.get(safePage.page_id)
    : undefined;

  return {
    page_id: safePage.page_id,
    page_number: safePage.page_number,
    bound_asset_key: binding?.assetKey ?? null,
    bound_product: binding?.productSlug ?? null,
    design_type: safePage.design_type,
    dimensions: safePage.dimensions,
  };
};

export const loadAllCanvaPages = async (accessToken) => {
  const pages = [];

  for (let offset = 1; offset <= MAX_PAGES; offset += PAGE_LIMIT) {
    const limit = Math.min(PAGE_LIMIT, MAX_PAGES - offset + 1);
    const canvaResponse = await fetch(
      `${CANVA_API_URL}/designs/${CANVA_DESIGN_ID}/pages?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!canvaResponse.ok) {
      return {
        status: "provider_error",
        providerStatus: canvaResponse.status,
      };
    }

    const payload = await canvaResponse.json();
    if (!Array.isArray(payload.items)) {
      return { status: "invalid_response" };
    }

    pages.push(...payload.items);
    if (payload.items.length < limit) break;
  }

  return { status: "success", pages };
};

const safeCanvaError = (status, response) => {
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
      error: "Canva page lookup rate limit reached. Try again later.",
    });
  }
  return response.status(502).json({
    error: "Canva could not retrieve the design pages.",
  });
};

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const accessToken = await loadCanvaAccessToken();
    const result = await loadAllCanvaPages(accessToken);

    if (result.status === "provider_error") {
      return safeCanvaError(result.providerStatus, response);
    }

    if (result.status !== "success") {
      return response.status(502).json({
        error: "Canva returned an invalid page response.",
      });
    }

    return response.status(200).json({
      design_id: CANVA_DESIGN_ID,
      pages_returned: result.pages.length,
      pages: result.pages.map(toSafeCanvaBindingPage),
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
      error: "The Canva binding lookup is temporarily unavailable.",
    });
  }
}
