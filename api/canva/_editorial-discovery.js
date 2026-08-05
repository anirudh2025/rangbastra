import {
  EDITORIAL_SYNC_ASSETS,
  getEditorialAssetForCanvaTitle,
} from "../../src/data/editorialAssets.js";

const CANVA_PAGES_URL = (designId) =>
  `https://api.canva.com/rest/v1/designs/${encodeURIComponent(designId)}/pages?limit=200`;

const dimensionsMatch = (actual, expected) =>
  actual?.width === expected.width && actual?.height === expected.height;

const toSafePage = (page) => ({
  id: typeof page?.id === "string" ? page.id : null,
  pageNumber: Number.isSafeInteger(page?.page_number)
    ? page.page_number
    : Number.isSafeInteger(page?.pageNumber)
      ? page.pageNumber
      : null,
  title: typeof page?.title === "string"
    ? page.title
    : typeof page?.name === "string"
      ? page.name
      : null,
  dimensions: page?.dimensions?.width && page?.dimensions?.height
    ? { width: page.dimensions.width, height: page.dimensions.height }
    : null,
});

export const loadEditorialCanvaPages = async ({ accessToken, designId }) => {
  const response = await fetch(CANVA_PAGES_URL(designId), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error("Canva pages are unavailable.");
  const items = (await response.json())?.items;
  return Array.isArray(items) ? items.map(toSafePage) : [];
};

export const discoverEditorialAssets = ({ pages, assets = EDITORIAL_SYNC_ASSETS }) => {
  const safePages = Array.isArray(pages) ? pages.map(toSafePage).filter((page) => page.id) : [];
  const titleMatches = new Map();

  for (const page of safePages) {
    const asset = page.title ? getEditorialAssetForCanvaTitle(page.title) : null;
    if (!asset) continue;
    const matches = titleMatches.get(asset.key) ?? [];
    matches.push(page);
    titleMatches.set(asset.key, matches);
  }

  const assignedIds = new Set();
  const duplicateKeys = [];
  const mappings = assets.map((asset) => {
    const titledPages = titleMatches.get(asset.key) ?? [];
    const manifestPage = safePages.find((page) => page.id === asset.canvaPageId) ?? null;
    const matchedByTitle = titledPages.length === 1 ? titledPages[0] : null;
    const page = matchedByTitle ?? manifestPage;
    const source = matchedByTitle ? "title" : manifestPage ? "manifest" : null;

    if (titledPages.length > 1) {
      duplicateKeys.push(asset.key);
      return {
        ...asset,
        page: null,
        source: null,
        actualDimensions: null,
        status: "duplicate",
        reason: "Multiple Canva pages resolve to this editorial asset.",
      };
    }
    if (!page || !page.pageNumber) {
      return {
        ...asset,
        page: null,
        source: null,
        actualDimensions: null,
        status: "missing",
        reason: "The approved Canva page was not found in this design.",
      };
    }
    if (assignedIds.has(page.id)) {
      duplicateKeys.push(asset.key);
      return {
        ...asset,
        page: null,
        source: null,
        actualDimensions: null,
        status: "duplicate",
        reason: "This Canva page resolves to more than one editorial asset.",
      };
    }
    assignedIds.add(page.id);
    if (!dimensionsMatch(page.dimensions, asset.expectedDimensions)) {
      return {
        ...asset,
        page,
        source,
        actualDimensions: page.dimensions,
        status: "dimension_mismatch",
        reason: "Canva page dimensions do not match the approved editorial asset.",
      };
    }
    return {
      ...asset,
      page,
      source,
      actualDimensions: page.dimensions,
      status: asset.enabled ? "valid" : "disabled",
      reason: asset.enabled ? null : "This editorial asset is disabled in the registry.",
    };
  });

  const mappedIds = new Set(mappings.flatMap((mapping) => mapping.page?.id ? [mapping.page.id] : []));
  const unmappedPages = safePages.filter((page) => !mappedIds.has(page.id));
  const invalidAssets = mappings.filter((mapping) => !["valid", "disabled"].includes(mapping.status));

  return {
    pages: safePages,
    assets: mappings,
    unmappedPages,
    duplicateKeys: [...new Set(duplicateKeys)],
    counts: {
      discoveredPages: safePages.length,
      validMappedAssets: mappings.filter((mapping) => mapping.status === "valid").length,
      unmappedPages: unmappedPages.length,
      invalidPages: invalidAssets.length,
    },
  };
};
