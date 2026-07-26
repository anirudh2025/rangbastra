const MAX_CANVA_PNG_BYTES = 25 * 1024 * 1024;
const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

export class CloudinaryUploadError extends Error {
  constructor({ status, providerMessage, providerCode }) {
    super("Cloudinary upload failed.");
    this.status = status;
    this.providerMessage = providerMessage;
    this.providerCode = providerCode;
  }
}

const safeProviderText = (value, secrets) => {
  if (typeof value !== "string" && typeof value !== "number") {
    return undefined;
  }

  const text = String(value).replace(/[\r\n\t]/g, " ").trim();
  if (
    !text ||
    text.length > 300 ||
    secrets.some((secret) => secret && text.includes(secret)) ||
    /\b(?:authorization|bearer|basic)\b/i.test(text)
  ) {
    return undefined;
  }

  return text;
};

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
    let providerError;
    try {
      providerError = (await uploadResponse.json())?.error;
    } catch {
      providerError = null;
    }

    const secrets = [apiKey, apiSecret];
    const providerMessage = safeProviderText(
      providerError?.message ??
        uploadResponse.headers.get("x-cld-error"),
      secrets,
    );
    const providerCode = safeProviderText(
      providerError?.code ?? providerError?.type,
      secrets,
    );
    const diagnostic = {
      status: uploadResponse.status,
      ...(providerMessage
        ? { provider_message: providerMessage }
        : {}),
      ...(providerCode ? { provider_code: providerCode } : {}),
    };

    console.error("Cloudinary upload failed", diagnostic);
    throw new CloudinaryUploadError({
      status: uploadResponse.status,
      providerMessage,
      providerCode,
    });
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
