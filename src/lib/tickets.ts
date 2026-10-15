import { EVENT } from '../data/event'
import { supabase } from './supabase'

/**
 * Ticket reservation service.
 *
 * Reservations go through POST /api/reserve (api/reserve.ts), which calls the
 * Supabase reserve_ticket() function and then emails a confirmation. Capacity
 * and duplicate checks live in Postgres (supabase/schema.sql):
 *   - seats_remaining() -> int
 *   - reserve_ticket(p_name, p_email, p_phone) -> json
 *     (advisory-locked; one ticket per name per email, up to 6 per email)
 *
 * There is no per-device lock: one person can book a ticket for each member of
 * their family or group from the same phone. The emailed confirmation is the
 * attendee's record of their seat.
 *
 * Under plain `vite` dev there is no /api, so this falls back to calling the
 * Supabase function directly (no email). Use `vercel dev` to exercise email.
 */

export interface Reservation {
  code: string
  name: string
  email: string
  reservedAt: string
}

export type Reason =
  | 'sold_out'
  | 'duplicate_name'
  | 'duplicate_email'
  | 'email_limit'
  | 'invalid'
  | 'error'

export type ReserveResult =
  | { ok: true; reservation: Reservation; remaining: number; emailSent: boolean }
  | { ok: false; reason: Reason }

interface ReserveResponse {
  ok: boolean
  reason?: Reason
  code?: string
  name?: string
  reserved_at?: string
  remaining?: number
  emailSent?: boolean
}

// Older builds stored a ticket here and used it to block further reservations.
// Clear it so returning visitors get the form back.
try {
  localStorage.removeItem('tedxhomestead.myticket.v1')
} catch {
  /* storage unavailable */
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

/** Lenient: any formatting, but 7–15 digits (ITU E.164 max) once stripped. */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 7 && digits.length <= 15
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

/** POST to the serverless function. Returns null when /api isn't available (vite dev). */
async function viaApi(payload: Record<string, string>): Promise<ReserveResponse | null> {
  const r = await fetch('/api/reserve', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!(r.headers.get('content-type') ?? '').includes('application/json')) {
    if (import.meta.env.DEV) return null
    throw new Error(`/api/reserve returned ${r.status}`)
  }
  return (await r.json()) as ReserveResponse
}

/** Dev-only fallback: call the database function directly (no email). */
async function viaRpc(payload: Record<string, string>): Promise<ReserveResponse | null> {
  if (!supabase) {
    return {
      ok: true,
      code: 'TXH-LOCAL',
      name: payload.name,
      reserved_at: new Date().toISOString(),
      remaining: EVENT.capacity - 1,
      emailSent: false,
    }
  }
  const { data, error } = await supabase.rpc('reserve_ticket', {
    p_name: payload.name,
    p_email: payload.email,
    p_phone: payload.phone,
  })
  if (error) throw error
  return data as ReserveResponse
}

export async function reserveTicket(
  name: string,
  email: string,
  phone: string,
): Promise<ReserveResult> {
  if (!name.trim() || !isValidEmail(email) || !isValidPhone(phone)) {
    return { ok: false, reason: 'invalid' }
  }

  const payload = { name: name.trim(), email: email.trim(), phone: phone.trim() }

  let res: ReserveResponse | null
  try {
    res = (await viaApi(payload)) ?? (await viaRpc(payload))
  } catch (e) {
    console.error('reserveTicket failed', e)
    return { ok: false, reason: 'error' }
  }

  if (!res) return { ok: false, reason: 'error' }
  if (!res.ok) return { ok: false, reason: res.reason ?? 'error' }

  return {
    ok: true,
    reservation: {
      code: res.code ?? 'TXH-000000',
      name: res.name ?? payload.name,
      email: payload.email,
      reservedAt: res.reserved_at ?? new Date().toISOString(),
    },
    remaining: Math.max(0, res.remaining ?? 0),
    emailSent: res.emailSent ?? false,
  }
}
