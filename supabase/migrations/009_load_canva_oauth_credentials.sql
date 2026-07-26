create or replace function public.load_canva_oauth_credentials()
returns table (
  access_token_encrypted text,
  access_token_expires_at timestamptz,
  status text
)
language sql
security definer
set search_path = ''
as $$
  select
    credentials.access_token_encrypted,
    credentials.access_token_expires_at,
    credentials.status
  from private.canva_oauth_credentials as credentials
  where credentials.integration_id = 'rangbastra-canva'
  limit 1;
$$;

revoke all on function public.load_canva_oauth_credentials()
  from public, anon, authenticated;
grant execute on function public.load_canva_oauth_credentials()
  to service_role;
