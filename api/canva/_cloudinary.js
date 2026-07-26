const MAX_CANVA_PNG_BYTES = 25 * 1024 * 1024;
const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

export const uploadCanvaPngOriginal = async ({
  downloadUrl,
  publicId,
}) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (
    !cloudName ||
    !/^[A-Za-z0-9_-]+$/.test(cloudName) ||
    !apiKey ||
    !apiSecret
  ) {
    throw new Error("Cloudinary is not configured.");
  }

  const canvaResponse = await fetch(downloadUrl);
  const declaredBytes = Number(
    canvaResponse.headers.get("content-length"),
  );
  if (
    !canvaResponse.ok ||
    (Number.isFinite(declaredBytes) &&
      declaredBytes > MAX_CANVA_PNG_BYTES)
  ) {
    throw new Error("Canva PNG download failed.");
  }

  const png = Buffer.from(await canvaResponse.arrayBuffer());
  if (
    png.length === 0 ||
    png.length > MAX_CANVA_PNG_BYTES ||
    !png.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)
  ) {
    throw new Error("Canva returned an invalid PNG.");
  }

  const form = new FormData();
  form.append("file", new Blob([png], { type: "image/png" }), "canva.png");
  form.append("public_id", publicId);
  form.append("overwrite", "true");
  form.append("invalidate", "true");

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${apiKey}:${apiSecret}`,
        ).toString("base64")}`,
      },
      body: form,
    },
  );

  if (!uploadResponse.ok) {
    throw new Error("Cloudinary upload failed.");
  }

  const uploaded = await uploadResponse.json();
  if (
    typeof uploaded.public_id !== "string" ||
    typeof uploaded.secure_url !== "string" ||
    uploaded.format !== "png" ||
    !Number.isFinite(uploaded.width) ||
    !Number.isFinite(uploaded.height) ||
    !Number.isFinite(uploaded.bytes)
  ) {
    throw new Error("Cloudinary returned an invalid upload response.");
  }

  return {
    public_id: uploaded.public_id,
    secure_url: uploaded.secure_url,
    format: uploaded.format,
    width: uploaded.width,
    height: uploaded.height,
    bytes: uploaded.bytes,
  };
};
