# Customer Account Platform Architecture

Status: Preview branch architecture gate. Not approved for Production.

## Current-state audit

- Astro output is static; there is no Vercel adapter, middleware, server API route, or cookie-backed Supabase SSR client.
- Browser authentication uses `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Sessions persist in browser storage.
- Google OAuth is delegated to Supabase PKCE. This project must not change its provider configuration, scopes, client ID, callback routes, or consent branding.
- Existing migrations provide owner-scoped `profiles`, `saved_inspirations`, `customization_requests`, and private request-file metadata. Raw notification events are service-only.
- The `customer-references` bucket is private, limited to 8 MiB and an image/PDF MIME allowlist. Malware scanning and quarantine are not implemented.
- Wishlist buttons and `/wishlist` are localStorage-only and store product slugs. Existing database inspirations store integer product IDs, so a product-identity migration is required before conflict-safe merging.
- Customer requests exist, but their writes use an Edge Function for guest validation. Internal staff notes are not present in the customer-readable table.
- There is no appointments schema, availability backend, board/note model, preference model, hidden-product model, moderated review subsystem, web push, or website admin role.
- Owner access currently belongs in the authenticated Supabase dashboard. `ADMIN_EMAILS` is not sufficient website authorization.

## Required trust-boundary upgrade

Before high-value customer data is activated, convert Astro to Vercel server/hybrid output and use official cookie-backed Supabase SSR clients. Protected reads and mutations require:

1. HttpOnly, Secure, SameSite=Lax cookies.
2. Server-side `auth.getUser()` validation on every protected request.
3. CSRF protection for cookie-authenticated mutations.
4. `Cache-Control: private, no-store` on protected responses.
5. Session rotation/revocation tests and generic error responses.
6. Server validation of product slugs against the canonical catalogue.

The Preview may demonstrate owner-RLS-backed low-risk profile/preferences/inspiration reads, but appointments, private attachments, messages, moderation and staff tools remain disabled until this boundary exists.

## Target schema diagram

```text
auth.users
  |--1 profiles
  |--1 user_preferences
  |--* inspiration_boards
  |     `--* saved_inspirations -- product_slug (validated server-side)
  |--* customization_requests
  |     |--* customization_request_files --> private customer-references bucket
  |     `--* request_status_events (customer-safe text only)
  |--* appointments --> availability_slots (configured, never fabricated)
  |--* notifications
  `--* hidden_products -- product_slug
```

## Phase migration plan

1. Existing `001`–`005`: profiles, saved inspirations, requests, private files, notification delivery and hardening.
2. `006_customer_account_platform.sql`: profile preference fields, boards, slug-based inspirations with notes/restore state, customer preferences, hidden products, configured availability slots, appointments, in-app notifications and customer-safe request history.
3. A later storage migration only after malware/quarantine architecture is selected: private avatar and customer-reference policies with randomized server-generated paths.
4. `007_product_interactions.sql`: moderated public/private product comments, official replies, ratings, likes, reporting, notifications and audit records. It remains deployment-gated until Preview migration/RLS/staff testing and retention/community-policy approval.

## Authorization and RLS summary

- Every customer-owned row has a non-null `user_id` referencing `auth.users` with `on delete cascade` where retention rules permit.
- Customer policies require `auth.uid() = user_id` for reads and mutations.
- Profile identity, roles, request status, notification status and ownership are never mass-assignable by customers.
- Availability slots are authenticated-read-only and inserted/updated only by service role or a future server-verified staff claim.
- Appointment status transitions are not customer-updateable directly; reschedule/cancel will use a validated server endpoint.
- Request status events expose only `customer_message`; no internal staff-note column exists in the customer-readable relation.
- Anonymous grants are revoked. Authenticated grants are the minimum required per table.

## Storage policy

- Existing `customer-references` remains private.
- Maximum two files per current request flow, 8 MiB each, JPEG/PNG/WebP/PDF, signature checked by the Edge Function.
- Paths begin with the authenticated user ID and include randomized names.
- Downloads require owner authorization and signed URLs.
- Original filenames are metadata only and must be normalized before display.
- Measurements and references are never public.
- Profile-image upload is intentionally deferred until resizing, signature inspection, deletion and quarantine behavior are implemented.

## Staff/owner access

Use the Supabase dashboard for the current MVP. A website owner console requires a server-validated immutable role/claim, MFA expectation, audit log, no-store responses and explicit least-privilege queries. Never authorize with a frontend email comparison.

## Data retention decisions required

- Profile: until account deletion plus documented backup expiry.
- Inspirations/preferences: delete with account.
- Requests and attachments: owner must approve operational/legal retention period.
- Appointment records: owner must approve post-appointment retention.
- Notifications: recommended short retention after read, pending approval.
- Security/audit events: separate restricted retention policy.

## Explicitly deferred

- Stories and any customer-to-customer messaging.
- Web push/VAPID and service worker.
- Customer/staff secure messaging.
- Live scheduling and customer reschedule/cancel mutations.
- Profile-image and new private-reference uploads.
- Website admin/owner console UI. Staff moderation is available through secured RPCs and the Supabase operational surface only.
- Any global product editing by customers.

## Deployment gate

- Apply migrations to a disposable Preview Supabase project first.
- Pass owner-positive, anonymous-negative and cross-user-negative RLS tests.
- Complete server-session migration, CSRF and expiry tests.
- Complete upload signature/size/cross-user tests before enabling uploads.
- Run build, security suite, dependency audit, accessibility and responsive QA.
- Do not merge or attach the Preview branch to the Production domain during Google branding review.

## Preview implementation map

- `/account`: authenticated customer shell with URL-fragment deep links for every section.
- `CustomerAccountPlatform.astro`: overview, profile, inspirations, request history, configured appointments, notifications, preferences and privacy controls.
- `/wishlist`: remains the guest, device-local shortlist. On authenticated account load, canonical catalogue matches are merged into `saved_inspirations` and the local list is cleared only after a successful database write.
- `/design-your-outfit`: remains the canonical detailed couture-request route.
- `/account/activity`: authenticated RPC-backed comments, privacy/moderation state, official replies, ratings and liked products.
- `/products/[slug]`: approved public comments and honest rating aggregates for everyone; authenticated pending/private contributions, rating and appreciation controls for the owner.

### Developer control guide

- Account navigation labels and order: `sections` in `CustomerAccountPlatform.astro`.
- Account responsive boundary: 900 px for horizontal mobile navigation and 600 px for single-column forms/cards.
- Availability is configured only in `availability_slots`; never add demo slots to the component.
- Customer profile fields exposed to updates are controlled twice: the form payload allowlist and column-level grants in migration `006`.
- Notification customers can update only `read_at`; content and delivery are service-controlled.
- Do not enable the intentionally disabled panels by adding placeholder data. Complete the trust-boundary and moderation work first.
