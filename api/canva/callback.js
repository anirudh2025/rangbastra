import { timingSafeEqual } from "node:crypto";
import {
  openCanvaOAuthTransaction,
  readCanvaOAuthCookie,
  serializeClearedCanvaOAuthCookie,
} from "./_oauth.js";
import { getSupabaseAdminClient } from "./_supabase.js";
import { encryptCanvaToken } from "./_tokens.js";

const CANVA_TOKEN_URL = "https://api.canva.com/rest/v1/oauth/token";
const CANVA_REDIRECT_URI =
  "https://rangbastra.luxury/api/canva/callback";

const firstQueryValue = (value) =>
  Array.isArray(value) ? value[0] : value;

const statesMatch = (receivedState, expectedState) => {
  const received = Buffer.from(receivedState);
  const expected = Buffer.from(expectedState);

  return (
    received.length === expected.length &&
    timingSafeEqual(received, expected)
  );
};

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.setHeader("Set-Cookie", serializeClearedCanvaOAuthCookie());

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).send("Method not allowed.");
  }

  const code = firstQueryValue(request.query?.code);
  const state = firstQueryValue(request.query?.state);
  const error = firstQueryValue(request.query?.error);

  if (error) {
    return response
      .status(400)
      .send("Canva authorization was denied or failed.");
  }

  if (!code) {
    return response
      .status(400)
      .send("Canva authorization callback is missing the code parameter.");
  }

  if (!state) {
    return response
      .status(400)
      .send("Canva authorization state is missing or invalid.");
  }

  const sealedTransaction = readCanvaOAuthCookie(
    request.headers?.cookie,
  );
  const transaction = sealedTransaction
    ? openCanvaOAuthTransaction(sealedTransaction)
    : null;

  if (!transaction || !statesMatch(state, transaction.state)) {
    return response
      .status(400)
      .send("Canva authorization state is missing, expired, or invalid.");
  }

  const clientId = process.env.CANVA_CLIENT_ID;
  const clientSecret = process.env.CANVA_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return response
      .status(500)
      .send("Canva authentication is not configured.");
  }

  try {
    const tokenResponse = await fetch(CANVA_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`,
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        code_verifier: transaction.codeVerifier,
        redirect_uri: CANVA_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      return response
        .status(502)
        .send("Canva could not complete the authorization exchange.");
    }

    const tokenPayload = await tokenResponse.json();
    if (
      typeof tokenPayload.access_token !== "string" ||
      !tokenPayload.access_token ||
      typeof tokenPayload.refresh_token !== "string" ||
      !tokenPayload.refresh_token ||
      !Number.isFinite(Number(tokenPayload.expires_in)) ||
      Number(tokenPayload.expires_in) <= 0
    ) {
      return response
        .status(502)
        .send("Canva returned an incomplete authorization response.");
    }

    const grantedScopes =
      typeof tokenPayload.scope === "string"
        ? [...new Set(tokenPayload.scope.split(/\s+/).filter(Boolean))]
        : null;
    const accessTokenExpiresAt = new Date(
      Date.now() + Number(tokenPayload.expires_in) * 1000,
    ).toISOString();
    const supabase = getSupabaseAdminClient();
    const { error: storageError } = await supabase.rpc(
      "store_canva_oauth_credentials",
      {
        requested_access_token_encrypted: encryptCanvaToken(
          tokenPayload.access_token,
        ),
        requested_refresh_token_encrypted: encryptCanvaToken(
          tokenPayload.refresh_token,
        ),
        requested_access_token_expires_at: accessTokenExpiresAt,
        requested_granted_scopes: grantedScopes,
      },
    );

    if (storageError) {
      return response
        .status(502)
        .send("Canva credentials could not be stored securely.");
    }

    return response
      .status(200)
      .send(
        "Canva connected successfully and credentials stored securely.",
      );
  } catch {
    return response
      .status(502)
      .send("Canva authorization is temporarily unavailable.");
  }
}
