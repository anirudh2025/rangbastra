import {
  EDITORIAL_CLOUDINARY_CLOUD_NAME,
  EDITORIAL_SYNC_ASSETS,
} from "../../src/data/editorialAssets.js";

const ENVIRONMENT_KEY_BY_ASSET = Object.freeze({
  "about-rangbastra": "CANVA_EDITORIAL_ABOUT_RANGBASTRA_PAGE_ID",
  consultation: "CANVA_EDITORIAL_CONSULTATION_PAGE_ID",
  "fabric-selection": "CANVA_EDITORIAL_FABRIC_SELECTION_PAGE_ID",
  "craft-details": "CANVA_EDITORIAL_CRAFT_DETAILS_PAGE_ID",
  "final-fitting": "CANVA_EDITORIAL_FINAL_FITTING_PAGE_ID",
  "ready-to-be-remembered": "CANVA_EDITORIAL_READY_TO_BE_REMEMBERED_PAGE_ID",
});

const isSafeIdentifier = (value) =>
  typeof value === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(value);

export const getEditorialBindingStatus = (environment = process.env) => {
  const designId = environment.CANVA_EDITORIAL_DESIGN_ID;
  const configuredCloudName = environment.CLOUDINARY_CLOUD_NAME;
  const cloudinaryConfigured =
    configuredCloudName === EDITORIAL_CLOUDINARY_CLOUD_NAME;

  return Object.freeze({
    designId: isSafeIdentifier(designId) ? designId : null,
    cloudinaryConfigured,
    assets: Object.freeze(
      EDITORIAL_SYNC_ASSETS.map((asset) => {
        const pageId = environment[ENVIRONMENT_KEY_BY_ASSET[asset.key]];
        return Object.freeze({
          ...asset,
          canvaPageId: isSafeIdentifier(pageId) ? pageId : null,
        });
      }),
    ),
  });
};

export const resolveEditorialBinding = ({ environment = process.env, key }) => {
  const status = getEditorialBindingStatus(environment);
  if (!status.designId) throw new Error("Editorial Canva design is not configured.");
  if (!status.cloudinaryConfigured) {
    throw new Error("Editorial Cloudinary delivery cloud is not configured.");
  }

  const asset = status.assets.find((entry) => entry.key === key);
  if (!asset) throw new Error("Editorial asset is not approved for synchronization.");
  if (!asset.canvaPageId) throw new Error("Editorial Canva page is not configured.");
  return Object.freeze({ designId: status.designId, asset });
};
