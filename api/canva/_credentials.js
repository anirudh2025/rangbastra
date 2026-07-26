import { getSupabaseAdminClient } from "./_supabase.js";
import {
  decryptCanvaToken,
  encryptCanvaToken,
} from "./_tokens.js";

const CANVA_TOKEN_URL = "https://api.canva.com/rest/v1/oauth/token";
const ACCESS_TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;

export class CanvaCredentialError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

const firstCredential = (data) =>
  Array.isArray(data) ? data[0] : null;

const loadStoredCredentials = async (supabase) => {
  const { data, error } = await supabase.rpc(
    "load_canva_oauth_credentials_for_refresh",
  );
  const credentials = firstCredential(data);

  if (error || !credentials || credentials.status !== "active") {
    throw new CanvaCredentialError("unavailable");
  }

  return credentials;
};

const hasUsableAccessToken = (credentials, now) => {
  const expiresAt = Date.parse(credentials.access_token_expires_at);
  return (
    Number.isFinite(expiresAt) &&
    expiresAt > now + ACCESS_TOKEN_REFRESH_BUFFER_MS
  );
};

const grantedScopesFrom = (scope, fallback) =>
  typeof scope === "string"
    ? [...new Set(scope.split(/\s+/).filter(Boolean))]
    : fallback;

const refreshAccessToken = async ({
  credentials,
  supabase,
  fetchImpl,
  now,
}) => {
  const clientId = process.env.CANVA_CLIENT_ID;
  const clientSecret = process.env.CANVA_CLIENT_SECRET;
  if (
    !clientId ||
    !clientSecret ||
    typeof credentials.refresh_token_encrypted !== "string"
  ) {
    throw new CanvaCredentialError("unavailable");
  }

  let tokenResponse;
  try {
    tokenResponse = await fetchImpl(CANVA_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`,
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: decryptCanvaToken(
          credentials.refresh_token_encrypted,
        ),
      }),
    });
  } catch {
    throw new CanvaCredentialError("unavailable");
  }

  if (!tokenResponse.ok) {
    let providerCode = "";
    try {
      const providerError = await tokenResponse.json();
      providerCode =
        typeof providerError?.code === "string"
          ? providerError.code
          : "";
    } catch {
      providerCode = "";
    }

    const latest = await loadStoredCredentials(supabase);
    if (hasUsableAccessToken(latest, now)) {
      return decryptCanvaToken(latest.access_token_encrypted);
    }
    throw new CanvaCredentialError(
      providerCode === "invalid_grant"
        ? "refresh_required"
        : "unavailable",
    );
  }

  let payload;
  try {
    payload = await tokenResponse.json();
  } catch {
    throw new CanvaCredentialError("unavailable");
  }

  if (
    typeof payload.access_token !== "string" ||
    !payload.access_token ||
    typeof payload.refresh_token !== "string" ||
    !payload.refresh_token ||
    !Number.isFinite(Number(payload.expires_in)) ||
    Number(payload.expires_in) <= 0
  ) {
    throw new CanvaCredentialError("unavailable");
  }

  const expiresAt = new Date(
    now + Number(payload.expires_in) * 1000,
  ).toISOString();
  const { error } = await supabase.rpc(
    "store_canva_oauth_credentials",
    {
      requested_access_token_encrypted: encryptCanvaToken(
        payload.access_token,
      ),
      requested_refresh_token_encrypted: encryptCanvaToken(
        payload.refresh_token,
      ),
      requested_access_token_expires_at: expiresAt,
      requested_granted_scopes: grantedScopesFrom(
        payload.scope,
        credentials.granted_scopes,
      ),
    },
  );

  if (error) {
    throw new CanvaCredentialError("unavailable");
  }

  return payload.access_token;
};

export const loadCanvaAccessToken = async ({
  supabase = getSupabaseAdminClient(),
  fetchImpl = fetch,
  now = Date.now(),
} = {}) => {
  const credentials = await loadStoredCredentials(supabase);
  if (hasUsableAccessToken(credentials, now)) {
    return decryptCanvaToken(credentials.access_token_encrypted);
  }

  return refreshAccessToken({
    credentials,
    supabase,
    fetchImpl,
    now,
  });
};
