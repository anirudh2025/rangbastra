# Product Interactions Security Audit — 2026-07-22

Status: implementation review complete; Preview and Production database application not performed.

## Scope

Migration `007_product_interactions.sql`, product comment/rating/like UI, account activity, staff moderation RPCs, notification writes and RLS fixture `007_product_interactions_rls.sql`.

## Controls implemented

- New public contributions default to `pending`; private notes cannot enter `approved` state.
- Direct browser table mutation is revoked. RPCs validate authentication, ownership, product eligibility, length, active markup/URL patterns and submission rate.
- Ratings and likes use database uniqueness on `(user_id, product_id)`; aggregate values are computed from stored ratings.
- Staff authorization is read from signed Auth `app_metadata.role`, never browser email/user metadata.
- Approve, reject, hide, lock, unlock, reply and report-resolution paths are authorized and audited. Customer deletes are soft deletes.
- Public reads expose approved public comments only and omit user UUID/email; UI inserts customer content via `textContent`.

## Residual risks and release gates

- The site remains a static Astro client session architecture. Interaction data is still protected by authenticated RPC/RLS, but the planned HttpOnly server-session migration remains necessary before a website staff console or higher-value customer data.
- The five-comments-per-ten-minutes database limit is an account-level baseline, not a replacement for gateway/device abuse controls, CAPTCHA/risk scoring or operator monitoring.
- Avatar preference is stored, but public avatar rendering remains disabled until the private upload, validation, resizing and quarantine design is implemented.
- Community rules, audit/report retention and operator escalation procedures require owner approval.
- Apply to a disposable Preview Supabase project, run both RLS fixtures, inspect grants/policies, validate staff JWT refresh/MFA and complete manual browser/mobile/keyboard checks before any Production migration.
