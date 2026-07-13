-- TEDxHomestead ticketing schema.
-- Run this ONCE in the Supabase SQL editor (Dashboard → SQL → New query → Run).
-- It creates the tickets table and two SECURITY DEFINER functions that enforce
-- the 100-seat cap atomically. The anon/publishable key never touches the table
-- directly (RLS is on with no policies), so attendee emails stay private and the
-- seat count can't be tampered with from the browser.

-- 1. Table ----------------------------------------------------------------
create table if not exists public.tickets (
  id               uuid primary key default gen_random_uuid(),
  code             text not null unique,
  name             text not null,
  email            text not null,
  email_normalized text not null unique,
  reserved_at      timestamptz not null default now()
);

alter table public.tickets enable row level security;
-- No policies => the anon role cannot select/insert/update/delete directly.
-- Only the SECURITY DEFINER functions below (which run as the table owner)
-- can read or write it.

-- 2. Seats remaining ------------------------------------------------------
create or replace function public.seats_remaining()
returns integer
language sql
security definer
set search_path = public
as $$
  select greatest(0, 100 - (select count(*)::int from public.tickets));
$$;

-- 3. Reserve a ticket (atomic) -------------------------------------------
create or replace function public.reserve_ticket(p_name text, p_email text)
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
  i          int;
begin
  -- basic validation
  if coalesce(trim(p_name), '') = ''
     or p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' then
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

  insert into public.tickets (code, name, email, email_normalized)
  values (v_code, trim(p_name), trim(p_email), v_norm);

  return json_build_object(
    'ok', true,
    'code', v_code,
    'name', trim(p_name),
    'reserved_at', now(),
    'remaining', v_capacity - (v_count + 1)
  );
end;
$$;

-- 4. Grants ---------------------------------------------------------------
revoke all on function public.seats_remaining()          from public;
revoke all on function public.reserve_ticket(text, text) from public;
grant execute on function public.seats_remaining()          to anon, authenticated;
grant execute on function public.reserve_ticket(text, text) to anon, authenticated;

-- Done. To see reservations later:  select * from public.tickets order by reserved_at;
