import { createHash } from "node:crypto";
import { CloudinaryUploadError, isPngBuffer } from "./_cloudinary.js";

const cloudinaryCredentials = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured.");
  }
  return { cloudName, apiKey, apiSecret };
};

const authorization = ({ apiKey, apiSecret }) =>
  `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;

export const sha256 = (value) => createHash("sha256").update(value).digest("hex");

export const getEditorialCloudinaryAsset = async (publicId) => {
  const credentials = cloudinaryCredentials();
  const result = await fetch(
    `https://api.cloudinary.com/v1_1/${credentials.cloudName}/resources/image/upload/${encodeURIComponent(publicId)}`,
    { headers: { Authorization: authorization(credentials) } },
  );

  if (result.status === 404) return { status: "missing" };
  if (!result.ok) return { status: "unavailable" };

  const asset = await result.json();
  return {
    status: "available",
    version: Number.isFinite(asset.version) ? asset.version : null,
    updatedAt: typeof asset.updated_at === "string" ? asset.updated_at : null,
    bytes: Number.isFinite(asset.bytes) ? asset.bytes : null,
    hash: asset.context?.custom?.canva_sha256 ?? null,
  };
};

export const uploadEditorialPng = async ({ png, asset, hash }) => {
  const credentials = cloudinaryCredentials();
  if (!isPngBuffer(png) || !/^[a-f0-9]{64}$/.test(hash)) {
    throw new Error("Invalid editorial PNG upload.");
  }

  const form = new FormData();
  form.append("file", new Blob([png], { type: "image/png" }), "editorial.png");
  form.append("public_id", asset.publicId);
  form.append("overwrite", "true");
  form.append("invalidate", "true");
  form.append("context", `canva_sha256=${hash}|editorial_asset_key=${asset.key}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/upload`,
    {
      method: "POST",
      headers: { Authorization: authorization(credentials) },
      body: form,
    },
  );
  if (!response.ok) {
    throw new CloudinaryUploadError({ status: response.status });
  }

  const uploaded = await response.json();
  if (
    uploaded.public_id !== asset.publicId ||
    !Number.isFinite(uploaded.version) ||
    typeof uploaded.secure_url !== "string"
  ) {
    throw new Error("Cloudinary returned an invalid editorial upload response.");
  }

  return {
    publicId: uploaded.public_id,
    version: uploaded.version,
    secureUrl: uploaded.secure_url,
    bytes: Number.isFinite(uploaded.bytes) ? uploaded.bytes : null,
  };
};
