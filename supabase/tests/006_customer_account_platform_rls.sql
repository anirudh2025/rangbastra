begin;

-- Run against a disposable database after migrations. Fixed UUIDs are test-only.
insert into auth.users (id, instance_id, aud, role, email, encrypted_password)
values
  ('11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-000000000000','authenticated','authenticated','owner-a@example.invalid',''),
  ('22222222-2222-2222-2222-222222222222','00000000-0000-0000-0000-000000000000','authenticated','authenticated','owner-b@example.invalid','');

set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-1111-1111-111111111111',true);
insert into public.user_preferences(user_id) values ('11111111-1111-1111-1111-111111111111');
insert into public.inspiration_boards(user_id,name) values ('11111111-1111-1111-1111-111111111111','Wedding');
insert into public.hidden_products(user_id,product_slug) values ('11111111-1111-1111-1111-111111111111','gulnaar');

do $$ begin
  if (select count(*) from public.user_preferences) <> 1 then raise exception 'owner positive read failed'; end if;
end $$;

select set_config('request.jwt.claim.sub','22222222-2222-2222-2222-222222222222',true);
do $$ begin
  if (select count(*) from public.user_preferences) <> 0 then raise exception 'cross-user preference read leaked'; end if;
  if (select count(*) from public.inspiration_boards) <> 0 then raise exception 'cross-user board read leaked'; end if;
  if (select count(*) from public.hidden_products) <> 0 then raise exception 'cross-user hidden product read leaked'; end if;
end $$;

set local role anon;
do $$ begin
  if (select count(*) from public.availability_slots) <> 0 then raise exception 'anonymous availability read leaked'; end if;
exception when insufficient_privilege then null; end $$;

rollback;
