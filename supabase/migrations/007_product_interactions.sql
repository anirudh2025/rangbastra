-- Moderated product interactions. Apply only after 001-006 and validate in Preview first.
-- Staff authorization is derived exclusively from immutable Auth app_metadata.role.

create table if not exists public.catalogue_products (
  id integer primary key check (id > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 120),
  interaction_eligible boolean not null default true,
  retired_at timestamptz,
  updated_at timestamptz not null default now()
);

insert into public.catalogue_products(id,slug,title) values
  (1,'gulnaar','Gulnaar'),(2,'elara','Elara'),(3,'noor','Noor'),
  (4,'inaayat','Inaayat'),(5,'amaira','Amaira'),(6,'naeyra','Naeyra'),
  (7,'mahira','Mahira'),(8,'aayana','Aayana'),(9,'iraaya','Iraaya'),
  (10,'riva','Riva'),(11,'anaahita','Anaahita'),(12,'aavya','Aavya'),
  (13,'ziana','Ziana'),(14,'eiraa','Eiraa'),(15,'eshaira','Eshaira'),
  (16,'ruhaaya','Ruhaaya'),(17,'lavanya','Lavanya'),(18,'varnika','Varnika'),
  (19,'mishka','Mishka'),(20,'aureya','Aureya'),(21,'zavira','Zavira'),
  (22,'sahira','Sahira'),(23,'nirvi','Nirvi'),(24,'aarini','Aarini'),
  (25,'bahaar','Bahaar'),(26,'tiara','Tiara')
on conflict(id) do update set slug=excluded.slug,title=excluded.title,updated_at=now();

alter table public.profiles add column if not exists public_display_name text
  check (public_display_name is null or char_length(public_display_name) between 2 and 60);

