import { CanvaCredentialError, loadCanvaAccessToken } from "./_credentials.js";
import { getEditorialBindingStatus } from "./_editorial-bindings.js";
import { getEditorialCloudinaryAsset } from "./_editorial-cloudinary.js";
import { discoverEditorialAssets, loadEditorialCanvaPages } from "./_editorial-discovery.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const bindings = getEditorialBindingStatus();
    const accessToken = bindings.designId ? await loadCanvaAccessToken() : null;
    const pages = accessToken
      ? await loadEditorialCanvaPages({ accessToken, designId: bindings.designId })
      : [];
    const discovery = discoverEditorialAssets({ pages, assets: bindings.assets });
    const assets = await Promise.all(discovery.assets.map(async (asset) => ({
      key: asset.key,
      label: asset.label,
      previewUrl: asset.url,
      publicId: asset.publicId,
      canvaPageId: asset.page?.id ?? asset.canvaPageId,
      canvaPageTitle: asset.page?.title ?? null,
      expectedDimensions: asset.expectedDimensions,
      actualDimensions: asset.actualDimensions,
      mappingStatus: asset.status,
      mappingReason: asset.reason,
      cloudinary: await getEditorialCloudinaryAsset(asset.publicId),
    })));

    return response.status(200).json({
      canva: bindings.designId ? "configured" : "missing_design",
      cloudinary: bindings.cloudinaryConfigured ? "configured" : "configuration_mismatch",
      discovery: {
        ...discovery.counts,
        duplicateKeys: discovery.duplicateKeys,
        unmappedPages: discovery.unmappedPages,
      },
      assets,
    });
  } catch (error) {
    if (error instanceof CanvaCredentialError) {
      return response.status(503).json({ error: "Canva connection is unavailable." });
    }
    return response.status(503).json({ error: "Editorial status is temporarily unavailable." });
  }
}
