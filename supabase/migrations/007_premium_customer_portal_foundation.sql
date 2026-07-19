-- Premium customer portal foundation.
-- Apply to a disposable Preview project only after 001-006 and run the paired
-- two-user tests before considering Production. Sensitive writes remain
-- server-only until cookie sessions, CSRF and rate limiting are deployed.

alter table public.profiles add column if not exists display_name text check (char_length(display_name) <= 60);
alter table public.profiles add column if not exists first_name text check (char_length(first_name) <= 60);
alter table public.profiles add column if not exists last_name text check (char_length(last_name) <= 60);
alter table public.profiles add column if not exists date_of_birth date check (date_of_birth is null or date_of_birth >= date '1900-01-01');
alter table public.profiles add column if not exists style_note text check (char_length(style_note) <= 500);

alter table public.user_preferences add column if not exists sound_volume smallint not null default 70 check (sound_volume between 0 and 100);
alter table public.user_preferences add column if not exists animation_intensity text not null default 'standard' check (animation_intensity in ('minimal','standard'));
alter table public.user_preferences add column if not exists preferred_language text;
alter table public.user_preferences add column if not exists preferred_currency text;
alter table public.user_preferences add column if not exists hidden_home_modules text[] not null default '{}';

alter table public.inspiration_boards add column if not exists cover_product_slug text check (cover_product_slug is null or cover_product_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');
alter table public.inspiration_boards add column if not exists sharing_enabled boolean not null default false;
alter table public.inspiration_boards add column if not exists share_token_hash bytea;
create unique index if not exists inspiration_boards_share_token_unique on public.inspiration_boards(share_token_hash) where share_token_hash is not null;

alter table public.customization_requests drop constraint if exists customization_requests_status_check;
alter table public.customization_requests add constraint customization_requests_status_check check (
  status in ('draft','new','submitted','under_review','reviewing','consultation_proposed','consultation','confirmed','in_progress','completed','closed')
);

create table if not exists public.couture_request_messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  sender_role text not null check (sender_role in ('customer','atelier')),
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  constraint couture_request_messages_owner_fk foreign key (request_id,user_id)
    references public.customization_requests(id,user_id) on delete cascade
);
create index if not exists couture_request_messages_request_idx on public.couture_request_messages(request_id,created_at);

create unique index if not exists appointments_slot_active_unique on public.appointments(slot_id)
  where status in ('requested','confirmed');

create table if not exists public.product_comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_slug text not null check (product_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  display_name_snapshot text not null check (char_length(display_name_snapshot) between 1 and 80),
  body text not null check (char_length(body) between 1 and 1200),
  moderation_status text not null default 'pending' check (moderation_status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists product_comments_public_idx on public.product_comments(product_slug,created_at desc) where moderation_status='approved';
create index if not exists product_comments_owner_idx on public.product_comments(user_id,created_at desc);

create table if not exists public.product_ratings (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_slug text not null check (product_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id,product_slug)
);

create table if not exists public.product_likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_slug text not null check (product_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  primary key (user_id,product_slug)
);

create table if not exists public.moderation_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  comment_id uuid not null references public.product_comments(id) on delete cascade,
  reason text not null check (reason in ('abuse','harassment','spam','privacy','other')),
  details text check (char_length(details) <= 500),
  status text not null default 'open' check (status in ('open','reviewed','closed')),
  created_at timestamptz not null default now(),
  unique (reporter_id,comment_id)
);

alter table public.couture_request_messages enable row level security;
alter table public.product_comments enable row level security;
alter table public.product_ratings enable row level security;
alter table public.product_likes enable row level security;
alter table public.moderation_reports enable row level security;

create policy "Customers read own request messages" on public.couture_request_messages for select
  using (auth.uid()=user_id);
create policy "Public reads approved comments" on public.product_comments for select
  using (moderation_status='approved' or auth.uid()=user_id);
create policy "Customers create pending comments" on public.product_comments for insert to authenticated
  with check (auth.uid()=user_id and moderation_status='pending');
create policy "Customers update own pending comments" on public.product_comments for update to authenticated
  using (auth.uid()=user_id and moderation_status='pending')
  with check (auth.uid()=user_id and moderation_status='pending');
create policy "Customers delete own comments" on public.product_comments for delete to authenticated
  using (auth.uid()=user_id);
create policy "Customers manage own ratings" on public.product_ratings for all to authenticated
  using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "Customers manage own likes" on public.product_likes for all to authenticated
  using (auth.uid()=user_id) with check (auth.uid()=user_id);

revoke all on public.couture_request_messages, public.product_comments, public.product_ratings,
  public.product_likes, public.moderation_reports from anon, authenticated;
grant select on public.couture_request_messages to authenticated;
grant select (id,product_slug,display_name_snapshot,body,moderation_status,created_at,updated_at)
  on public.product_comments to anon, authenticated;
grant insert (user_id,product_slug,display_name_snapshot,body), update (body,updated_at), delete
  on public.product_comments to authenticated;
grant select, insert, update (rating,updated_at), delete on public.product_ratings to authenticated;
grant select, insert, delete on public.product_likes to authenticated;

create or replace function public.get_product_community_summary(p_product_slug text)
returns table(rating_average numeric,rating_count bigint,like_count bigint)
language sql stable security definer set search_path=pg_catalog,public as $$
  select round(avg(r.rating)::numeric,1),count(distinct r.user_id),count(distinct l.user_id)
  from (select 1) seed
  left join public.product_ratings r on r.product_slug=p_product_slug
  left join public.product_likes l on l.product_slug=p_product_slug;
$$;
revoke execute on function public.get_product_community_summary(text) from public;
grant execute on function public.get_product_community_summary(text) to anon,authenticated;

revoke update on public.profiles from authenticated;
grant update (display_name,first_name,last_name,date_of_birth,style_note,full_name,phone,city,country,
  location,preferred_contact_method,preferred_consultation_method,couture_interests,marketing_consent,
  marketing_consent_at,upcoming_event_date,updated_at) on public.profiles to authenticated;

-- Avatar storage remains service-write-only until the upload endpoint performs
-- byte-signature inspection, resize/re-encode, randomized naming and deletion.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('customer-avatars','customer-avatars',false,2097152,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy "Customers read own private avatar" on storage.objects for select to authenticated
  using(bucket_id='customer-avatars' and (storage.foldername(name))[1]=auth.uid()::text);

comment on table public.moderation_reports is 'Server-write-only until rate limiting and staff moderation authorization are deployed.';
comment on column public.inspiration_boards.share_token_hash is 'Hash only; raw opt-in share tokens must never be stored.';
