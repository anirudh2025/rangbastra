const REQUIRED_FIELDS = [
  "assetKey",
  "productSlug",
  "canvaPageLabel",
  "canvaPageId",
  "publicId",
  "assetFolder",
  "websiteRole",
];

const assertUnique = (entries, field, reuseFlag) => {
  const seen = new Map();

  for (const entry of entries) {
    const existing = seen.get(entry[field]);
    if (
      existing &&
      (!reuseFlag || !existing[reuseFlag] || !entry[reuseFlag])
    ) {
      throw new Error(`Duplicate Canva sync manifest ${field}.`);
    }
    seen.set(entry[field], entry);
  }
};

export const validateCanvaSyncManifest = (entries) => {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error("Canva sync manifest must contain at least one asset.");
  }

  for (const entry of entries) {
    for (const field of REQUIRED_FIELDS) {
      if (
        typeof entry?.[field] !== "string" ||
        !entry[field].trim()
      ) {
        throw new Error(
          `Canva sync manifest entry is missing ${field}.`,
        );
      }
    }
  }

  assertUnique(entries, "assetKey");
  assertUnique(entries, "canvaPageId", "allowCanvaPageIdReuse");
  assertUnique(entries, "publicId", "allowPublicIdReuse");

  return entries;
};

export const CANVA_SYNC_MANIFEST = Object.freeze(
  validateCanvaSyncManifest([
    Object.freeze({
      assetKey: "gulnaar-web-01",
      productSlug: "gulnaar",
      canvaPageLabel: "Gulnaar Web 01",
      canvaPageId: "PB46zJw7dT4CwsZd",
      publicId: "Gulnaar_Web_01_gasunw",
      assetFolder: "Rangbastra/Products/Gulnaar 001✨",
      websiteRole: "hero",
    }),
    Object.freeze({
      assetKey: "gulnaar-web-02",
      productSlug: "gulnaar",
      canvaPageLabel: "Gulnaar Web 02",
      canvaPageId: "PB3WRqX4sXNyjTwh",
      publicId: "Gulnaar_Web_02_gjfxct",
      assetFolder: "Rangbastra/Products/Gulnaar 001✨",
      websiteRole: "front",
    }),
    Object.freeze({
      assetKey: "gulnaar-web-03",
      productSlug: "gulnaar",
      canvaPageLabel: "Gulnaar Web 03",
      canvaPageId: "PBqVF874x36bK0Gr",
      publicId: "Gulnaar_Web_03_h9rvca",
      assetFolder: "Rangbastra/Products/Gulnaar 001✨",
      websiteRole: "side",
    }),
    Object.freeze({
      assetKey: "gulnaar-web-04",
      productSlug: "gulnaar",
      canvaPageLabel: "Gulnaar Web 04",
      canvaPageId: "PBHj1gWX645dPjgW",
      publicId: "Gulnaar_Web_04_kf5vnc",
      assetFolder: "Rangbastra/Products/Gulnaar 001✨",
      websiteRole: "back",
    }),
    Object.freeze({
      assetKey: "gulnaar-web-05",
      productSlug: "gulnaar",
      canvaPageLabel: "Gulnaar Web 05",
      canvaPageId: "PBwDXkjTkx0sYYPy",
      publicId: "Gulnaar_Web_05_rrxwtl",
      assetFolder: "Rangbastra/Products/Gulnaar 001✨",
      websiteRole: "detail",
    }),
    Object.freeze({
      assetKey: "gulnaar-web-06",
      productSlug: "gulnaar",
      canvaPageLabel: "Gulnaar Web 06",
      canvaPageId: "PBMpHhw8zRxFGQl6",
      publicId: "Gulnaar_Web_06_we87zg",
      assetFolder: "Rangbastra/Products/Gulnaar 001✨",
      websiteRole: "drape",
    }),
  ]),
);
