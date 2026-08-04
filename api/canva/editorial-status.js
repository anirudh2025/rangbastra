import { CanvaCredentialError, loadCanvaAccessToken } from "./_credentials.js";
import { getEditorialBindingStatus } from "./_editorial-bindings.js";
import { getEditorialCloudinaryAsset } from "./_editorial-cloudinary.js";

const loadCanvaPages = async ({ accessToken, designId }) => {
  const response = await fetch(
    `https://api.canva.com/rest/v1/designs/${encodeURIComponent(designId)}/pages?limit=200`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!response.ok) throw new Error("Canva pages are unavailable.");
  const pages = (await response.json())?.items;
  return Array.isArray(pages) ? pages : [];
};

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
      ? await loadCanvaPages({ accessToken, designId: bindings.designId })
      : [];

    const assets = await Promise.all(
      bindings.assets.map(async (asset) => {
        const page = pages.find((item) => item?.id === asset.canvaPageId);
        const dimensionsMatch =
          page?.dimensions?.width === asset.expectedDimensions.width &&
          page?.dimensions?.height === asset.expectedDimensions.height;
        return {
          key: asset.key,
          label: asset.label,
          canvaPageLabel: asset.canvaPageLabel,
          previewUrl: asset.url,
          publicId: asset.publicId,
          canvaPageId: asset.canvaPageId,
          expectedDimensions: asset.expectedDimensions,
          actualDimensions: page?.dimensions ?? null,
          canvaPageConfigured: Boolean(asset.canvaPageId && page && dimensionsMatch),
          cloudinary: await getEditorialCloudinaryAsset(asset.publicId),
        };
      }),
    );

    return response.status(200).json({
      canva: bindings.designId ? "configured" : "missing_design",
      cloudinary: bindings.cloudinaryConfigured ? "configured" : "configuration_mismatch",
      assets,
    });
  } catch (error) {
    if (error instanceof CanvaCredentialError) {
      return response.status(503).json({ error: "Canva connection is unavailable." });
    }
    return response.status(503).json({ error: "Editorial status is temporarily unavailable." });
  }
}
