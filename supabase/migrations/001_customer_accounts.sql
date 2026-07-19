-- Rangbastra customer profiles and saved inspirations.
-- Apply through the Supabase migration workflow after creating the project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text check (char_length(full_name) <= 120),
  email text not null,
  phone text check (char_length(phone) <= 30),
  city text check (char_length(city) <= 100),
  marketing_consent boolean not null default false,
  marketing_consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint marketing_consent_timestamp check (
    (marketing_consent = false and marketing_consent_at is null)
    or marketing_consent = true
  )
);

create table if not exists public.saved_inspirations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id integer not null check (product_id > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table public.profiles enable row level security;
alter table public.saved_inspirations enable row level security;

create policy "Customers read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Customers update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Customers insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Customers read own inspirations" on public.saved_inspirations for select using (auth.uid() = user_id);
create policy "Customers save own inspirations" on public.saved_inspirations for insert with check (auth.uid() = user_id);
create policy "Customers remove own inspirations" on public.saved_inspirations for delete using (auth.uid() = user_id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, nullif(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
