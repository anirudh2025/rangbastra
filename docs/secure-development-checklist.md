# Secure Development Checklist

## Every change

- [ ] Identify untrusted inputs, sensitive outputs, and privilege changes.
- [ ] Use contextual DOM APIs; no untrusted `innerHTML`, `set:html`, URL interpolation, or dynamic code execution.
- [ ] Validate on the server with length, type, format, allowlist, and business-rule checks.
- [ ] Return generic errors and a correlation ID; keep personal data and tokens out of logs.
- [ ] Review redirects, OAuth origins, postMessage origin/source, external links, and cache behavior.
- [ ] Run `npm run security` and review the generated client bundle.

## Database/API

- [ ] Enable RLS and force explicit grants in the same migration.
- [ ] Add owner-positive, cross-user-negative, anonymous-negative, and service-role tests.
- [ ] Revoke default `PUBLIC` function execution; pin `search_path` on security-definer functions.
- [ ] Confirm mass-assignment cannot change identity, role, status, ownership, or consent timestamps.
- [ ] Add rate limits and idempotency for costly or externally visible operations.

## Authentication

- [ ] Use server-validated sessions in HttpOnly, Secure, SameSite cookies for protected functionality.
- [ ] Rotate sessions after authentication/privilege change; revoke on logout and password reset.
- [ ] Use PKCE, exact redirect allowlists, generic recovery responses, and provider-side rate limits/MFA for operators.
- [ ] Add CSRF defense to cookie-authenticated state changes.

## Uploads and webhooks

- [ ] Limit request bytes, file count, individual size, MIME and magic bytes.
- [ ] Randomize names, store privately, authorize downloads, and scan/quarantine before operator access.
- [ ] Authenticate webhooks with HMAC/timestamp/replay protection when the sender supports it; make processing atomic and idempotent.