create table if not exists public.product_comments (
  id uuid primary key default gen_random_uuid(),
  product_id integer not null references public.catalogue_products(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  contribution_type text not null check (contribution_type in ('public','private')),
  body text not null check (char_length(body) between 10 and 1000),
  display_name text not null check (char_length(display_name) between 2 and 60),
  show_avatar boolean not null default false,
  moderation_status text not null default 'pending'
    check (moderation_status in ('pending','approved','rejected','hidden')),
  is_locked boolean not null default false,
  moderation_reason text check (moderation_reason is null or char_length(moderation_reason) <= 500),
  moderated_at timestamptz,
  moderated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint private_comment_not_approved check (
    contribution_type = 'public' or moderation_status <> 'approved'
  )
);

create table if not exists public.comment_replies (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.product_comments(id) on delete restrict,
  staff_user_id uuid not null references auth.users(id) on delete restrict,
  body text not null check (char_length(body) between 2 and 1000),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_ratings (
  id uuid primary key default gen_random_uuid(),
  product_id integer not null references public.catalogue_products(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id,product_id)
);

create table if not exists public.product_likes (
  id uuid primary key default gen_random_uuid(),
  product_id integer not null references public.catalogue_products(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id,product_id)
);

create table if not exists public.moderation_reports (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.product_comments(id) on delete restrict,
  reporter_user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('spam','abuse','privacy','misleading','other')),
  detail text check (detail is null or char_length(detail) <= 500),
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(comment_id,reporter_user_id)
);

create table if not exists public.moderation_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references auth.users(id) on delete restrict,
  action text not null check (action in ('approve','reject','hide','lock','unlock','reply','delete_reply','resolve_report','dismiss_report')),
  comment_id uuid references public.product_comments(id) on delete restrict,
  reply_id uuid references public.comment_replies(id) on delete restrict,
  report_id uuid references public.moderation_reports(id) on delete restrict,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.in_app_notifications drop constraint if exists in_app_notifications_kind_check;
alter table public.in_app_notifications add constraint in_app_notifications_kind_check
  check (kind in ('request_update','appointment','account','editorial','comment_approved','comment_rejected','owner_reply'));

create index if not exists product_comments_public_idx on public.product_comments(product_id,created_at desc)
  where contribution_type='public' and moderation_status='approved' and deleted_at is null;
create index if not exists product_comments_owner_idx on public.product_comments(user_id,created_at desc);
create index if not exists comment_replies_comment_idx on public.comment_replies(comment_id,created_at) where deleted_at is null;
create index if not exists product_ratings_product_idx on public.product_ratings(product_id);
create index if not exists product_likes_product_idx on public.product_likes(product_id);
create index if not exists moderation_reports_open_idx on public.moderation_reports(created_at) where status in ('open','reviewing');

create or replace function public.is_interaction_staff() returns boolean
language sql stable security invoker set search_path='' as $$
  select coalesce((auth.jwt()->'app_metadata'->>'role') in ('owner','staff','moderator'),false)
$$;

create or replace function public.clean_interaction_text(value text, minimum integer, maximum integer)
returns text language plpgsql immutable set search_path='' as $$
declare cleaned text := regexp_replace(trim(coalesce(value,'')), E'[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]', '', 'g');
begin
  if char_length(cleaned) < minimum or char_length(cleaned) > maximum then raise exception 'Content length is invalid' using errcode='22023'; end if;
  if cleaned ~* '<\s*/?\s*(script|iframe|object|embed|style|svg|math|a)(\s|>|/)' then raise exception 'Markup and links are not allowed' using errcode='22023'; end if;
  if cleaned ~* '(https?://|www\.)' then raise exception 'Links are not allowed' using errcode='22023'; end if;
  return cleaned;
end $$;

create or replace function public.submit_product_comment(
  requested_product_id integer, requested_body text, requested_type text,
  requested_display_name text, requested_show_avatar boolean default false
) returns public.product_comments
language plpgsql security definer set search_path='public','auth' as $$
declare created public.product_comments; uid uuid := auth.uid();
begin
  if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if requested_type not in ('public','private') then raise exception 'Invalid contribution type' using errcode='22023'; end if;
  if not exists(select 1 from public.catalogue_products where id=requested_product_id and interaction_eligible and retired_at is null) then raise exception 'Product is not eligible' using errcode='22023'; end if;
  if (select count(*) from public.product_comments where user_id=uid and created_at > now()-interval '10 minutes') >= 5 then raise exception 'Please wait before submitting another comment' using errcode='P0001'; end if;
  insert into public.product_comments(product_id,user_id,contribution_type,body,display_name,show_avatar,moderation_status)
  values(requested_product_id,uid,requested_type,
    public.clean_interaction_text(requested_body,10,1000),
    public.clean_interaction_text(requested_display_name,2,60),
    coalesce(requested_show_avatar,false),'pending') returning * into created;
  return created;
end $$;

create or replace function public.update_own_product_comment(requested_comment_id uuid, requested_body text, requested_display_name text, requested_show_avatar boolean)
returns public.product_comments language plpgsql security definer set search_path='public','auth' as $$
declare changed public.product_comments;
begin
  update public.product_comments set body=public.clean_interaction_text(requested_body,10,1000),display_name=public.clean_interaction_text(requested_display_name,2,60),show_avatar=coalesce(requested_show_avatar,false),moderation_status='pending',moderation_reason=null,moderated_at=null,moderated_by=null,updated_at=now()
  where id=requested_comment_id and user_id=auth.uid() and deleted_at is null and not is_locked returning * into changed;
  if changed.id is null then raise exception 'Comment is unavailable' using errcode='42501'; end if;
  return changed;
end $$;

create or replace function public.delete_own_product_comment(requested_comment_id uuid) returns void
language plpgsql security definer set search_path='public','auth' as $$
begin
  update public.product_comments set deleted_at=now(),updated_at=now() where id=requested_comment_id and user_id=auth.uid() and deleted_at is null and not is_locked;
  if not found then raise exception 'Comment is unavailable' using errcode='42501'; end if;
end $$;

create or replace function public.set_product_rating(requested_product_id integer, requested_rating smallint)
returns public.product_ratings language plpgsql security definer set search_path='public','auth' as $$
declare changed public.product_ratings;
begin
  if auth.uid() is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if requested_rating not between 1 and 5 then raise exception 'Rating must be between 1 and 5' using errcode='22023'; end if;
  if not exists(select 1 from public.catalogue_products where id=requested_product_id and interaction_eligible and retired_at is null) then raise exception 'Product is not eligible'; end if;
  insert into public.product_ratings(product_id,user_id,rating) values(requested_product_id,auth.uid(),requested_rating)
  on conflict(user_id,product_id) do update set rating=excluded.rating,updated_at=now() returning * into changed;
  return changed;
end $$;

create or replace function public.remove_own_product_rating(requested_product_id integer) returns void
language sql security definer set search_path='public','auth' as $$ delete from public.product_ratings where product_id=requested_product_id and user_id=auth.uid() $$;

create or replace function public.toggle_product_like(requested_product_id integer) returns boolean
language plpgsql security definer set search_path='public','auth' as $$
begin
  if auth.uid() is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if not exists(select 1 from public.catalogue_products where id=requested_product_id and interaction_eligible and retired_at is null) then raise exception 'Product is not eligible'; end if;
  delete from public.product_likes where product_id=requested_product_id and user_id=auth.uid();
  if found then return false; end if;
  insert into public.product_likes(product_id,user_id) values(requested_product_id,auth.uid()); return true;
end $$;

create or replace function public.report_product_comment(requested_comment_id uuid, requested_reason text, requested_detail text default null) returns uuid
language plpgsql security definer set search_path='public','auth' as $$
declare report_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if requested_reason not in ('spam','abuse','privacy','misleading','other') then raise exception 'Invalid report reason'; end if;
  if not exists(select 1 from public.product_comments where id=requested_comment_id and contribution_type='public' and moderation_status='approved' and deleted_at is null) then raise exception 'Comment is unavailable'; end if;
  insert into public.moderation_reports(comment_id,reporter_user_id,reason,detail) values(requested_comment_id,auth.uid(),requested_reason,case when requested_detail is null then null else public.clean_interaction_text(requested_detail,2,500) end)
  on conflict(comment_id,reporter_user_id) do update set reason=excluded.reason,detail=excluded.detail,status='open',created_at=now() returning id into report_id;
  return report_id;
end $$;

create or replace function public.moderate_product_comment(requested_comment_id uuid, requested_action text, requested_reason text default null) returns void
language plpgsql security definer set search_path='public','auth' as $$
declare next_status text; uid uuid:=auth.uid();
begin
  if not public.is_interaction_staff() then raise exception 'Staff authorization required' using errcode='42501'; end if;
  if requested_action not in ('approve','reject','hide','lock','unlock') then raise exception 'Invalid moderation action'; end if;
  next_status:=case requested_action when 'approve' then 'approved' when 'reject' then 'rejected' when 'hide' then 'hidden' else null end;
  update public.product_comments set moderation_status=coalesce(next_status,moderation_status),is_locked=case when requested_action='lock' then true when requested_action='unlock' then false else is_locked end,moderation_reason=case when next_status is null then moderation_reason else left(nullif(trim(requested_reason),''),500) end,moderated_at=now(),moderated_by=uid,updated_at=now()
  where id=requested_comment_id and deleted_at is null and (contribution_type='public' or requested_action in ('lock','unlock'));
  if not found then raise exception 'Comment is unavailable'; end if;
  insert into public.moderation_audit_log(actor_user_id,action,comment_id,detail) values(uid,requested_action,requested_comment_id,jsonb_build_object('reason',left(coalesce(requested_reason,''),500)));
  if requested_action in ('approve','reject') then
    insert into public.in_app_notifications(user_id,kind,title,message,href)
    select user_id,case requested_action when 'approve' then 'comment_approved' else 'comment_rejected' end,
      case requested_action when 'approve' then 'Your comment was approved' else 'Your comment was reviewed' end,
      case requested_action when 'approve' then 'Your contribution is now visible on the product page.' else 'Your contribution was not published. Review your activity for details.' end,
      format('/products/%s#interaction-%s',p.slug,p.id)
      from public.product_comments c join public.catalogue_products p on p.id=c.product_id where c.id=requested_comment_id;
  end if;
end $$;

create or replace function public.reply_to_product_comment(requested_comment_id uuid, requested_body text) returns public.comment_replies
language plpgsql security definer set search_path='public','auth' as $$
declare created public.comment_replies; uid uuid:=auth.uid();
begin
  if not public.is_interaction_staff() then raise exception 'Staff authorization required' using errcode='42501'; end if;
  if not exists(select 1 from public.product_comments where id=requested_comment_id and deleted_at is null) then raise exception 'Comment is unavailable'; end if;
  insert into public.comment_replies(comment_id,staff_user_id,body) values(requested_comment_id,uid,public.clean_interaction_text(requested_body,2,1000)) returning * into created;
  insert into public.moderation_audit_log(actor_user_id,action,comment_id,reply_id) values(uid,'reply',requested_comment_id,created.id);
  insert into public.in_app_notifications(user_id,kind,title,message,href)
  select c.user_id,'owner_reply','Rangbastra replied','The atelier replied to your contribution.',
    case when c.contribution_type='private' then '/account/activity' else format('/products/%s#interaction-%s',p.slug,p.id) end
  from public.product_comments c join public.catalogue_products p on p.id=c.product_id where c.id=requested_comment_id;
  return created;
end $$;

create or replace function public.moderate_report(requested_report_id uuid, requested_action text) returns void
language plpgsql security definer set search_path='public','auth' as $$
declare uid uuid:=auth.uid(); audit_action text;
begin
  if not public.is_interaction_staff() then raise exception 'Staff authorization required' using errcode='42501'; end if;
  if requested_action not in ('reviewing','resolved','dismissed') then raise exception 'Invalid report action' using errcode='22023'; end if;
  update public.moderation_reports
    set status=requested_action,
        resolved_at=case when requested_action in ('resolved','dismissed') then now() else null end,
        resolved_by=case when requested_action in ('resolved','dismissed') then uid else null end
    where id=requested_report_id and status in ('open','reviewing') and requested_action <> status;
  if not found then raise exception 'Report is unavailable' using errcode='42501'; end if;
  if requested_action in ('resolved','dismissed') then
    audit_action:=case requested_action when 'resolved' then 'resolve_report' else 'dismiss_report' end;
    insert into public.moderation_audit_log(actor_user_id,action,report_id) values(uid,audit_action,requested_report_id);
  end if;
end $$;

create or replace function public.get_product_interactions(requested_product_id integer) returns jsonb
language sql stable security definer set search_path='public','auth' as $$
  select jsonb_build_object(
    'comments',coalesce((select jsonb_agg(jsonb_build_object(
      'id',c.id,'body',c.body,'displayName',c.display_name,'showAvatar',c.show_avatar,
      'createdAt',c.created_at,'locked',c.is_locked,
      'replies',coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'body',r.body,'createdAt',r.created_at) order by r.created_at)
        from public.comment_replies r where r.comment_id=c.id and r.deleted_at is null),'[]'::jsonb)
    ) order by c.created_at desc) from public.product_comments c where c.product_id=requested_product_id and c.contribution_type='public' and c.moderation_status='approved' and c.deleted_at is null),'[]'::jsonb),
    'rating',coalesce((select jsonb_build_object('average',round(avg(rating)::numeric,2),'count',count(*)) from public.product_ratings where product_id=requested_product_id),jsonb_build_object('average',null,'count',0)),
    'mine',case when auth.uid() is null then null else jsonb_build_object(
      'comments',coalesce((select jsonb_agg(jsonb_build_object('id',id,'body',body,'type',contribution_type,'displayName',display_name,'showAvatar',show_avatar,'status',moderation_status,'reason',moderation_reason,'locked',is_locked,'createdAt',created_at) order by created_at desc) from public.product_comments where product_id=requested_product_id and user_id=auth.uid() and deleted_at is null),'[]'::jsonb),
      'rating',(select rating from public.product_ratings where product_id=requested_product_id and user_id=auth.uid()),
      'liked',exists(select 1 from public.product_likes where product_id=requested_product_id and user_id=auth.uid())
    ) end
  ) where exists(select 1 from public.catalogue_products where id=requested_product_id and interaction_eligible and retired_at is null)
