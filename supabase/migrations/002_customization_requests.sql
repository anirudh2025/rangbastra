-- Product customization, private files, customer events and verified-owner notifications.
alter table public.profiles add column if not exists country text check(char_length(country)<=100);
alter table public.profiles add column if not exists preferred_contact_method text check(char_length(preferred_contact_method)<=40);
alter table public.profiles add column if not exists upcoming_event_date date;

create table if not exists public.customization_requests(
 id uuid primary key default gen_random_uuid(), reference_number text not null unique default ('RB-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))),
 user_id uuid references auth.users(id) on delete set null, product_id integer not null, product_slug text not null check(char_length(product_slug)<=100), product_name_snapshot text not null check(char_length(product_name_snapshot)<=140),
 selected_palette_id text, selected_palette_name text, requested_colour text, detail_preferences text, customer_name text not null, email text not null, phone text not null, location text,
 contact_preference text, occasion text, event_date date, delivery_date date, appointment_preference text, measurement_method text, measurement_unit text,
 measurements jsonb not null default '{}'::jsonb check(jsonb_typeof(measurements)='object'), notes text, contact_consent boolean not null, marketing_consent boolean not null default false,
 status text not null default 'new' check(status in('new','reviewing','consultation','confirmed','in_progress','completed','closed')), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.customization_request_files(
 id uuid primary key default gen_random_uuid(), request_id uuid not null references public.customization_requests(id) on delete cascade, user_id uuid references auth.users(id) on delete set null,
 storage_path text not null unique, file_kind text not null check(file_kind in('measurement_sheet','reference','inspiration')), original_filename text not null, mime_type text not null, size_bytes bigint not null check(size_bytes between 1 and 8388608), created_at timestamptz not null default now()
);
create table if not exists public.customer_notifications(
 id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade, event_type text not null, idempotency_key text not null unique,
 status text not null default 'pending' check(status in('pending','processing','sent','failed')), attempts integer not null default 0, last_error text, created_at timestamptz not null default now(), sent_at timestamptz
);
alter table public.customization_requests enable row level security;
alter table public.customization_request_files enable row level security;
alter table public.customer_notifications enable row level security;
create policy "Customers read own requests" on public.customization_requests for select using(auth.uid()=user_id);
create policy "Customers create own requests" on public.customization_requests for insert with check(auth.uid()=user_id and contact_consent);
create policy "Customers read own request files" on public.customization_request_files for select using(auth.uid()=user_id);
create policy "Customers create own request files" on public.customization_request_files for insert with check(auth.uid()=user_id);
-- Notification rows are service-role only; no public policy is intentionally created.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('customer-references','customer-references',false,8388608,array['image/jpeg','image/png','image/webp','application/pdf']) on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy "Customers read own private uploads" on storage.objects for select using(bucket_id='customer-references' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "Customers upload own private files" on storage.objects for insert with check(bucket_id='customer-references' and (storage.foldername(name))[1]=auth.uid()::text);

create or replace function public.queue_verified_account_notification() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if old.email_confirmed_at is null and new.email_confirmed_at is not null then
  insert into public.customer_notifications(user_id,event_type,idempotency_key) values(new.id,'verified_account_created','verified-account:'||new.id::text) on conflict(idempotency_key) do nothing;
 end if; return new;
end; $$;
drop trigger if exists on_auth_user_verified on auth.users;
create trigger on_auth_user_verified after update of email_confirmed_at on auth.users for each row execute function public.queue_verified_account_notification();
