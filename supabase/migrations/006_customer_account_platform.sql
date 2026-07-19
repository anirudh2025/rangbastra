-- Customer account platform: only tables used by the account Preview.
-- Social/review, web-push, staff-console and message tables are intentionally deferred.

alter table public.profiles add column if not exists avatar_path text check (char_length(avatar_path) <= 500);
alter table public.profiles add column if not exists location text check (char_length(location) <= 140);
alter table public.profiles add column if not exists couture_interests text[] not null default '{}';
alter table public.profiles add column if not exists preferred_consultation_method text
  check (preferred_consultation_method in ('whatsapp','video','studio'));

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  reduce_motion boolean not null default false,
  sound_enabled boolean not null default true,
  email_notifications boolean not null default true,
  in_app_notifications boolean not null default true,
  consultation_updates boolean not null default true,
  editorial_updates boolean not null default false,
  timezone text not null default 'Asia/Kolkata' check (char_length(timezone) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inspiration_boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);
create unique index if not exists inspiration_boards_id_user_unique on public.inspiration_boards(id, user_id);

alter table public.saved_inspirations add column if not exists product_slug text check (product_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');
alter table public.saved_inspirations add column if not exists board_id uuid;
alter table public.saved_inspirations add column if not exists note text check (char_length(note) <= 500);
alter table public.saved_inspirations add column if not exists removed_at timestamptz;
create unique index if not exists saved_inspirations_user_slug_unique
  on public.saved_inspirations(user_id, product_slug) where product_slug is not null;
create index if not exists saved_inspirations_user_active_idx
  on public.saved_inspirations(user_id, created_at desc) where removed_at is null;
alter table public.saved_inspirations drop constraint if exists saved_inspirations_board_owner_fk;
alter table public.saved_inspirations add constraint saved_inspirations_board_owner_fk
  foreign key (board_id, user_id) references public.inspiration_boards(id, user_id) on delete restrict;

create table if not exists public.hidden_products (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_slug text not null check (product_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  primary key (user_id, product_slug)
);

create table if not exists public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  consultation_method text not null check (consultation_method in ('whatsapp','video','studio')),
  timezone text not null default 'Asia/Kolkata',
  capacity smallint not null default 1 check (capacity between 1 and 8),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint availability_time_order check (ends_at > starts_at),
  unique (starts_at, consultation_method)
);
create unique index if not exists availability_slots_id_method_unique
  on public.availability_slots(id, consultation_method);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slot_id uuid not null,
  consultation_method text not null check (consultation_method in ('whatsapp','video','studio')),
  customer_timezone text not null check (char_length(customer_timezone) between 1 and 80),
  product_slug text check (product_slug is null or product_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  context text check (char_length(context) <= 1000),
  status text not null default 'requested' check (status in ('requested','confirmed','cancelled','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slot_id)
);
alter table public.appointments drop constraint if exists appointments_slot_method_fk;
alter table public.appointments add constraint appointments_slot_method_fk
  foreign key (slot_id, consultation_method)
  references public.availability_slots(id, consultation_method) on delete restrict;

create table if not exists public.in_app_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('request_update','appointment','account','editorial')),
  title text not null check (char_length(title) between 1 and 120),
  message text not null check (char_length(message) between 1 and 500),
  href text check (href is null or (href like '/%' and href not like '//%')),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.request_status_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.customization_requests(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('new','reviewing','consultation','confirmed','in_progress','completed','closed')),
  customer_message text check (char_length(customer_message) <= 1000),
  created_at timestamptz not null default now()
);
alter table public.customization_requests drop constraint if exists customization_requests_id_user_unique;
alter table public.customization_requests add constraint customization_requests_id_user_unique unique (id, user_id);
alter table public.request_status_events drop constraint if exists request_status_events_request_owner_fk;
alter table public.request_status_events add constraint request_status_events_request_owner_fk
  foreign key (request_id, user_id)
  references public.customization_requests(id, user_id) on delete cascade;

create index if not exists inspiration_boards_user_idx on public.inspiration_boards(user_id, updated_at desc);
create index if not exists hidden_products_user_idx on public.hidden_products(user_id, created_at desc);
create index if not exists availability_slots_active_idx on public.availability_slots(starts_at) where is_active;
create index if not exists appointments_user_idx on public.appointments(user_id, created_at desc);
create index if not exists in_app_notifications_user_idx on public.in_app_notifications(user_id, created_at desc);
create index if not exists request_status_events_owner_idx on public.request_status_events(user_id, request_id, created_at);

alter table public.user_preferences enable row level security;
alter table public.inspiration_boards enable row level security;
alter table public.hidden_products enable row level security;
alter table public.availability_slots enable row level security;
alter table public.appointments enable row level security;
alter table public.in_app_notifications enable row level security;
alter table public.request_status_events enable row level security;

create policy "Customers manage own preferences" on public.user_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Customers manage own boards" on public.inspiration_boards for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Customers update own inspirations" on public.saved_inspirations for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Customers manage own hidden products" on public.hidden_products for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Customers read active availability" on public.availability_slots for select to authenticated using (is_active and starts_at > now());
create policy "Customers read own appointments" on public.appointments for select using (auth.uid() = user_id);
create policy "Customers read own notifications" on public.in_app_notifications for select using (auth.uid() = user_id);
create policy "Customers mark own notifications read" on public.in_app_notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Customers read own request history" on public.request_status_events for select using (auth.uid() = user_id);

revoke all on public.user_preferences, public.inspiration_boards, public.hidden_products,
  public.availability_slots, public.appointments, public.in_app_notifications,
  public.request_status_events from anon;
revoke all on public.user_preferences, public.inspiration_boards, public.hidden_products,
  public.availability_slots, public.appointments, public.in_app_notifications,
  public.request_status_events from authenticated;
grant select, insert, update, delete on public.user_preferences, public.inspiration_boards, public.hidden_products to authenticated;
grant update (board_id, note, removed_at) on public.saved_inspirations to authenticated;
revoke update on public.profiles from authenticated;
grant update (full_name, phone, city, country, location, preferred_contact_method,
  preferred_consultation_method, couture_interests, marketing_consent,
  marketing_consent_at, upcoming_event_date, updated_at)
  on public.profiles to authenticated;
grant select on public.availability_slots, public.appointments, public.request_status_events to authenticated;
grant select on public.in_app_notifications to authenticated;
grant update (read_at) on public.in_app_notifications to authenticated;

-- Appointment creation/status transitions and notification insertion remain server-only.
-- The composite foreign key makes a cross-user board assignment impossible in the database.
-- Move inspirations out of a board before deleting it; this avoids nulling the non-null owner key.