$$;

create or replace function public.get_my_product_activity() returns jsonb
language sql stable security definer set search_path='public','auth' as $$
  select case when auth.uid() is null then null else jsonb_build_object(
    'comments',coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'productId',c.product_id,'productSlug',p.slug,'productTitle',p.title,'body',c.body,'type',c.contribution_type,'status',c.moderation_status,'reason',c.moderation_reason,'locked',c.is_locked,'createdAt',c.created_at,'replies',coalesce((select jsonb_agg(jsonb_build_object('body',r.body,'createdAt',r.created_at) order by r.created_at) from public.comment_replies r where r.comment_id=c.id and r.deleted_at is null),'[]'::jsonb)) order by c.created_at desc) from public.product_comments c join public.catalogue_products p on p.id=c.product_id where c.user_id=auth.uid() and c.deleted_at is null),'[]'::jsonb),
    'ratings',coalesce((select jsonb_agg(jsonb_build_object('productId',r.product_id,'productSlug',p.slug,'productTitle',p.title,'rating',r.rating,'updatedAt',r.updated_at) order by r.updated_at desc) from public.product_ratings r join public.catalogue_products p on p.id=r.product_id where r.user_id=auth.uid()),'[]'::jsonb),
    'likes',coalesce((select jsonb_agg(jsonb_build_object('productId',l.product_id,'productSlug',p.slug,'productTitle',p.title,'createdAt',l.created_at) order by l.created_at desc) from public.product_likes l join public.catalogue_products p on p.id=l.product_id where l.user_id=auth.uid()),'[]'::jsonb)
  ) end
