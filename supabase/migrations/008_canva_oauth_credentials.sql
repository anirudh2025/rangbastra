create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.canva_oauth_credentials (
  integration_id text primary key,
  access_token_encrypted text not null,
  refresh_token_encrypted text not null,
  access_token_expires_at timestamptz not null,
  granted_scopes text[],
  status text not null default 'active'
    check (status in ('active', 'reauthorization_required', 'revoked')),
  updated_at timestamptz not null default now(),
  constraint canva_single_integration
    check (integration_id = 'rangbastra-canva')
);

alter table private.canva_oauth_credentials enable row level security;
revoke all on private.canva_oauth_credentials
  from public, anon, authenticated;

create or replace function public.store_canva_oauth_credentials(
  requested_access_token_encrypted text,
  requested_refresh_token_encrypted text,
  requested_access_token_expires_at timestamptz,
  requested_granted_scopes text[]
) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if nullif(requested_access_token_encrypted, '') is null
    or nullif(requested_refresh_token_encrypted, '') is null
    or requested_access_token_expires_at <= now()
  then
    raise exception 'Invalid Canva credential payload';
  end if;

  insert into private.canva_oauth_credentials (
    integration_id,
    access_token_encrypted,
    refresh_token_encrypted,
    access_token_expires_at,
    granted_scopes,
    status,
    updated_at
  ) values (
    'rangbastra-canva',
    requested_access_token_encrypted,
    requested_refresh_token_encrypted,
    requested_access_token_expires_at,
    requested_granted_scopes,
    'active',
    now()
  )
  on conflict (integration_id) do update set
    access_token_encrypted = excluded.access_token_encrypted,
    refresh_token_encrypted = excluded.refresh_token_encrypted,
    access_token_expires_at = excluded.access_token_expires_at,
    granted_scopes = excluded.granted_scopes,
    status = 'active',
    updated_at = now();
end;
$$;

revoke all on function public.store_canva_oauth_credentials(
  text, text, timestamptz, text[]
) from public, anon, authenticated;
grant execute on function public.store_canva_oauth_credentials(
  text, text, timestamptz, text[]
) to service_role;
