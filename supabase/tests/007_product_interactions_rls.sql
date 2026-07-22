begin;

-- Run only against a disposable database after migrations 001-007.
insert into auth.users (id, instance_id, aud, role, email, encrypted_password) values
  ('11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-000000000000','authenticated','authenticated','customer-a@example.invalid',''),
  ('22222222-2222-2222-2222-222222222222','00000000-0000-0000-0000-000000000000','authenticated','authenticated','customer-b@example.invalid',''),
  ('33333333-3333-3333-3333-333333333333','00000000-0000-0000-0000-000000000000','authenticated','authenticated','staff@example.invalid','');
create temporary table interaction_test_state (comment_id uuid, report_id uuid);
grant select,insert,update on interaction_test_state to authenticated;

set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-1111-1111-111111111111',true);
select set_config('request.jwt.claims','{"sub":"11111111-1111-1111-1111-111111111111","app_metadata":{}}',true);
insert into interaction_test_state(comment_id)
select id from public.submit_product_comment(1,'A thoughtful public contribution.','public','Customer A',false);
select public.submit_product_comment(1,'A private fitting note for the atelier.','private','Customer A',false);
select public.set_product_rating(1,4);
select public.set_product_rating(1,5);
select public.toggle_product_like(1);

do $$ begin
  if (public.get_product_interactions(1)#>>'{mine,rating}')::integer <> 5 then raise exception 'rating upsert failed'; end if;
  if (public.get_product_interactions(1)#>>'{mine,liked}')::boolean is not true then raise exception 'like uniqueness failed'; end if;
  begin
    perform public.submit_product_comment(1,'<script>alert(1)</script> unsafe','public','Customer A',false);
    raise exception 'XSS input was accepted';
  exception when sqlstate '22023' then null; end;
end $$;

do $$ begin
  perform public.submit_product_comment(1,'Rate limit test contribution number three.','private','Customer A',false);
  perform public.submit_product_comment(1,'Rate limit test contribution number four.','private','Customer A',false);
  perform public.submit_product_comment(1,'Rate limit test contribution number five.','private','Customer A',false);
  begin
    perform public.submit_product_comment(1,'This sixth contribution must be rate limited.','private','Customer A',false);
    raise exception 'comment rate limit failed';
  exception when sqlstate 'P0001' then null; end;
end $$;

select set_config('request.jwt.claim.sub','22222222-2222-2222-2222-222222222222',true);
select set_config('request.jwt.claims','{"sub":"22222222-2222-2222-2222-222222222222","app_metadata":{}}',true);
do $$ declare foreign_comment uuid; begin
  select comment_id into foreign_comment from interaction_test_state limit 1;
  begin
    perform public.update_own_product_comment(foreign_comment,'Cross-user update must never work.','Customer B',false);
    raise exception 'cross-user update succeeded';
  exception when insufficient_privilege then null; end;
  begin
    perform public.delete_own_product_comment(foreign_comment);
    raise exception 'cross-user delete succeeded';
  exception when insufficient_privilege then null; end;
end $$;

select set_config('request.jwt.claim.sub','33333333-3333-3333-3333-333333333333',true);
select set_config('request.jwt.claims','{"sub":"33333333-3333-3333-3333-333333333333","app_metadata":{"role":"staff"}}',true);
do $$ declare target uuid; begin
  select comment_id into target from interaction_test_state limit 1;
  perform public.moderate_product_comment(target,'approve',null);
  perform public.reply_to_product_comment(target,'An official atelier reply.');
end $$;

set local role anon;
select set_config('request.jwt.claim.sub','',true);
select set_config('request.jwt.claims','{}',true);
do $$ declare payload jsonb; begin
  payload:=public.get_product_interactions(1);
  if jsonb_array_length(payload->'comments') <> 1 then raise exception 'approved public visibility failed'; end if;
  if (payload::text like '%private fitting%') then raise exception 'private note leaked'; end if;
  if (payload::text like '%11111111-1111-1111-1111-111111111111%') then raise exception 'customer identity leaked'; end if;
  if payload->'mine' is not null then raise exception 'anonymous owner data leaked'; end if;
end $$;

set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-2222-2222-222222222222',true);
select set_config('request.jwt.claims','{"sub":"22222222-2222-2222-2222-222222222222","app_metadata":{}}',true);
do $$ declare target uuid; created_report uuid; begin
  select comment_id into target from interaction_test_state limit 1;
  created_report:=public.report_product_comment(target,'spam',null);
  update interaction_test_state set report_id=created_report where comment_id=target;
end $$;

select set_config('request.jwt.claim.sub','33333333-3333-3333-3333-333333333333',true);
select set_config('request.jwt.claims','{"sub":"33333333-3333-3333-3333-333333333333","app_metadata":{"role":"staff"}}',true);
do $$ declare payload jsonb; report uuid; begin
  payload:=public.get_product_moderation_queue();
  if jsonb_array_length(payload->'reports') <> 1 then raise exception 'staff report queue failed'; end if;
  if not (payload::text like '%private fitting%') then raise exception 'staff private-note access failed'; end if;
  select report_id into report from interaction_test_state limit 1;
  perform public.moderate_report(report,'resolved');
end $$;

reset role;
do $$ declare report uuid; begin
  select report_id into report from interaction_test_state limit 1;
  if not exists(select 1 from public.moderation_audit_log where report_id=report and action='resolve_report') then raise exception 'report audit failed'; end if;
end $$;

rollback;
