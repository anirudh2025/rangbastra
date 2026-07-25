import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

export const CANVA_OAUTH_COOKIE_NAME = "__Host-canva_oauth";
export const CANVA_OAUTH_COOKIE_MAX_AGE_SECONDS = 10 * 60;

const getCookieKey = () => {
  const encodedKey = process.env.CANVA_OAUTH_COOKIE_SECRET;
  if (!encodedKey) {
    throw new Error("Canva OAuth cookie encryption is not configured.");
  }

  const key = Buffer.from(encodedKey, "base64url");
  if (key.length !== 32) {
    throw new Error("Canva OAuth cookie encryption is not configured.");
  }

  return key;
};

export const createCanvaOAuthTransaction = () => {
  const codeVerifier = randomBytes(96).toString("base64url");
  const codeChallenge = createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");
  const state = randomBytes(48).toString("base64url");

  return { codeVerifier, codeChallenge, state };
};

export const sealCanvaOAuthTransaction = ({ codeVerifier, state }) => {
  const initializationVector = randomBytes(12);
  const cipher = createCipheriv(
    "aes-256-gcm",
    getCookieKey(),
    initializationVector,
  );
  const plaintext = JSON.stringify({
    codeVerifier,
    state,
    expiresAt:
      Date.now() + CANVA_OAUTH_COOKIE_MAX_AGE_SECONDS * 1000,
  });
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  return [
    "v1",
    initializationVector.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
};

export const openCanvaOAuthTransaction = (sealedTransaction) => {
  const [version, encodedIv, encodedTag, encodedCiphertext] =
    String(sealedTransaction ?? "").split(".");
  if (
    version !== "v1" ||
    !encodedIv ||
    !encodedTag ||
    !encodedCiphertext
  ) {
    return null;
  }

  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      getCookieKey(),
      Buffer.from(encodedIv, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(encodedTag, "base64url"));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(encodedCiphertext, "base64url")),
      decipher.final(),
    ]).toString("utf8");
    const transaction = JSON.parse(plaintext);

    if (
      typeof transaction.codeVerifier !== "string" ||
      typeof transaction.state !== "string" ||
      typeof transaction.expiresAt !== "number" ||
      transaction.expiresAt <= Date.now()
    ) {
      return null;
    }

    return transaction;
  } catch {
    return null;
  }
};

export const serializeCanvaOAuthCookie = (sealedTransaction) =>
  [
    `${CANVA_OAUTH_COOKIE_NAME}=${sealedTransaction}`,
    "Path=/",
    `Max-Age=${CANVA_OAUTH_COOKIE_MAX_AGE_SECONDS}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
  ].join("; ");
