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
  ]),
);
