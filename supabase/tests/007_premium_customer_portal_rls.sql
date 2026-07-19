-- Run only against a disposable database after migrations 001-007.
-- This test deliberately rolls back all fixtures.
begin;

insert into auth.users(id,instance_id,aud,role,email,encrypted_password) values
('33333333-3333-3333-3333-333333333333','00000000-0000-0000-0000-000000000000','authenticated','authenticated','portal-a@example.invalid',''),
('44444444-4444-4444-4444-444444444444','00000000-0000-0000-0000-000000000000','authenticated','authenticated','portal-b@example.invalid','');

set local role authenticated;
select set_config('request.jwt.claim.sub','33333333-3333-3333-3333-333333333333',true);
insert into public.product_ratings(user_id,product_slug,rating) values('33333333-3333-3333-3333-333333333333','gulnaar',5);
insert into public.product_likes(user_id,product_slug) values('33333333-3333-3333-3333-333333333333','gulnaar');
insert into public.product_comments(user_id,product_slug,display_name_snapshot,body)
values('33333333-3333-3333-3333-333333333333','gulnaar','Portal A','Pending moderation');

do $$ begin
  begin
    insert into public.product_ratings(user_id,product_slug,rating) values('33333333-3333-3333-3333-333333333333','gulnaar',4);
    raise exception 'duplicate rating unexpectedly succeeded';
  exception when unique_violation then null; end;
end $$;

select set_config('request.jwt.claim.sub','44444444-4444-4444-4444-444444444444',true);
do $$ begin
  if exists(select 1 from public.product_comments) then raise exception 'pending comment leaked cross-user'; end if;
  begin
    update public.product_ratings set rating=1 where user_id='33333333-3333-3333-3333-333333333333';
    if found then raise exception 'cross-user rating update succeeded'; end if;
  end;
  begin
    delete from public.product_likes where user_id='33333333-3333-3333-3333-333333333333';
    if found then raise exception 'cross-user like delete succeeded'; end if;
  end;
end $$;

set local role anon;
do $$ begin
  if exists(select 1 from public.product_comments) then raise exception 'pending comment leaked publicly'; end if;
exception when insufficient_privilege then null; end $$;

rollback;
