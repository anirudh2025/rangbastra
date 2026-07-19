# Security Audit — 2026-07-17

## Executive summary

This repository received a static/local audit against an OWASP ASVS Level 2 target. No committed private credential, client-bundled server-secret identifier, known npm vulnerability, public storage bucket declaration, or website admin route was found. The production build succeeds. This is not an ASVS certification or live penetration test: deployed Supabase/Vercel configuration, OAuth settings, DNS, logs, recovery, rate limits, backups, and alerts remain unverified.

Two direct privacy exposures were remediated: the internal analytics report now builds only a redirect unless deliberately enabled, and the unconnected design enquiry no longer writes customer data to the console. Edge Functions, uploads, grants, browser headers, CI, and documentation were hardened.

## Scope and method

Reviewed routes, Astro/Vercel configuration, browser scripts, Auth usage, SQL/RLS/grants, Edge Functions, Storage, uploads, webhook handling, environment references and git environment history, dependencies, production output, and workflows. No production attack, data mutation, secret rotation, deployment, or migration application was performed.

## Findings

| ID | Severity | Status | Finding and remediation |
|---|---|---|---|
| RB-01 | High | Open — architectural | Supabase access/refresh tokens persist in browser storage and `/account` is static. XSS could steal sessions; UI hiding cannot protect routes. Migrate to Astro server/hybrid with HttpOnly Secure SameSite cookies, server authorization, CSRF controls, rotation, and no-store before adding sensitive account/admin actions. |
| RB-02 | High | Open — deployment | No application-enforced durable rate limit protects signup/recovery, guest submissions, or the public aggregate RPC. Configure Auth CAPTCHA/rate limits plus edge/WAF and durable per-principal/IP controls; anonymous UUIDs are not an abuse boundary. |
| RB-03 | High | Fixed locally | A private Instagram performance report was public static output. Production now emits a `/404` redirect unless `PUBLIC_ENABLE_INTERNAL_ANALYTICS=true`. Never enable that flag publicly; server-protect or remove internal reports. |
| RB-04 | Medium | Fixed locally | The inactive design enquiry logged full contact/couture payloads and implied delivery. Logging/reset were removed and the UI now states delivery is inactive. |
| RB-05 | Medium | Partially mitigated | Uploads lacked request/signature validation. The function now gates origin, request bytes, file count/size/type and magic bytes, with random private paths. Add AV/CDR/quarantine and safe operator downloads. |
| RB-06 | Medium | Fixed locally | Webhook comparison, HTML interpolation, provider-error handling, and concurrent processing were weak. Added constant-time comparison, validation, escaping, generic errors, atomic claim, and provider idempotency. Timestamped HMAC/replay protection remains sender-dependent. |
| RB-07 | Medium | Migration required | API privileges depended on defaults and security-definer functions risked default `PUBLIC` execution. Migration 004 explicitly revokes/grants and adds invariants; it is unapplied/unverified live. |
| RB-08 | Medium | Staged | Deployment headers were absent. Vercel controls are added; CSP is Report-Only pending live telemetry. Enforce nonce/hash CSP after preview validation and verify HSTS on the domain. |
| RB-09 | Medium | Open | Guest submissions can leave partial/orphan file state. Add transactional status, cleanup/retry jobs, and alerts. |
| RB-10 | Low | Open | Search/wishlist use `innerHTML` with build-trusted data. Replace with DOM construction/escaping before any remote/user content is introduced. |
| RB-11 | Low | Open | Executable cross-user RLS/storage and live Edge Function tests are absent. Add owner, second-user, anonymous, traversal, malformed upload, replay, and concurrency cases. |

## Authorization matrix to verify live

| Object/action | Anonymous | Owner | Other user | Service role |
|---|---:|---:|---:|---:|
| Profile select/update | deny | own only | deny | allow |
| Saved inspirations | deny | own only | deny | allow |
| Customization request select | deny | own only | deny | allow |
| Guest request insert | Edge Function | Edge Function/own policy | no cross-user ownership | allow |
| Private file read | deny | own path | deny | allow |
| Notifications/raw interest select | deny | deny | deny | allow |
| Aggregate interest RPC | rate-limited aggregate | rate-limited aggregate | aggregate only | allow |

## Verification evidence

- Redacted repository scan passed; git history listed no tracked `.env*` path.
- `npm run build` passed: 81 static routes; analytics output is redirect markup only.
- Client bundle server-secret identifier scan passed.
- `npm audit --audit-level=high`: 0 vulnerabilities across 422 dependencies at audit time.
- `astro check` still has 20 pre-existing application TypeScript errors and 6 hints; the security changes add no diagnostics.

## Required pre-production actions

1. Back up, review, and apply migration 004 in non-production; run the matrix with two users before production.
2. Deploy reviewed functions with exact origin allowlists and server-only secrets; confirm no wildcard CORS.
3. Configure Auth CAPTCHA/rate limits, exact redirects, password/recovery/session policy, operator MFA, SMTP controls, and leaked-password protection where available.
4. Add edge rate limiting and upload AV/quarantine, or disable operator upload handling.
5. Deploy preview, collect CSP violations, tighten and enforce CSP, and verify actual headers/cache responses.
6. Complete server-session migration before treating `/account` as protected.
7. Configure alerts, backups/PITR, retention/deletion jobs, log access, and run an incident tabletop.

Official references: [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/), [Supabase secure data](https://supabase.com/docs/guides/database/secure-data), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [API security](https://supabase.com/docs/guides/api/securing-your-api), [Storage access control](https://supabase.com/docs/guides/storage/security/access-control), and [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-json).
