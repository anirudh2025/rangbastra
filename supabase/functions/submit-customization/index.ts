// @ts-nocheck -- Checked and deployed by the Supabase Deno runtime.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.7";
import { allowedOrigin, corsHeaders, hasOversizedBody, hasValidSignature, jsonResponse, requestId, safeFileName } from "../_shared/security.ts";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const text = (form: FormData, key: string, max: number) => String(form.get(key) ?? "").trim().slice(0, max);
const allowed = (value: string, choices: readonly string[], fallback = "") => choices.includes(value) ? value : fallback;

Deno.serve(async (request) => {
  const id = requestId();
  const origin = allowedOrigin(request);
  if (request.headers.has("origin") && !origin) return jsonResponse({ error: "Origin not allowed", requestId: id }, 403, null, id);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed", requestId: id }, 405, origin, id);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data")) return jsonResponse({ error: "Unsupported media type", requestId: id }, 415, origin, id);
  if (hasOversizedBody(request)) return jsonResponse({ error: "Request too large", requestId: id }, 413, origin, id);

  try {
    const url = Deno.env.get("PUBLIC_SUPABASE_URL"), service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !service) return jsonResponse({ error: "Service unavailable", requestId: id }, 503, origin, id);
    const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
    const authorization = request.headers.get("Authorization") ?? "";
    let userId: string | null = null;
    if (authorization) {
      const token = authorization.replace(/^Bearer\s+/i, "");
      const { data, error } = await admin.auth.getUser(token);
      if (error || !data.user) return jsonResponse({ error: "Invalid authorization", requestId: id }, 401, origin, id);
      userId = data.user.id;
    }

    const form = await request.formData();
    if (form.get("contactConsent") !== "on") return jsonResponse({ error: "Contact consent is required", requestId: id }, 400, origin, id);
    const email = text(form, "email", 254);
    if (!/^[^\s@]{1,64}@[^\s@]{1,189}\.[^\s@]{2,}$/.test(email)) return jsonResponse({ error: "Enter a valid email", requestId: id }, 400, origin, id);
    const productId = Number(form.get("productId"));
    if (!Number.isSafeInteger(productId) || productId < 1) return jsonResponse({ error: "Invalid product", requestId: id }, 400, origin, id);

    const files = [...form.entries()].filter(([, value]) => value instanceof File && value.size > 0) as [string, File][];
    if (files.length > 2) return jsonResponse({ error: "Too many files", requestId: id }, 400, origin, id);
    for (const [, file] of files) {
      if (file.size > 8 * 1024 * 1024 || !allowedTypes.has(file.type) || !(await hasValidSignature(file)))
        return jsonResponse({ error: "An upload is invalid", requestId: id }, 400, origin, id);
    }

    const measurements = Object.fromEntries([...form.entries()].filter(([key, value]) => key.startsWith("measurement_") && typeof value === "string" && value).flatMap(([key, value]) => {
      const number = Number(value); return Number.isFinite(number) && number > 0 && number < 400 ? [[key.slice(12, 60), number]] : [];
    }));
    const payload = {
      user_id: userId, product_id: productId, product_slug: text(form, "productSlug", 100), product_name_snapshot: text(form, "productName", 140),
      selected_palette_id: text(form, "paletteId", 80), requested_colour: text(form, "requestedColour", 300), detail_preferences: text(form, "detailPreferences", 3000),
      customer_name: text(form, "fullName", 120), email, phone: text(form, "phone", 30), location: text(form, "location", 200),
      contact_preference: allowed(text(form, "contactPreference", 40), ["email", "phone", "whatsapp"]), occasion: text(form, "occasion", 100),
      event_date: text(form, "eventDate", 10) || null, delivery_date: text(form, "deliveryDate", 10) || null, appointment_preference: text(form, "appointmentPreference", 80),
      measurement_method: allowed(text(form, "measurementMethod", 30), ["standard", "custom", "upload"], "standard"), measurement_unit: allowed(text(form, "measurementUnit", 4), ["cm", "in"], "cm"),
      measurements, notes: text(form, "notes", 5000), contact_consent: true, marketing_consent: form.get("marketingConsent") === "on",
    };
    if (!payload.product_slug || !payload.product_name_snapshot || !payload.customer_name || !payload.phone) return jsonResponse({ error: "Required details are missing", requestId: id }, 400, origin, id);
    const { data: created, error } = await admin.from("customization_requests").insert(payload).select("id,reference_number").single();
    if (error) throw error;

    for (const [kind, file] of files) {
      const owner = userId ?? `guest-${created.id}`;
      const path = `${owner}/${created.id}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
      const { error: uploadError } = await admin.storage.from("customer-references").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) continue;
      await admin.from("customization_request_files").insert({ request_id: created.id, user_id: userId, storage_path: path, file_kind: kind === "measurementSheet" ? "measurement_sheet" : "reference", original_filename: safeFileName(file.name), mime_type: file.type, size_bytes: file.size });
    }
    return jsonResponse({ reference: created.reference_number, requestId: id }, 201, origin, id);
  } catch (error) {
    console.error("submit-customization failed", { requestId: id, type: error instanceof Error ? error.name : "unknown" });
    return jsonResponse({ error: "Unable to submit request", requestId: id }, 500, origin, id);
  }
});
