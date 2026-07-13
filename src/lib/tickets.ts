import { EVENT } from '../data/event'
import { supabase } from './supabase'

/**
 * Ticket reservation service — backed by Supabase.
 *
 * Real capacity ({EVENT.capacity} seats) lives on the server. Two Postgres
 * functions (run under SECURITY DEFINER, so the anon key never touches the
 * table directly) do the work atomically:
 *   - seats_remaining() -> int
 *   - reserve_ticket(p_name, p_email) -> json  (advisory-locked count + insert)
 * The SQL to create them is in supabase/schema.sql — run it once in the
 * Supabase SQL editor.
 *
 * The browser also keeps a localStorage flag so one device holds one ticket
 * and can re-show its stub on return; the server is the source of truth for
 * the seat count and duplicate-email checks.
 */

export interface Reservation {
  code: string
  name: string
  email: string
  reservedAt: string
}

type Reason = 'sold_out' | 'duplicate_email' | 'already_reserved' | 'invalid' | 'error'

export type ReserveResult =
  | { ok: true; reservation: Reservation; remaining: number }
  | { ok: false; reason: Reason }

interface ReserveRpc {
  ok: boolean
  reason?: Reason
  code?: string
  name?: string
  reserved_at?: string
  remaining?: number
}

const STORAGE_KEY = 'tedxhomestead.myticket.v1'

function readMine(): Reservation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Reservation
  } catch {
    /* unavailable/corrupt storage */
  }
  return null
}

function writeMine(r: Reservation) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(r))
  } catch {
    /* ignore */
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

export async function getRemaining(): Promise<number> {
  if (!supabase) return EVENT.capacity
  try {
    const { data, error } = await supabase.rpc('seats_remaining')
    if (error || typeof data !== 'number') return EVENT.capacity
    return Math.max(0, data)
  } catch {
    return EVENT.capacity
  }
}

export async function getMyReservation(): Promise<Reservation | null> {
  return readMine()
}

export async function reserveTicket(name: string, email: string): Promise<ReserveResult> {
  if (!name.trim() || !isValidEmail(email)) return { ok: false, reason: 'invalid' }

  // one ticket per device
  if (readMine()) return { ok: false, reason: 'already_reserved' }

  if (!supabase) {
    // Dev fallback when no backend is configured: issue a local-only stub.
    const reservation: Reservation = {
      code: 'TXH-LOCAL',
      name: name.trim(),
      email: email.trim(),
      reservedAt: new Date().toISOString(),
    }
    writeMine(reservation)
    return { ok: true, reservation, remaining: EVENT.capacity - 1 }
  }

  let data: unknown = null
  let error: unknown = null
  try {
    const r = await supabase.rpc('reserve_ticket', {
      p_name: name.trim(),
      p_email: email.trim(),
    })
    data = r.data
    error = r.error
  } catch (e) {
    error = e
  }

  if (error || !data) {
    if (error) console.error('reserveTicket failed', error)
    return { ok: false, reason: 'error' }
  }

  const res = data as ReserveRpc
  if (!res.ok) return { ok: false, reason: res.reason ?? 'error' }

  const reservation: Reservation = {
    code: res.code ?? 'TXH-000000',
    name: res.name ?? name.trim(),
    email: email.trim(),
    reservedAt: res.reserved_at ?? new Date().toISOString(),
  }
  writeMine(reservation)
  return { ok: true, reservation, remaining: Math.max(0, res.remaining ?? 0) }
}
