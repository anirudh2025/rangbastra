const EDITORIAL_CLOUD_NAME = "cloutoraworld";

const createAsset = ({
  key,
  label,
  publicId,
  canvaBinding = false,
  canvaPageId,
  canvaTitleAliases = [],
  enabled = true,
  expectedDimensions,
}) =>
  Object.freeze({
    key,
    label,
    publicId,
    canvaBinding,
    enabled,
    canvaPageId,
    canvaTitleAliases: Object.freeze(canvaTitleAliases),
    expectedDimensions,
    url: `https://res.cloudinary.com/${EDITORIAL_CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`,
  });

/**
 * The single website-facing registry for editorial imagery. Public IDs are
 * deliberately stable: Editorial Sync overwrites these originals, so a new
 * Canva export never requires a source change or deployment.
 */
export const EDITORIAL_ASSETS = Object.freeze({
  aboutRangbastra: createAsset({
    key: "about-rangbastra",
    label: "About Rangbastra",
    publicId: "Rangbastra/Editorial/About_Rangbastra",
    canvaBinding: true,
    canvaPageId: "PBFcTRJHk3ffvyrm",
    canvaTitleAliases: ["About RB", "About Rangbastra"],
    expectedDimensions: Object.freeze({ width: 1920, height: 2400 }),
  }),
  shareYourVision: createAsset({
    key: "share-your-vision",
    label: "Share Your Vision",
    publicId: "Rangbastra/Editorial/Share_Your_Vision",
    canvaBinding: true,
    canvaPageId: "PBHDj0t9zQGW1pzY",
    canvaTitleAliases: ["Share Your Vision"],
    expectedDimensions: Object.freeze({ width: 1920, height: 1200 }),
  }),
  consultation: createAsset({
    key: "consultation",
    label: "Consultation",
    publicId: "Rangbastra/Editorial/Consultation",
    canvaBinding: true,
    canvaPageId: "PBV78ghBKrkHfF6f",
    canvaTitleAliases: ["Private Consultation"],
    expectedDimensions: Object.freeze({ width: 1920, height: 1200 }),
  }),
  fabricSelection: createAsset({
    key: "fabric-selection",
    label: "Fabric Selection",
    publicId: "Rangbastra/Editorial/Fabric_Selection",
    canvaBinding: true,
    canvaPageId: "PBD3K1th4pX5GYRq",
    canvaTitleAliases: ["Choosing the Fabric"],
    expectedDimensions: Object.freeze({ width: 1920, height: 1200 }),
  }),
  craftDetails: createAsset({
    key: "craft-details",
    label: "Craft Details",
    publicId: "Rangbastra/Editorial/Craft_Details",
    canvaBinding: true,
    canvaPageId: "PBcyTbYGJP0bd1Bs",
    canvaTitleAliases: ["Every Stitch Matters"],
    expectedDimensions: Object.freeze({ width: 1920, height: 1200 }),
  }),
  finalFitting: createAsset({
    key: "final-fitting",
    label: "Final Fitting",
    publicId: "Rangbastra/Editorial/Final_Fitting",
    canvaBinding: true,
    canvaPageId: "PBHH6wkp4Xz20xM1",
    canvaTitleAliases: ["The Final Fitting"],
    expectedDimensions: Object.freeze({ width: 1920, height: 1200 }),
  }),
  readyToBeRemembered: createAsset({
    key: "ready-to-be-remembered",
    label: "Ready To Be Remembered",
    publicId: "Rangbastra/Editorial/Ready_To_Be_Remembered",
    canvaBinding: true,
    canvaPageId: "PBbFvcS3D2dXgZsJ",
    canvaTitleAliases: ["Ready to be Remembered", "Ready to Be Remembered"],
    expectedDimensions: Object.freeze({ width: 1920, height: 1200 }),
  }),
  bridalEdit: createAsset({
    key: "bridal-edit",
    label: "Bridal Edit",
    publicId: "Bridal_Edit_wajwba",
  }),
  coutureEdit: createAsset({
    key: "couture-edit",
    label: "Couture Edit",
    publicId: "Couture_Edit_u7kmac",
  }),
  festiveEdit: createAsset({
    key: "festive-edit",
    label: "Festive Edit",
    publicId: "Festive_Edit_boj0wo",
  }),
  signatureEdit: createAsset({
    key: "signature-edit",
    label: "Signature Edit",
    publicId: "Signature_Edit_k9aiop",
  }),
  rbHero: createAsset({
    key: "rb-hero",
    label: "Rangbastra Hero",
    publicId: "RB_Hero_v7dyxg",
  }),
});

export const EDITORIAL_SYNC_ASSETS = Object.freeze(
  Object.values(EDITORIAL_ASSETS).filter((asset) => asset.canvaBinding),
);

export const normalizeCanvaPageTitle = (value) =>
  typeof value === "string"
    ? value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9|]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";

/**
 * Supports the future Canva naming convention: `canonical-key | Friendly title`.
 * A title is accepted only when its key is registered or it exactly matches an
 * approved alias after conservative normalisation.
 */
export const getEditorialAssetForCanvaTitle = (title) => {
  const normalized = normalizeCanvaPageTitle(title);
  if (!normalized) return null;
  const rawCandidateKey = typeof title === "string" ? title.split("|", 1)[0] : "";
  const candidateKey = rawCandidateKey
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  const prefixed = assetsByKey.get(candidateKey);
  if (prefixed?.canvaBinding) return prefixed;

  return (
    EDITORIAL_SYNC_ASSETS.find((asset) =>
      asset.canvaTitleAliases.some(
        (alias) => normalizeCanvaPageTitle(alias) === normalized,
      ),
    ) ?? null
  );
};

const assetsByKey = new Map(
  Object.values(EDITORIAL_ASSETS).map((asset) => [asset.key, asset]),
);

export const getEditorialAsset = (key) => {
  const asset = assetsByKey.get(key);
  if (!asset) throw new Error(`Unknown editorial asset: ${key}`);
  return asset;
};

export const getEditorialAssetUrl = (key) => getEditorialAsset(key).url;

export const EDITORIAL_CLOUDINARY_CLOUD_NAME = EDITORIAL_CLOUD_NAME;