$$;

create or replace function public.get_product_moderation_queue() returns jsonb
language sql stable security definer set search_path='public','auth' as $$
  select case when public.is_interaction_staff() then jsonb_build_object(
    'comments',coalesce((select jsonb_agg(to_jsonb(c) order by c.created_at) from public.product_comments c where c.deleted_at is null and (c.moderation_status='pending' or c.contribution_type='private')),'[]'::jsonb),
    'reports',coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at) from public.moderation_reports r where r.status in ('open','reviewing')),'[]'::jsonb)
  ) else null end
$$;

alter table public.catalogue_products enable row level security;
alter table public.product_comments enable row level security;
alter table public.comment_replies enable row level security;
alter table public.product_ratings enable row level security;
alter table public.product_likes enable row level security;
alter table public.moderation_reports enable row level security;
alter table public.moderation_audit_log enable row level security;

create policy "Public reads eligible catalogue" on public.catalogue_products for select using(interaction_eligible and retired_at is null);
create policy "Approved public comments or owner or staff" on public.product_comments for select using(
  (contribution_type='public' and moderation_status='approved' and deleted_at is null) or auth.uid()=user_id or public.is_interaction_staff()
);
create policy "Public reads replies to approved comments" on public.comment_replies for select using((deleted_at is null and exists(select 1 from public.product_comments c where c.id=comment_id and c.contribution_type='public' and c.moderation_status='approved' and c.deleted_at is null)) or public.is_interaction_staff());
create policy "Ratings public read" on public.product_ratings for select using(true);
create policy "Likes owner read" on public.product_likes for select using(auth.uid()=user_id or public.is_interaction_staff());
create policy "Reports owner or staff read" on public.moderation_reports for select using(auth.uid()=reporter_user_id or public.is_interaction_staff());
create policy "Audit staff read" on public.moderation_audit_log for select using(public.is_interaction_staff());

