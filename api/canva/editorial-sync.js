import { timingSafeEqual } from "node:crypto";
import sharp from "sharp";
import { CanvaCredentialError, loadCanvaAccessToken } from "./_credentials.js";
import { downloadCanvaPng, isPngBuffer, CloudinaryUploadError } from "./_cloudinary.js";
import { createCanvaPngExport } from "./_export.js";
import { resolveEditorialBinding } from "./_editorial-bindings.js";
import { getEditorialCloudinaryAsset, sha256, uploadEditorialPng } from "./_editorial-cloudinary.js";

const MAX_BYTES = 10 * 1024 * 1024;
const firstQueryValue = (value) => Array.isArray(value) ? value[0] : value;

const authorized = (value, secret) => {
  if (typeof value !== "string" || typeof secret !== "string" || !secret || !value.startsWith("Bearer ")) return false;
  const supplied = Buffer.from(value.slice(7));
  const expected = Buffer.from(secret);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
};

const getCanvaPage = async ({ accessToken, designId, pageId, expectedDimensions }) => {
  const result = await fetch(`https://api.canva.com/rest/v1/designs/${encodeURIComponent(designId)}/pages?limit=200`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!result.ok) throw new Error("Canva could not retrieve the editorial design.");
  const pages = (await result.json())?.items;
  const page = Array.isArray(pages) ? pages.find((item) => item?.id === pageId) : null;
  if (!page || !Number.isSafeInteger(page.page_number) || page.page_number < 1) {
    throw new Error("The configured Canva page could not be found.");
  }
  if (
    page.dimensions?.width !== expectedDimensions.width ||
    page.dimensions?.height !== expectedDimensions.height
  ) {
    throw new Error("Canva page dimensions do not match the approved editorial asset.");
  }
  return page;
};

const preparePng = async (source, expectedDimensions) => {
  if (!isPngBuffer(source)) throw new Error("Canva did not return a valid PNG.");
  const image = sharp(source, { failOn: "error" });
  const metadata = await image.metadata();
  if (
    metadata.format !== "png" ||
    metadata.width !== expectedDimensions.width ||
    metadata.height !== expectedDimensions.height
  ) throw new Error("Canva export dimensions do not match the approved editorial asset.");
  if (source.length > MAX_BYTES) throw new Error("Editorial PNG exceeds the upload limit.");
  return source;
};

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }
  const secret = process.env.CANVA_SYNC_SECRET;
  if (!authorized(request.headers?.authorization, secret)) return response.status(401).json({ error: "Canva synchronization authorization failed." });

  try {
    const key = firstQueryValue(request.query?.asset);
    if (typeof key !== "string") return response.status(400).json({ error: "An editorial asset is required." });
    const binding = resolveEditorialBinding({ key });
    const accessToken = await loadCanvaAccessToken();
    const page = await getCanvaPage({ accessToken, designId: binding.designId, pageId: binding.asset.canvaPageId, expectedDimensions: binding.asset.expectedDimensions });
    const exported = await createCanvaPngExport({ accessToken, designId: binding.designId, page: page.page_number, quality: "pro" });
    if (exported.status !== "success") return response.status(502).json({ error: "Canva could not export the editorial asset." });
    const png = await preparePng(await downloadCanvaPng(exported.downloadUrl), binding.asset.expectedDimensions);
    const hash = sha256(png);
    const current = await getEditorialCloudinaryAsset(binding.asset.publicId);
    if (current.status === "available" && current.hash === hash) {
      return response.status(200).json({ status: "no_changes", asset: binding.asset.key, last_sync: current.updatedAt });
    }
    const uploaded = await uploadEditorialPng({ png, asset: binding.asset, hash });
    return response.status(200).json({ status: "synced", asset: binding.asset.key, public_id: uploaded.publicId, version: uploaded.version, bytes: uploaded.bytes });
  } catch (error) {
    if (error instanceof CloudinaryUploadError) return response.status(502).json({ error: "Editorial Cloudinary upload failed." });
    if (error instanceof CanvaCredentialError) return response.status(503).json({ error: "Canva connection is unavailable." });
    return response.status(409).json({ error: error instanceof Error ? error.message : "Editorial synchronization failed." });
  }
}
