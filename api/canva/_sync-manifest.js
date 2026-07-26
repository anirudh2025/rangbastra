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

const createProductEntries = ({
  productSlug,
  productName,
  assetFolder,
  bindings,
}) =>
  Object.freeze(
    bindings.map(([canvaPageId, publicId, websiteRole], index) =>
      Object.freeze({
        assetKey: `${productSlug}-web-${String(index + 1).padStart(2, "0")}`,
        productSlug,
        canvaPageLabel: `${productName} Web ${String(index + 1).padStart(2, "0")}`,
        canvaPageId,
        publicId,
        assetFolder,
        websiteRole,
      }),
    ),
  );

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
    ...createProductEntries({
      productSlug: "elara",
      productName: "Elara",
      assetFolder: "Rangbastra/Products/Elara",
      bindings: [
        ["PBDmyRZn3n7k2bBB", "Elara_Web_01_wyoibr", "hero"],
        ["PBWRC6hjhJjZNvfN", "Elara_Web_02_mcllu1", "front"],
        ["PBxdzNltH09zYL37", "Elara_Web_03_wf5v8x", "side"],
        ["PBXgQpJLJY2Wqvrf", "Elara_Web_04_cekq8k", "back"],
        ["PBnLqjqTsD5bv9cy", "Elara_Web_05_tuxyyq", "detail"],
        ["PB3d8WtF0b4z3qmR", "Elara_Web_06_vbg9in", "drape"],
      ],
    }),
    ...createProductEntries({
      productSlug: "noor",
      productName: "Noor",
      assetFolder: "Rangbastra/Products/Noor",
      bindings: [
        ["PB5FNFLPCVmWcYFd", "Noor_Web_01_lzgejf", "hero"],
        ["PBm3CdNmF2qLMHRy", "Noor_Web_02_a4b0d6", "front"],
        ["PBcHGfSZKsv3nsqM", "Noor_Web_03_odw8vy", "side"],
        ["PBl7jQHtL19PssRZ", "Noor_Web_04_hgfm1n", "back"],
        ["PBZ83Fsh335gPQL1", "Noor_Web_05_iknicz", "detail"],
        ["PBKJcPQ95VyBRDq4", "Noor_Web_06_dwqhey", "drape"],
        ["PBpZJch2w11fv766", "Noor_Web_07_yfdeai", "editorial"],
      ],
    }),
    ...createProductEntries({
      productSlug: "inaayat",
      productName: "Inaayat",
      assetFolder: "Rangbastra/Products/Inaayat",
      bindings: [
        ["PBvJw2FgM2CbsbT0", "Inaayat_Web_01_bnyonn", "hero"],
        ["PB31qtcWMLHfsFQj", "Inaayat_Web_02_ewc039", "front"],
        ["PB18N8K4Zxhh8DjN", "Inaayat_Web_03_jsepzz", "side"],
        ["PBMwzS0DctKMcc5v", "Inaayat_Web_04_nwlmuc", "back"],
        ["PBpZJM3b59GCNJgj", "Inaayat_Web_05_jckrsr", "detail"],
        ["PBK0tKhhYymbGhGG", "Inaayat_Web_06_tl1gir", "drape"],
        ["PBsvybhT4hybCJHR", "Inaayat_Web_07_foksqp", "editorial"],
      ],
    }),
    ...createProductEntries({
      productSlug: "amaira",
      productName: "Amaira",
      assetFolder: "Rangbastra/Products/Amaira",
      bindings: [
        ["PBnRmPrJ5K0vG2Rk", "Amaira_Web_01", "hero"],
        ["PB21vHv3f2VKnCK3", "Amaira_Web_02", "front"],
        ["PBLHLbgmJkLpyvP0", "Amaira_Web_03", "side"],
        ["PBc7GfSVPlJ0q7vp", "Amaira_Web_04", "back"],
        ["PBb0lHBpbJBH1bpF", "Amaira_Web_05", "detail"],
        ["PB6Y7tM916ZXzgdR", "Amaira_Web_06", "drape"],
      ],
    }),
    ...createProductEntries({
      productSlug: "naeyra",
      productName: "Naeyra",
      assetFolder: "Rangbastra/Products/Naeyra",
      bindings: [
        ["PBCGvZFpvWVwgtgl", "Naeyra_Web_01", "hero"],
        ["PBYGWQG69xW68sJl", "Naeyra_Web_02", "front"],
        ["PBKTC5j7m7zvb12T", "Naeyra_Web_03", "side"],
        ["PBJ2CN3pYXs9hHbg", "Naeyra_Web_04", "back"],
        ["PB5CxpxWWsvdSndq", "Naeyra_Web_05", "detail"],
        ["PB00lH8xnpYt64Fm", "Naeyra_Web_06", "drape"],
      ],
    }),
    ...createProductEntries({
      productSlug: "mahira",
      productName: "Mahira",
      assetFolder: "Rangbastra/Products/Mahira",
      bindings: [
        ["PBg246ZQXCS2LNLz", "Mahira_Web_01", "hero"],
        ["PBXkCvLTtRKRBrPt", "Mahira_Web_02", "front"],
        ["PBZdhdrlb3lLkVJj", "Mahira_Web_03", "side"],
        ["PBPfqX0Th7h7xPsh", "Mahira_Web_04", "back"],
        ["PBTfxjYjDk5SNQPy", "Mahira_Web_05", "detail"],
        ["PBX46lhFJJPncMTG", "Mahira_Web_06", "drape"],
        ["PBm0Fm6hfSWRVmQd", "Mahira_Web_07", "editorial"],
      ],
    }),
    ...createProductEntries({
      productSlug: "ayana",
      productName: "Ayana",
      assetFolder: "Rangbastra/Products/Ayana",
      bindings: [
        ["PBC7zh3ThqcMSJQp", "Ayana_Web_01", "hero"],
        ["PBRwy3Cf3cQpfzRJ", "Ayana_Web_02", "front"],
        ["PBytmzMFJ31M805D", "Ayana_Web_03", "side"],
        ["PB6fc1ljwVjddkxC", "Ayana_Web_04", "back"],
        ["PBxQRjqT6X17qLxm", "Ayana_Web_05", "detail"],
        ["PBQnKdXKqvHsSGTd", "Ayana_Web_06", "drape"],
        ["PBHV5QnL9YjCC9B0", "Ayana_Web_07", "editorial"],
      ],
    }),
  ]),
);
