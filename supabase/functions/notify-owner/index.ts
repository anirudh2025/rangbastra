// @ts-nocheck -- Checked and deployed by the Supabase Deno runtime.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.7";
import { constantTimeEqual, escapeHtml, requestId } from "../_shared/security.ts";

const response = (message: string, status: number, id: string) => new Response(message, { status, headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff", "X-Request-Id": id } });

Deno.serve(async (request) => {
  const id = requestId();
  if (request.method !== "POST") return response("Method not allowed", 405, id);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return response("Unsupported media type", 415, id);
  const configuredSecret = Deno.env.get("WEBHOOK_SECRET") ?? "";
  const suppliedSecret = request.headers.get("x-webhook-secret") ?? "";
  if (configuredSecret.length < 32 || !constantTimeEqual(suppliedSecret, configuredSecret)) return response("Unauthorized", 401, id);

  try {
    const body = await request.json();
    const recordId = String(body?.record?.id ?? "");
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(recordId)) return response("Invalid request", 400, id);
    const url = Deno.env.get("PUBLIC_SUPABASE_URL"), key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), resend = Deno.env.get("RESEND_API_KEY");
    const from = Deno.env.get("OWNER_FROM_EMAIL"), to = Deno.env.get("OWNER_NOTIFICATION_EMAIL");
    if (!url || !key || !resend || !from || !to) return response("Service unavailable", 503, id);
    const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: notification } = await admin.from("customer_notifications").select("id,status,attempts,user_id,profiles:user_id(full_name,email,phone,city,country,marketing_consent)").eq("id", recordId).single();
    if (!notification || notification.status === "sent") return response("Accepted", 202, id);
    const { data: claimed } = await admin.from("customer_notifications").update({ status: "processing", attempts: notification.attempts + 1 }).eq("id", recordId).in("status", ["pending", "failed"]).select("id").maybeSingle();
    if (!claimed) return response("Accepted", 202, id);
    const profile = notification.profiles;
    const emailResponse = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resend}`, "Content-Type": "application/json", "Idempotency-Key": `rangbastra-notification-${recordId}` }, body: JSON.stringify({ from, to: [to], subject: "New verified Rangbastra customer", html: `<h1>New verified customer</h1><p>${escapeHtml(profile?.full_name || "Name not shared")}</p><p>${escapeHtml(profile?.email)}</p><p>${escapeHtml(profile?.phone || "No phone")} &middot; ${escapeHtml(profile?.city)} ${escapeHtml(profile?.country)}</p><p>Marketing consent: ${profile?.marketing_consent ? "Yes" : "No"}</p><p>Review this record in the authenticated Supabase dashboard.</p>` }) });
    if (!emailResponse.ok) throw new Error(`Email provider status ${emailResponse.status}`);
    await admin.from("customer_notifications").update({ status: "sent", sent_at: new Date().toISOString(), last_error: null }).eq("id", recordId);
    return response("Accepted", 202, id);
  } catch (error) {
    console.error("notify-owner failed", { requestId: id, type: error instanceof Error ? error.name : "unknown" });
    return response("Delivery unavailable", 502, id);
  }
});
