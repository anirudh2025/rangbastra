# Rangbastra Customer Accounts - Activation Guide

Status: backend contract prepared; runtime integration intentionally inactive.

## Current architecture boundary

The website currently uses Astro static output with no Vercel adapter, server middleware, API routes, Actions, authentication package, or database. Secure sessions and protected pages must not be simulated in browser-only code.

Before activation, approve the architecture change to Astro hybrid/server output and select the official Vercel adapter. Then install the current Supabase SSR packages from official documentation and implement cookie-backed clients in server-only modules.

## Required environment variables

Copy `.env.example` locally and configure the same variable names in Vercel. Never expose `SUPABASE_SERVICE_ROLE_KEY` through `PUBLIC_` variables or browser imports.

## Database

Apply `supabase/migrations/001_customer_accounts.sql`, followed by `002_customization_requests.sql`. The second migration adds product-aware requests, private file metadata, notification events, owner-only service access and the private `customer-references` Storage bucket.

Deploy the `submit-customization` and `notify-owner` Edge Functions. Configure a Database Webhook for newly inserted `customer_notifications` rows to call `notify-owner` with the private `x-webhook-secret` header. The verified-account trigger is idempotent, and notification failure never rolls back account creation.

Required server secrets are `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `OWNER_NOTIFICATION_EMAIL`, `OWNER_FROM_EMAIL`, and `WEBHOOK_SECRET`. Never expose these through `PUBLIC_` variables. `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `PUBLIC_GOOGLE_CLIENT_ID` are the browser-safe authentication values used by this project.

Product legitimacy must additionally be checked server-side against the current couture catalogue before inserting an inspiration. Database RLS protects ownership but cannot validate IDs stored in the static TypeScript catalogue.

## Owner access

For the MVP, use the authenticated Supabase dashboard to inspect `profiles` and `saved_inspirations` and export CSV data. Do not expose customer lists through a public browser query.

An `/admin/customers` route should remain disabled until a server-verified admin claim or allowlist is implemented. Hiding its navigation link is not authorization.

## Remaining runtime work after approval

1. Configure Astro hybrid/server output and Vercel adapter.
2. Add server-only Supabase clients and secure cookie refresh middleware.
3. Configure Google OAuth origins and redirect URLs, then verify email/password and Google flows against the live project.
4. Protect account and inspiration routes server-side.
5. Merge validated anonymous localStorage IDs after authentication.
6. Add account deletion/request handling and complete legal review.

## Google OAuth and data boundaries

Enable Google in Supabase Authentication and configure the Google Cloud consent screen. Register local, preview and production origins, the Supabase provider callback, and `/account/oauth-callback`. Rangbastra uses PKCE, the official Google authorization interface, a desktop popup, and a mobile/popup-blocked redirect fallback. The popup sends only a same-origin completion signal; it never transmits tokens through `postMessage`.

Authentication identity, verification state and Google provider metadata remain in `auth.users`. Contact and preference fields belong in `public.profiles`. Inspirations, customization requests, request files and notification events remain in their dedicated RLS-protected tables. Measurement sheets and references stay in the private `customer-references` bucket. Passwords and Google credentials must never be copied into public tables.
