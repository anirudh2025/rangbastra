const EDITORIAL_CLOUD_NAME = "dfxlm7z58";

const createAsset = ({
  key,
  label,
  publicId,
  canvaBinding = false,
  canvaPageLabel,
  expectedDimensions,
}) =>
  Object.freeze({
    key,
    label,
    publicId,
    canvaBinding,
    canvaPageLabel,
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
    canvaPageLabel: "About Rangbastra",
    expectedDimensions: Object.freeze({ width: 2160, height: 2700 }),
  }),
  consultation: createAsset({
    key: "consultation",
    label: "Consultation",
    publicId: "Rangbastra/Editorial/Consultation",
    canvaBinding: true,
    canvaPageLabel: "Private Consultation",
    expectedDimensions: Object.freeze({ width: 2400, height: 1500 }),
  }),
  fabricSelection: createAsset({
    key: "fabric-selection",
    label: "Fabric Selection",
    publicId: "Rangbastra/Editorial/Fabric_Selection",
    canvaBinding: true,
    canvaPageLabel: "Choosing the Fabric",
    expectedDimensions: Object.freeze({ width: 2400, height: 1500 }),
  }),
  craftDetails: createAsset({
    key: "craft-details",
    label: "Craft Details",
    publicId: "Rangbastra/Editorial/Craft_Details",
    canvaBinding: true,
    canvaPageLabel: "Every Stitch Matters",
    expectedDimensions: Object.freeze({ width: 2400, height: 1500 }),
  }),
  finalFitting: createAsset({
    key: "final-fitting",
    label: "Final Fitting",
    publicId: "Rangbastra/Editorial/Final_Fitting",
    canvaBinding: true,
    canvaPageLabel: "The Final Fitting",
    expectedDimensions: Object.freeze({ width: 2400, height: 1500 }),
  }),
  readyToBeRemembered: createAsset({
    key: "ready-to-be-remembered",
    label: "Ready To Be Remembered",
    publicId: "Rangbastra/Editorial/Ready_To_Be_Remembered",
    canvaBinding: true,
    canvaPageLabel: "Ready to Be Remembered",
    expectedDimensions: Object.freeze({ width: 2400, height: 1500 }),
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
