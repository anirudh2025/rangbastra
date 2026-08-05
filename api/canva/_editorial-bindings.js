import {
  EDITORIAL_CLOUDINARY_CLOUD_NAME,
  EDITORIAL_SYNC_ASSETS,
} from "../../src/data/editorialAssets.js";

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
    assets: EDITORIAL_SYNC_ASSETS,
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
  return Object.freeze({ designId: status.designId, asset });
};
