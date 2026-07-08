import { EVENT } from '../data/event'

/**
 * Ticket reservation service.
 *
 * This is the client-side shell. It enforces what a browser can enforce:
 *   - one ticket per device (localStorage flag)
 *   - one ticket per normalized email (catches "gmail dot" and "+alias" tricks)
 *   - a honeypot + minimum-fill-time check against bots (in the form component)
 *
 * True capacity enforcement across ALL visitors requires a tiny backend
 * (the seat count must live on a server, not in each visitor's browser).
 * Every function below is async and isolated behind this interface, so
 * swapping in a real API (Supabase, Firebase, a Vercel function, etc.)
 * means changing only this file. The TODO markers show exactly where.
 */

export interface Reservation {
  code: string
  name: string
  email: string
  reservedAt: string
}

export type ReserveResult =
  | { ok: true; reservation: Reservation; remaining: number }
  | { ok: false; reason: 'sold_out' | 'duplicate_email' | 'already_reserved' | 'invalid' }

const STORAGE_KEY = 'tedxhomestead.tickets.v1'

interface Store {
  reservations: Reservation[]
  mine: string | null // code of this device's reservation
}

function readStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Store
  } catch {
    /* corrupted or unavailable storage — start fresh */
  }
  return { reservations: [], mine: null }
}

function writeStore(store: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

/**
 * Normalize an email so trivial variations can't claim extra seats:
 * lowercase, trim, and for gmail strip dots and "+tag" aliases.
 */
export function normalizeEmail(email: string): string {
  const trimmed = email.trim().toLowerCase()
  const [local = '', domain = ''] = trimmed.split('@')
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    const cleaned = local.split('+')[0].replaceAll('.', '')
    return `${cleaned}@gmail.com`
  }
  return `${local.split('+')[0]}@${domain}`
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

function makeCode(): string {
  // Human-friendly code like "TXH-4F7K2M"
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I
  let suffix = ''
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  for (const b of bytes) suffix += alphabet[b % alphabet.length]
  return `TXH-${suffix}`
}

export async function getRemaining(): Promise<number> {
  // TODO(backend): GET /api/tickets/remaining
  const store = readStore()
  return Math.max(0, EVENT.capacity - store.reservations.length)
}

export async function getMyReservation(): Promise<Reservation | null> {
  const store = readStore()
  if (!store.mine) return null
  return store.reservations.find((r) => r.code === store.mine) ?? null
}

export async function reserveTicket(name: string, email: string): Promise<ReserveResult> {
  // TODO(backend): POST /api/tickets/reserve — the server holds the real
  // seat count and does these same checks atomically.
  if (!name.trim() || !isValidEmail(email)) return { ok: false, reason: 'invalid' }

  const store = readStore()

  if (store.mine) return { ok: false, reason: 'already_reserved' }
  if (store.reservations.length >= EVENT.capacity) return { ok: false, reason: 'sold_out' }

  const normalized = normalizeEmail(email)
  if (store.reservations.some((r) => normalizeEmail(r.email) === normalized)) {
    return { ok: false, reason: 'duplicate_email' }
  }

  const reservation: Reservation = {
    code: makeCode(),
    name: name.trim(),
    email: email.trim(),
    reservedAt: new Date().toISOString(),
  }
  store.reservations.push(reservation)
  store.mine = reservation.code
  writeStore(store)

  return { ok: true, reservation, remaining: EVENT.capacity - store.reservations.length }
}