revoke all on public.catalogue_products,public.product_comments,public.comment_replies,public.product_ratings,public.product_likes,public.moderation_reports,public.moderation_audit_log from anon,authenticated;
grant select on public.catalogue_products to anon,authenticated;
revoke execute on function public.is_interaction_staff(),public.submit_product_comment(integer,text,text,text,boolean),public.update_own_product_comment(uuid,text,text,boolean),public.delete_own_product_comment(uuid),public.set_product_rating(integer,smallint),public.remove_own_product_rating(integer),public.toggle_product_like(integer),public.report_product_comment(uuid,text,text),public.moderate_product_comment(uuid,text,text),public.moderate_report(uuid,text),public.reply_to_product_comment(uuid,text),public.get_product_interactions(integer),public.get_my_product_activity(),public.get_product_moderation_queue() from public,anon,authenticated;
grant execute on function public.is_interaction_staff() to anon,authenticated;
grant execute on function public.submit_product_comment(integer,text,text,text,boolean),public.update_own_product_comment(uuid,text,text,boolean),public.delete_own_product_comment(uuid),public.set_product_rating(integer,smallint),public.remove_own_product_rating(integer),public.toggle_product_like(integer),public.report_product_comment(uuid,text,text),public.moderate_product_comment(uuid,text,text),public.moderate_report(uuid,text),public.reply_to_product_comment(uuid,text) to authenticated;
grant execute on function public.get_product_interactions(integer) to anon,authenticated;
grant execute on function public.get_my_product_activity(),public.get_product_moderation_queue() to authenticated;
revoke execute on function public.clean_interaction_text(text,integer,integer) from public,anon,authenticated;

comment on table public.moderation_audit_log is 'Append-only staff moderation evidence. No browser role has insert/update/delete grants.';
