-- Route product-interest writes through the rate-limited Edge Function.
alter table public.product_interest_events add column if not exists network_hash text;
alter table public.product_interest_events add constraint product_interest_network_hash_length
  check (network_hash is null or char_length(network_hash) = 64) not valid;
create index if not exists product_interest_session_dedupe_idx
  on public.product_interest_events(product_slug, anonymous_session, viewed_at desc);
create index if not exists product_interest_network_rate_idx
  on public.product_interest_events(network_hash, viewed_at desc);

revoke execute on function public.record_product_interest(text, uuid) from public, anon, authenticated;
grant execute on function public.record_product_interest(text, uuid) to service_role;

comment on table public.product_interest_events is
  'Minimal recent-interest events. Raw rows are service-only and should be deleted after 30 days.';
