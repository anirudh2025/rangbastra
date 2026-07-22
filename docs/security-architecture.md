# Security Architecture

Status: reviewed 2026-07-17. Target: OWASP ASVS Level 2 where applicable.

## Trust boundaries

1. The browser receives a static Astro application from Vercel. All browser input, storage, URL state, and public Supabase credentials are untrusted.
2. Supabase Auth issues user tokens. The Data API relies on explicit Postgres grants plus RLS; neither layer replaces the other.
3. Supabase Edge Functions are the privileged application boundary. Only they may read service-role, notification, or webhook secrets.
4. Private customer references live in a non-public Storage bucket. Metadata and objects are linked by randomized server-generated paths.
5. Resend receives the minimum verified-account notification needed by the owner. Provider responses and customer data must not enter logs.

## Authentication and sessions

The present static account implementation stores the Supabase session in browser storage and renders `/account` client-side. This is not equivalent to a server-protected account route and remains vulnerable to token theft following an XSS compromise. The approved target is Astro hybrid/server output on Vercel using the official adapter, HttpOnly `Secure` `SameSite=Lax` cookies, server-side user validation on every protected request, CSRF protection for cookie-authenticated mutations, session rotation, and no-store responses. Until that migration is complete, do not place high-value customer records or administrative capabilities in the account UI.

Google OAuth uses PKCE. Allowed origins and redirect URLs must be exact production/preview values; wildcards are forbidden. The callback message validates both `origin` and popup source and does not transmit tokens.

## Authorization model

- `profiles`: authenticated owner can select/insert/update only their row.
- `saved_inspirations`: authenticated owner can select/insert/delete only their rows.
- `customization_requests` and file metadata: authenticated owner reads/inserts own rows; guest submissions pass through a validated Edge Function using service role.
- notifications and raw product-interest events: no public table access.
- public product-interest RPC returns only a recent aggregate. It is not a trustworthy business metric without gateway abuse controls.
- Owner/admin access is through the authenticated Supabase dashboard. There is no website admin role or admin route.
- Product interactions use narrowly granted `security definer` RPCs for validation, ownership enforcement, rate limiting and moderation transitions. Direct browser mutations on interaction tables are revoked; RLS remains an independent read boundary.
- Staff interaction authority comes only from the signed Auth JWT `app_metadata.role` allowlist (`owner`, `staff`, `moderator`). User-editable metadata and browser-side email comparisons are never authorization inputs.
- Public interaction responses are privacy-shaped JSON: approved public content and aggregates only. Private notes, pending/rejected/hidden comments and identity UUIDs are excluded; owners receive their own state and authorized staff use the moderation queue RPC.
- Customer text is length-limited, control-character cleaned, URL/active-markup rejected, and rendered with DOM `textContent`. New public comments default to `pending`; publication always requires an audited staff action.

## Browser defenses

`vercel.json` sets framing, MIME-sniffing, referrer, permissions, opener/resource, cache, and indexing controls. CSP starts in Report-Only because Astro structured-data and style output require live violation observation before enforcement. Promote it to enforced policy only after preview and production reports show required sources and hashes/nonces are complete. Vercel provides HSTS by default; verify it on the production domain.

## Upload security

The submission function accepts at most two files, each at most 8 MiB, and permits JPEG, PNG, WebP, or PDF after declared MIME and file-signature validation. Names are normalized and randomized; storage is private. Residual risk: there is no malware scanner, content disarm, quarantine state, or secure operator download proxy. Do not automatically open uploads; scan before operator access and serve downloads as attachments where possible.

## Logging and monitoring

Functions return random request IDs and log only request ID plus exception type. Never log payloads or provider bodies. Configure alerts for elevated 401/403/413/429/5xx rates, repeated upload rejection, webhook failures, RLS denials, Auth abuse, and unusual service-role activity. Retention and log access must follow the data inventory.
