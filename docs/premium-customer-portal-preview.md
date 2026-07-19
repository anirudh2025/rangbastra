# Premium Customer Portal Preview

Status: Preview-only. Not approved for Production.

## Implemented foundation

- Shared Supabase PKCE browser client and auth-state synchronization across desktop/mobile navigation.
- Auth-restoration skeleton prevents signed-out controls flashing before session restoration.
- Signed-in profile control, account shortcuts and accessible Log Out confirmation.
- Safe `next` destination preservation for password and Google OAuth flows.
- Premium account dashboard using only real profile, inspiration, request, appointment and notification rows.
- Explicit opt-in import for device-local wishlist items; the device list is cleared only after a successful account write.
- Extended profile fields and honest avatar-upload gate.
- Moderated product comments, unique ratings, unique likes and public aggregate-count foundation.
- Database-level prevention of two active appointments using the same slot.
- Private avatar bucket created without a browser upload policy; writes remain disabled pending server inspection/re-encoding.

## Required environment variables

No new secret is introduced. Existing browser auth requires:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or the existing publishable fallback)

Future server routes will require server-only values configured in Vercel and never referenced by browser modules. Do not add a service-role value to any `PUBLIC_*` variable.

## Disposable Preview database steps

1. Create or select a disposable Supabase Preview project with no Production customer data.
2. Apply migrations `001` through `007` in order using the project migration workflow.
3. Run `006_customer_account_platform_rls.sql` and `007_premium_customer_portal_rls.sql` as disposable-database tests.
4. Add negative tests for profile column escalation, board cross-owner reassignment, appointment mutation, request messages, moderation reports and storage paths before Production approval.
5. Configure the existing Google provider for the Preview callback only if the approved OAuth configuration permits it. Do not change Production provider scopes or branding.
6. Set Preview environment variables and redeploy the Preview branch.

## Server boundary still required

- Cookie-backed Supabase SSR sessions with `auth.getUser()` validation.
- CSRF protection and rate limiting for sensitive mutations.
- Avatar signature inspection, resize/re-encode, randomized paths and deletion.
- Couture request drafts/messages/uploads and account deletion/export endpoints.
- Appointment booking, reschedule and cancellation transactions.
- Comment reporting and staff moderation operations.
- Immutable staff authorization, MFA expectation and audit logging.
- Read-only inspiration sharing with hashed, revocable tokens.

## Administrator workflow required

Use the Supabase dashboard only for Preview inspection. A website administrator UI must not be enabled until server-validated staff claims, audit logs and least-privilege endpoints exist. Future administration is required for availability, request status, customer-safe replies, comment moderation and real notification creation.

## Retention decisions requiring owner approval

- Appointment history after completion or cancellation.
- Read notifications.
- Couture messages and uploaded references.
- Moderation reports and security audit records.
- Account deletion grace period and backup expiry.

## Developer control guide

- Auth-aware navigation: `src/lib/auth/accountNavigation.ts` and navigation components.
- Destination guard: `src/components/auth/AuthActionGuard.astro`.
- Portal interface: `src/components/account/CustomerAccountPlatform.astro`.
- Product community: `src/components/community/ProductCommunity.astro`.
- Data foundation: migrations `006` and `007` plus their tests.
