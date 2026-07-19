# Security Policy

## Reporting a vulnerability

Do not open a public issue. Send a private report to the repository owner with the affected route/component, reproduction steps, impact, and suggested remediation. Do not include customer data or working credentials. The owner should acknowledge within two business days, triage within five, and coordinate disclosure only after remediation.

## Supported code

Only the production branch and current deployment are supported. Security fixes should not be backported to archived experiments unless they are deployed.

## Repository rules

- Never commit `.env*`, service-role keys, provider keys, webhook secrets, database URLs with credentials, tokens, or customer exports.
- Browser code may use only `PUBLIC_*` publishable values. A Supabase publishable/anon key is not authorization; every exposed object still requires grants and RLS.
- Service-role operations belong only in reviewed server-side functions. Do not log request bodies, tokens, email addresses, phone numbers, measurements, filenames, or provider responses.
- New tables must enable RLS in the same migration and include explicit role grants and negative cross-user tests.
- New uploads require byte limits, extension-independent signature validation, private storage, randomized object names, download authorization, and a malware-scanning/quarantine decision.
- Authentication and account changes require a threat-model update and session tests. Never simulate protected routes with client-only rendering.
- Run `npm run security` before release. Treat secret-scan, bundle-scan, build, or high-severity dependency failures as release blockers.

## Incident contact and secrets

The repository intentionally does not name real secret values or operational contacts. Store those in the approved password manager and hosting provider, not documentation.
