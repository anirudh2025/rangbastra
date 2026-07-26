import { getSupabaseAdminClient } from "./_supabase.js";
import { decryptCanvaToken } from "./_tokens.js";

const CANVA_API_URL = "https://api.canva.com/rest/v1";
const DESIGN_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

const firstQueryValue = (value) =>
  Array.isArray(value) ? value[0] : value;

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const designId = firstQueryValue(request.query?.design_id);
  if (
    typeof designId !== "string" ||
    !DESIGN_ID_PATTERN.test(designId)
  ) {
    return response.status(400).json({
      error: "A valid design_id query parameter is required.",
    });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.rpc(
      "load_canva_oauth_credentials",
    );
    const credentials = Array.isArray(data) ? data[0] : null;

    if (error || !credentials || credentials.status !== "active") {
      return response.status(503).json({
        error: "The Canva connection is unavailable.",
      });
    }

    if (
      Date.parse(credentials.access_token_expires_at) <= Date.now()
    ) {
      return response.status(401).json({
        error: "The Canva access token has expired. Token refresh is required.",
      });
    }

    const accessToken = decryptCanvaToken(
      credentials.access_token_encrypted,
    );
    const canvaResponse = await fetch(
      `${CANVA_API_URL}/designs/${encodeURIComponent(designId)}/pages?limit=200`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (canvaResponse.status === 401) {
      return response.status(401).json({
        error: "Canva rejected the access token. Token refresh is required.",
      });
    }

    if (canvaResponse.status === 403) {
      return response.status(403).json({
        error: "The Canva connection cannot access this design.",
      });
    }

    if (canvaResponse.status === 404) {
      return response.status(404).json({
        error: "The requested Canva design was not found.",
      });
    }

    if (!canvaResponse.ok) {
      return response.status(502).json({
        error: "Canva could not retrieve the requested design.",
      });
    }

    const payload = await canvaResponse.json();
    const pages = Array.isArray(payload.items) ? payload.items : [];

    return response.status(200).json({
      design_id: designId,
      pages_returned: pages.length,
      pages: pages.map((page) => ({
        page_number: page.page_number,
        design_type: page.design_type,
        dimensions: page.dimensions
          ? {
              width: page.dimensions.width,
              height: page.dimensions.height,
            }
          : null,
      })),
    });
  } catch {
    return response.status(502).json({
      error: "The Canva design lookup is temporarily unavailable.",
    });
  }
}
