-- Least-privilege grants and invariants for public Data API objects.
-- Apply only after reviewing against the live schema and back up first.

revoke all on table public.profiles from anon;
revoke all on table public.saved_inspirations from anon;
revoke all on table public.customization_requests from anon;
revoke all on table public.customization_request_files from anon;
revoke all on table public.customer_notifications from anon, authenticated;
revoke all on table public.product_interest_events from anon, authenticated;
revoke all on table public.profiles from authenticated;
revoke all on table public.saved_inspirations from authenticated;
revoke all on table public.customization_requests from authenticated;
revoke all on table public.customization_request_files from authenticated;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, delete on table public.saved_inspirations to authenticated;
grant select, insert on table public.customization_requests to authenticated;
grant select, insert on table public.customization_request_files to authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.queue_verified_account_notification() from public, anon, authenticated;
revoke execute on function public.record_product_interest(text, uuid) from public;
grant execute on function public.record_product_interest(text, uuid) to anon, authenticated;

alter table public.customization_requests add constraint customization_request_dates_sane check (
  (event_date is null or event_date >= date '2020-01-01') and
  (delivery_date is null or delivery_date >= date '2020-01-01')
) not valid;
alter table public.customer_notifications add constraint customer_notification_attempts_bounded check (attempts between 0 and 10) not valid;

comment on function public.record_product_interest(text, uuid) is
  'Public privacy-preserving aggregate signal. Apply gateway rate limiting; anonymous UUIDs are not an abuse boundary.';
