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

const READY_PRODUCT_ROLES = Object.freeze([
  "hero",
  "front",
  "side",
  "back",
  "detail",
  "drape",
  "editorial",
]);

const createReadyProductEntries = ({
  productSlug,
  productName,
  canvaPageIds,
}) => {
  if (canvaPageIds.length !== READY_PRODUCT_ROLES.length) {
    throw new Error("Ready Canva products must contain seven assets.");
  }

  return createProductEntries({
    productSlug,
    productName,
    assetFolder: `Rangbastra/Products/${productName}`,
    bindings: canvaPageIds.map((canvaPageId, index) => [
      canvaPageId,
      `${productName}_Web_${String(index + 1).padStart(2, "0")}`,
      READY_PRODUCT_ROLES[index],
    ]),
  });
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
    ...createReadyProductEntries({
      productSlug: "chaarvi",
      productName: "Chaarvi",
      canvaPageIds: [
        "PBjc4j56VmXLdTzM",
        "PBJ6scSgD0BTCvdC",
        "PBH24yR9FYGRxhzs",
        "PBpmNR41LJGmHGJd",
        "PB2f0Pz2lNDJkV34",
        "PBmv68040Qrtthpj",
        "PB5LTGC7c20vlyQB",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "tiara",
      productName: "Tiara",
      canvaPageIds: [
        "PBHr0YTyDTdgyQwG",
        "PBHXN358xszyRqNq",
        "PB56DYjTGmQfMvGv",
        "PBn2pXZqy2Mqs5qx",
        "PB3wtmsv36d7n8J0",
        "PB7V4sqZvmsdWXYV",
        "PBqwxVG20xxBTGSq",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "bahaar",
      productName: "Bahaar",
      canvaPageIds: [
        "PBrHc0mb7zw351PT",
        "PBgZ11r9vsRld2Q2",
        "PB8WV3wL9R03wFtt",
        "PBdrWm9tnyNGMqbG",
        "PB3WlHn1qsrFFm4D",
        "PBtKbTfQlTR4F7m4",
        "PBcRvj8TRcfcZscy",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "aarini",
      productName: "Aarini",
      canvaPageIds: [
        "PBKclzBB41gkd1ZF",
        "PB3GN1bl8FzhxZsX",
        "PBS1cb7mBLQqcGrP",
        "PBhtp36ncwlvjCl7",
        "PBbzKR27NcSsdhHC",
        "PBJFcY4FBWKq1lxm",
        "PBwyhcrQsz34M5vm",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "nirvi",
      productName: "Nirvi",
      canvaPageIds: [
        "PB2wKCPvyZLSPWnd",
        "PBTj1lCddTkgf0gJ",
        "PBxSQrnkxXFycpfL",
        "PBk7rksWkYVkwtww",
        "PBPth3kZTyfslzvf",
        "PBzl4G3V019D74c2",
        "PBF3hZLZ2vnXWs70",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "sahira",
      productName: "Sahira",
      canvaPageIds: [
        "PBV2dhPYJPX05vfW",
        "PBlbJy645jlwfTjj",
        "PBgJjdYGlK1m6Nh1",
        "PB9W7Cx02Jkybhhx",
        "PB0NHTMPvWYfsN56",
        "PBYhzBgqhLyylrfC",
        "PBMkP9LY2gNnpFy4",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "zavira",
      productName: "Zavira",
      canvaPageIds: [
        "PBFcCQ4HvNTFjkMn",
        "PBHPyNwsYlrrlnNM",
        "PBT62m66NBLbsPZJ",
        "PB0S0Tr2WfSnJ59f",
        "PBpPdHgwHNKpLLqf",
        "PBFYvGl0Xp8SvFyz",
        "PBknfQ4H3j4zBQbM",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "aureya",
      productName: "Aureya",
      canvaPageIds: [
        "PBzKl01FngdbGRFC",
        "PBTBVybLQmz28GGX",
        "PBXnMVY4fPHjWVpX",
        "PBjQbWyf8L8cDQkJ",
        "PBVX8gWrthlK6ZBV",
        "PByQS1fKHp8XTY5c",
        "PBMKsx6yNMqVkyMz",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "mishka",
      productName: "Mishka",
      canvaPageIds: [
        "PBPqh1T5PX9FY4YC",
        "PB3HfRNLs213DxnK",
        "PBXq9vZmFLQhFbcf",
        "PB3R2GHyFWXJw7CJ",
        "PBn2qcYx863lcV32",
        "PBBHt0WQR0Q1Cl7F",
        "PB5q57FSyJWRVFf7",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "varnika",
      productName: "Varnika",
      canvaPageIds: [
        "PBKLjnDcwJ3hRfXY",
        "PBZNCDJ7Zj3k5P3f",
        "PB0W6T7z2vSwg9DY",
        "PBqzBNJqBBss019n",
        "PBmLFt6yhB7cPm40",
        "PBnRzh2RnC1WrCDJ",
        "PB432G3J8wgQGnQW",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "lavanya",
      productName: "Lavanya",
      canvaPageIds: [
        "PBmgXq1SnVHbv9Nc",
        "PB1rlH7Vz8dvXbm6",
        "PBKnYHTygl1ZWnNY",
        "PBs8j1DkQNvBWfcL",
        "PB7Z5nKQK5BFjWpq",
        "PBh6y5vT8Swh3DrH",
        "PBvn8dKzX5mp2yHm",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "ruhaaya",
      productName: "Ruhaaya",
      canvaPageIds: [
        "PBXCyXGPZjxyr2kH",
        "PBx1PNrMz61sMDMv",
        "PBtScvNbhCRFqkJx",
        "PB40BpgjB8XlQFY5",
        "PB8TDmMLcbgCDD3l",
        "PBMnHMsrwM0Phzj3",
        "PBQ0zVcGjfRM7sNX",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "eshaira",
      productName: "Eshaira",
      canvaPageIds: [
        "PBYZ4TmCjpz8DlV6",
        "PBZsKq36rJ5qShMG",
        "PBWGX2VGlbKRxPlV",
        "PBxncnY0QGM00sJX",
        "PB82lGgGcWHZy95g",
        "PBJnsDHT6ppPlhVD",
        "PBhPGYsXqQNhJYkf",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "eiraa",
      productName: "Eiraa",
      canvaPageIds: [
        "PBmtXL6BPg9KR5cV",
        "PB2XDSyFBmqLR55h",
        "PBgFZbtrqLsMFCRt",
        "PBFg8SdClQjBdfSg",
        "PB8Jb2ZJlQ3VClc8",
        "PBZsgD6qt0Fql4zn",
        "PBfQ9Bn2kBmCM4N5",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "ziana",
      productName: "Ziana",
      canvaPageIds: [
        "PBZR9HSNKJjTFwB1",
        "PBmPXMWzbBl6SwnC",
        "PBMJqffLWTJwXxKX",
        "PBVjbhd27BbPt6R8",
        "PB0VH7mBP6N1vjdQ",
        "PBBSXj2NHjr7XdFy",
        "PBxPfkTxK5YbqBmB",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "aavya",
      productName: "Aavya",
      canvaPageIds: [
        "PBJBVMpTGbS5bpX7",
        "PBG6j5HFmmtgqpBP",
        "PBq3FfQjLRYTql1f",
        "PBY1tZtjKlBb5Hmn",
        "PBXtWpNfQdvpzdps",
        "PBK0nnvZgSWqrFrp",
        "PBlzycly2tHj79H2",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "anaahita",
      productName: "Anaahita",
      canvaPageIds: [
        "PB1rmKcw42tLxZR7",
        "PBBKkbV5ZnmtQcv0",
        "PBGj9ngS5y5R3hTP",
        "PBVKL7TtPCf4BKl7",
        "PBSlvysKWTRT9dzN",
        "PB1TFVmGKvG6VvVZ",
        "PBV3ZGXnqgBZ0lgW",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "riva",
      productName: "Riva",
      canvaPageIds: [
        "PBDxwG2h1MLMSr7k",
        "PBng8cMmTNkzCdWJ",
        "PBlcPJmykYdqnD3n",
        "PBYnJS3W1TFLlRMv",
        "PBCLzzFmfJkdnMX0",
        "PBhcKGbd9FsDmjF4",
        "PBccryzFzBgZBXql",
      ],
    }),
    ...createReadyProductEntries({
      productSlug: "iraaya",
      productName: "Iraaya",
      canvaPageIds: [
        "PB4sgLC5FRsybSYM",
        "PBbLRzsDvJ9qjhwm",
        "PB8jM67FKlYHbLcQ",
        "PB6BbC2fqyQ0GCWp",
        "PBFw8V4L85g8XKtF",
        "PBqHkyxTqLm5yhtG",
        "PBsCRFlZyYtZnSYl",
      ],
    }),
  ]),
);
