import {
  CanvaCredentialError,
  inspectCanvaCredentialReadiness,
} from "./_credentials.js";
import { getEditorialBindingStatus } from "./_editorial-bindings.js";
import { getEditorialCloudinaryAsset } from "./_editorial-cloudinary.js";

const canvaDesignIsReachable = async ({ accessToken, designId, bindings }) => {
  const response = await fetch(
    `https://api.canva.com/rest/v1/designs/${encodeURIComponent(designId)}/pages?limit=200`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!response.ok) return { status: "unavailable" };
  const pages = (await response.json())?.items;
  if (!Array.isArray(pages)) return { status: "unavailable" };

  return {
    status: "available",
    pages: bindings.map((asset) => {
      const page = pages.find((item) => item?.id === asset.canvaPageId);
      const dimensionsMatch =
        page?.dimensions?.width === asset.expectedDimensions.width &&
        page?.dimensions?.height === asset.expectedDimensions.height;
      return {
        key: asset.key,
        pageBinding: page && dimensionsMatch ? "valid" : "invalid",
      };
    }),
  };
};

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const bindings = getEditorialBindingStatus();
  const bindingStatus = bindings.assets.map((asset) => ({
    key: asset.key,
    configured: Boolean(asset.canvaPageId),
    expectedDimensions: asset.expectedDimensions,
    publicId: asset.publicId,
  }));
  const syncSecret = Boolean(process.env.CANVA_SYNC_SECRET);
  const runtime = {
    supabase: process.env.PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
      ? "configured"
      : "missing",
    canva_client: process.env.CANVA_CLIENT_ID && process.env.CANVA_CLIENT_SECRET
      ? "configured"
      : "missing",
    token_encryption: process.env.CANVA_TOKEN_ENCRYPTION_KEY
      ? "configured"
      : "missing",
    cloudinary: process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
      ? "configured"
      : "missing",
  };

  try {
    const canva = await inspectCanvaCredentialReadiness();
    const design = canva.accessTokenValue
      ? await canvaDesignIsReachable({
          accessToken: canva.accessTokenValue,
          designId: bindings.designId,
          bindings: bindings.assets,
        })
      : { status: "not_checked" };
    const cloudinary = await Promise.all(
      bindings.assets.map(async (asset) => ({
        key: asset.key,
        status: (await getEditorialCloudinaryAsset(asset.publicId)).status,
      })),
    );

    return response.status(200).json({
      bindings: bindings.designId ? "configured" : "missing_design",
      assets: bindingStatus,
      canva: {
        storage: canva.storage,
        access_token: canva.accessToken,
        refresh: canva.refresh,
        design,
      },
      cloudinary,
      sync_authorization: syncSecret ? "configured" : "missing",
      runtime,
    });
  } catch (error) {
    const credentialUnavailable = error instanceof CanvaCredentialError;
    return response.status(200).json({
      bindings: bindings.designId ? "configured" : "missing_design",
      assets: bindingStatus,
      canva: { storage: credentialUnavailable ? "unavailable" : "not_checked" },
      cloudinary: "not_checked",
      sync_authorization: syncSecret ? "configured" : "missing",
      runtime,
    });
  }
}
