import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

const getTokenKey = () => {
  const key = Buffer.from(
    process.env.CANVA_TOKEN_ENCRYPTION_KEY ?? "",
    "base64url",
  );
  if (key.length !== 32) {
    throw new Error("Canva token encryption is not configured.");
  }
  return key;
};

export const encryptCanvaToken = (token) => {
  if (typeof token !== "string" || !token) {
    throw new Error("Cannot encrypt an empty Canva token.");
  }

  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getTokenKey(), nonce);
  const ciphertext = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);

  return [
    "v1",
    nonce.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
};

export const decryptCanvaToken = (encryptedToken) => {
  const [version, encodedNonce, encodedTag, encodedCiphertext] =
    String(encryptedToken ?? "").split(".");
  if (
    version !== "v1" ||
    !encodedNonce ||
    !encodedTag ||
    !encodedCiphertext
  ) {
    throw new Error("Invalid encrypted Canva token.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getTokenKey(),
    Buffer.from(encodedNonce, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(encodedTag, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encodedCiphertext, "base64url")),
    decipher.final(),
  ]).toString("utf8");
};
