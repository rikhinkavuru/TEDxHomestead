-- Migration: let one email hold tickets for a group (family, friends).
-- Run ONCE in the Supabase SQL editor, after 2026-10-15_add_phone.sql.
-- Safe to re-run.
--
-- Before: one ticket per email, so a parent couldn't book for their kids.
-- After:  one ticket per (email, name), up to 6 tickets per email. The same
--         person can't be booked twice, and no one email can grab the room.

-- 1. Swap the email-only uniqueness for email + name ---------------------
alter table public.tickets drop constraint if exists tickets_email_normalized_key;
create unique index if not exists tickets_email_name_key
  on public.tickets (email_normalized, lower(name));
create index if not exists tickets_email_normalized_idx
  on public.tickets (email_normalized);

-- 2. Reserve a ticket (atomic) -------------------------------------------
create or replace function public.reserve_ticket(p_name text, p_email text, p_phone text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capacity   int := 100;
  v_per_email  int := 6;
  v_name       text;
  v_local      text;
  v_domain     text;
  v_norm       text;
  v_count      int;
  v_code       text;
  v_alphabet   text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- no 0/O/1/I
  v_digits     text;
  i            int;
begin
  -- collapse runs of whitespace so "Jane  Doe" and "Jane Doe" match
  v_name := regexp_replace(trim(coalesce(p_name, '')), '\s+', ' ', 'g');

  -- basic validation (phone: any formatting, but 7–15 digits once stripped)
  v_digits := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  if v_name = ''
     or length(v_name) > 120
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

  -- serialize reservations so the count checks + insert are atomic
  perform pg_advisory_xact_lock(hashtext('tedx_homestead_tickets'));

  if exists (
    select 1 from public.tickets
    where email_normalized = v_norm and lower(name) = lower(v_name)
  ) then
    return json_build_object('ok', false, 'reason', 'duplicate_name');
  end if;

  if (select count(*) from public.tickets where email_normalized = v_norm) >= v_per_email then
    return json_build_object('ok', false, 'reason', 'email_limit');
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
  values (v_code, v_name, trim(p_email), v_norm, trim(p_phone));

  return json_build_object(
    'ok', true,
    'code', v_code,
    'name', v_name,
    'reserved_at', now(),
    'remaining', v_capacity - (v_count + 1)
  );
end;
$$;

revoke all on function public.reserve_ticket(text, text, text) from public;
grant execute on function public.reserve_ticket(text, text, text) to anon, authenticated;
