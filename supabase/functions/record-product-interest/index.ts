// @ts-nocheck -- Checked and deployed by the Supabase Deno runtime.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.7";
import { allowedOrigin, corsHeaders, hasOversizedBody, jsonResponse, requestId } from "../_shared/security.ts";

const truthfulFallbacks = [
  "Recently admired",
  "Receiving quiet attention",
  "A piece people are returning to",
  "Currently receiving attention",
];
const digest = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)))).map((byte) => byte.toString(16).padStart(2, "0")).join("");

Deno.serve(async (request) => {
  const id = requestId(), origin = allowedOrigin(request);
  if (request.headers.has("origin") && !origin) return jsonResponse({ error: "Origin not allowed", requestId: id }, 403, null, id);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed", requestId: id }, 405, origin, id);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return jsonResponse({ error: "Unsupported media type", requestId: id }, 415, origin, id);
  if (hasOversizedBody(request, 2048)) return jsonResponse({ error: "Request too large", requestId: id }, 413, origin, id);

  try {
    const url = Deno.env.get("PUBLIC_SUPABASE_URL"), service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), hashSecret = Deno.env.get("INTEREST_HASH_SECRET");
    if (!url || !service || !hashSecret || hashSecret.length < 32) return jsonResponse({ error: "Service unavailable", requestId: id }, 503, origin, id);
    const body = await request.json(), productSlug = String(body?.productSlug ?? "").trim().toLowerCase(), anonymousSession = String(body?.anonymousSession ?? "");
    if (!/^[a-z0-9-]{1,120}$/.test(productSlug) || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(anonymousSession)) return jsonResponse({ error: "Invalid request", requestId: id }, 400, origin, id);
    const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const networkHash = await digest(`${hashSecret}:${ip}`), admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
    const authorization = request.headers.get("authorization") ?? "";
    const token = authorization.replace(/^Bearer\s+/i, "");
    const { data: authData } = token ? await admin.auth.getUser(token) : { data: { user: null } };
    const userId = authData.user?.id ?? null;
    const dayAgo = new Date(Date.now() - 86_400_000).toISOString(), sixHoursAgo = new Date(Date.now() - 21_600_000).toISOString(), weekAgo = new Date(Date.now() - 604_800_000).toISOString();
    const [{ count: networkCount }, { count: productNetworkCount }, { data: duplicate }] = await Promise.all([
      admin.from("product_interest_events").select("id", { count: "exact", head: true }).eq("network_hash", networkHash).gte("viewed_at", dayAgo),
      admin.from("product_interest_events").select("id", { count: "exact", head: true }).eq("network_hash", networkHash).eq("product_slug", productSlug).gte("viewed_at", dayAgo),
      userId
        ? admin.from("product_interest_events").select("id").eq("product_slug", productSlug).eq("user_id", userId).gte("viewed_at", sixHoursAgo).limit(1)
        : admin.from("product_interest_events").select("id").eq("product_slug", productSlug).eq("anonymous_session", anonymousSession).gte("viewed_at", sixHoursAgo).limit(1),
    ]);
    if ((networkCount ?? 0) >= 60 || (productNetworkCount ?? 0) >= 10) return jsonResponse({ error: "Rate limit exceeded", requestId: id }, 429, origin, id);
    if (!duplicate?.length) await admin.from("product_interest_events").insert({ product_slug: productSlug, user_id: userId, anonymous_session: userId ? null : anonymousSession, network_hash: networkHash });
    const { data: recent } = await admin.from("product_interest_events").select("user_id,anonymous_session").eq("product_slug", productSlug).gte("viewed_at", weekAgo).limit(1000);
    const count = new Set((recent ?? []).map((row) => row.user_id ?? row.anonymous_session).filter(Boolean)).size;
    const text = count >= 3 ? `${count} people explored this piece recently` : truthfulFallbacks[productSlug.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0) % truthfulFallbacks.length];
    return jsonResponse({ count: count >= 3 ? count : null, text, requestId: id }, 200, origin, id);
  } catch (error) {
    console.error("record-product-interest failed", { requestId: id, type: error instanceof Error ? error.name : "unknown" });
    return jsonResponse({ error: "Unable to record interest", requestId: id }, 500, origin, id);
  }
});
