-- Migration: collect attendee phone numbers.
-- Run ONCE in the Supabase SQL editor on a project that already has the
-- original schema.sql applied. Safe to re-run.
--
-- 1. Adds tickets.phone. Existing rows predate the field, so it stays NULL
--    for them; reserve_ticket() requires it for every new reservation.
-- 2. Replaces reserve_ticket(text, text) with reserve_ticket(text, text, text)
--    so the site can pass p_phone. The old 2-arg function is dropped so the
--    anon key can no longer reserve without a phone.

alter table public.tickets add column if not exists phone text;

drop function if exists public.reserve_ticket(text, text);

create or replace function public.reserve_ticket(p_name text, p_email text, p_phone text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capacity int := 100;
  v_local    text;
  v_domain   text;
  v_norm     text;
  v_count    int;
  v_code     text;
  v_alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- no 0/O/1/I
  v_digits   text;
  i          int;
begin
  -- basic validation (phone: any formatting, but 7–15 digits once stripped)
  v_digits := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  if coalesce(trim(p_name), '') = ''
     or p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'
     or length(v_digits) < 7 or length(v_digits) > 15 then
    return json_build_object('ok', false, 'reason', 'invalid');
  end if;

  -- normalize email: lowercase, drop "+tag"; for gmail also strip dots
  v_norm   := lower(trim(p_email));
  v_local  := split_part(v_norm, '@', 1);
  v_domain := split_part(v_norm, '@', 2);
  v_local  := split_part(v_local, '+', 1);
  if v_domain in ('gmail.com', 'googlemail.com') then
    v_local  := replace(v_local, '.', '');
    v_domain := 'gmail.com';
  end if;
  v_norm := v_local || '@' || v_domain;

  -- serialize reservations so the count check + insert are atomic
  perform pg_advisory_xact_lock(hashtext('tedx_homestead_tickets'));

  if exists (select 1 from public.tickets where email_normalized = v_norm) then
    return json_build_object('ok', false, 'reason', 'duplicate_email');
  end if;

  select count(*)::int into v_count from public.tickets;
  if v_count >= v_capacity then
    return json_build_object('ok', false, 'reason', 'sold_out');
  end if;

  -- human-friendly code, e.g. TXH-4F7K2M
  v_code := 'TXH-';
  for i in 1..6 loop
    v_code := v_code || substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1);
  end loop;

  insert into public.tickets (code, name, email, email_normalized, phone)
  values (v_code, trim(p_name), trim(p_email), v_norm, trim(p_phone));

  return json_build_object(
    'ok', true,
    'code', v_code,
    'name', trim(p_name),
    'reserved_at', now(),
    'remaining', v_capacity - (v_count + 1)
  );
end;
$$;

revoke all on function public.reserve_ticket(text, text, text) from public;
grant execute on function public.reserve_ticket(text, text, text) to anon, authenticated;
