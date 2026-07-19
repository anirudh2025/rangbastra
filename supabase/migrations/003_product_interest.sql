-- Privacy-conscious aggregate product interest. Raw events are never publicly selectable.
create table if not exists public.product_interest_events(
  id bigint generated always as identity primary key,
  product_slug text not null check(char_length(product_slug)<=120),
  user_id uuid references auth.users(id) on delete set null,
  anonymous_session uuid,
  viewed_at timestamptz not null default now(),
  check(user_id is not null or anonymous_session is not null)
);
alter table public.product_interest_events enable row level security;
create index if not exists product_interest_recent_idx on public.product_interest_events(product_slug,viewed_at desc);

create or replace function public.record_product_interest(product_slug text,anonymous_session uuid default null)
returns integer language plpgsql security definer set search_path=public as $$
declare viewer uuid:=auth.uid(); recent_count integer;
begin
  if product_slug is null or char_length(product_slug)>120 then raise exception 'Invalid product'; end if;
  if viewer is null and anonymous_session is null then raise exception 'Session required'; end if;
  if not exists(select 1 from product_interest_events e where e.product_slug=record_product_interest.product_slug and e.viewed_at>now()-interval '6 hours' and ((viewer is not null and e.user_id=viewer) or (viewer is null and e.anonymous_session=record_product_interest.anonymous_session))) then
    insert into product_interest_events(product_slug,user_id,anonymous_session) values(product_slug,viewer,case when viewer is null then anonymous_session end);
  end if;
  select count(distinct coalesce(user_id::text,anonymous_session::text)) into recent_count from product_interest_events where product_interest_events.product_slug=record_product_interest.product_slug and viewed_at>now()-interval '7 days';
  return recent_count;
end $$;
revoke all on table public.product_interest_events from anon,authenticated;
grant execute on function public.record_product_interest(text,uuid) to anon,authenticated;
