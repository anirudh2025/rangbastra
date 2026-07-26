-- Preserve product id 8 and all dependent interactions while correcting its canonical identity.
update public.catalogue_products
set slug = 'ayana',
    title = 'Ayana',
    updated_at = now()
where id = 8
  and slug = 'aayana'
  and title = 'Aayana';

do $$
begin
  if not exists (
    select 1
    from public.catalogue_products
    where id = 8
      and slug = 'ayana'
      and title = 'Ayana'
  ) then
    raise exception 'Ayana catalogue identity could not be verified';
  end if;
end
$$;
