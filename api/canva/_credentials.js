import { getSupabaseAdminClient } from "./_supabase.js";
import { decryptCanvaToken } from "./_tokens.js";

export class CanvaCredentialError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

export const loadCanvaAccessToken = async () => {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.rpc(
    "load_canva_oauth_credentials",
  );
  const credentials = Array.isArray(data) ? data[0] : null;

  if (error || !credentials || credentials.status !== "active") {
    throw new CanvaCredentialError("unavailable");
  }

  if (
    !Number.isFinite(Date.parse(credentials.access_token_expires_at)) ||
    Date.parse(credentials.access_token_expires_at) <= Date.now()
  ) {
    throw new CanvaCredentialError("refresh_required");
  }

  return decryptCanvaToken(credentials.access_token_encrypted);
};
