import {
  CanvaCredentialError,
  inspectCanvaCredentialReadiness,
} from "./_credentials.js";
import { getEditorialBindingStatus } from "./_editorial-bindings.js";
import { getEditorialCloudinaryAsset } from "./_editorial-cloudinary.js";
import { discoverEditorialAssets, loadEditorialCanvaPages } from "./_editorial-discovery.js";

const unverifiedDiscovery = (assets) => ({
  assets: assets.map((asset) => ({ ...asset, page: null, actualDimensions: null, status: "not_checked", reason: "Editorial Canva design is not configured." })),
  counts: { discoveredPages: 0, validMappedAssets: 0, unmappedPages: 0, invalidPages: 0 },
});

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const bindings = getEditorialBindingStatus();
  const syncSecret = Boolean(process.env.CANVA_SYNC_SECRET);
  const runtime = {
    supabase: process.env.PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? "configured" : "missing",
    canva_client: process.env.CANVA_CLIENT_ID && process.env.CANVA_CLIENT_SECRET ? "configured" : "missing",
    token_encryption: process.env.CANVA_TOKEN_ENCRYPTION_KEY ? "configured" : "missing",
    cloudinary: process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET ? "configured" : "missing",
  };

  try {
    const canva = await inspectCanvaCredentialReadiness();
    const pages = canva.accessTokenValue && bindings.designId
      ? await loadEditorialCanvaPages({ accessToken: canva.accessTokenValue, designId: bindings.designId })
      : [];
    const discovery = bindings.designId
      ? discoverEditorialAssets({ pages, assets: bindings.assets })
      : unverifiedDiscovery(bindings.assets);
    const cloudinary = await Promise.all(discovery.assets.map(async (asset) => ({
      key: asset.key,
      status: (await getEditorialCloudinaryAsset(asset.publicId)).status,
    })));
    const missingWebsiteAssets = cloudinary.filter((asset) => asset.status === "missing").length;

    return response.status(200).json({
      bindings: bindings.designId ? "configured" : "missing_design",
      assets: discovery.assets.map((asset) => ({
        key: asset.key,
        pageBinding: asset.status,
        expectedDimensions: asset.expectedDimensions,
        actualDimensions: asset.actualDimensions,
        publicId: asset.publicId,
      })),
      discovery: { ...discovery.counts, missingWebsiteAssets },
      canva: {
        storage: canva.storage,
        access_token: canva.accessToken,
        refresh: canva.refresh,
        design: { status: bindings.designId ? "available" : "not_checked" },
      },
      cloudinary,
      sync_authorization: syncSecret ? "configured" : "missing",
      runtime,
    });
  } catch (error) {
    const credentialUnavailable = error instanceof CanvaCredentialError;
    return response.status(200).json({
      bindings: bindings.designId ? "configured" : "missing_design",
      assets: bindings.assets.map((asset) => ({ key: asset.key, pageBinding: "not_checked", expectedDimensions: asset.expectedDimensions, publicId: asset.publicId })),
      discovery: { discoveredPages: 0, validMappedAssets: 0, unmappedPages: 0, invalidPages: 0, missingWebsiteAssets: 0 },
      canva: { storage: credentialUnavailable ? "unavailable" : "not_checked", design: { status: "not_checked" } },
      cloudinary: "not_checked",
      sync_authorization: syncSecret ? "configured" : "missing",
      runtime,
    });
  }
}
