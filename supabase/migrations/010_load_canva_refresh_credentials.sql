create or replace function public.load_canva_oauth_credentials_for_refresh()
returns table (
  access_token_encrypted text,
  refresh_token_encrypted text,
  access_token_expires_at timestamptz,
  granted_scopes text[],
  status text
)
language sql
security definer
set search_path = ''
as $$
  select
    credentials.access_token_encrypted,
    credentials.refresh_token_encrypted,
    credentials.access_token_expires_at,
    credentials.granted_scopes,
    credentials.status
  from private.canva_oauth_credentials as credentials
  where credentials.integration_id = 'rangbastra-canva'
  limit 1;
$$;

revoke all on function public.load_canva_oauth_credentials_for_refresh()
  from public, anon, authenticated;
grant execute on function public.load_canva_oauth_credentials_for_refresh()
  to service_role;
