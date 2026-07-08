import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from './Reveal'
import { EVENT } from '../data/event'
import {
  getMyReservation,
  getRemaining,
  reserveTicket,
  type Reservation,
} from '../lib/tickets'

const ERROR_MESSAGES: Record<string, string> = {
  sold_out: 'All 100 seats have been reserved. Email us to join the waitlist.',
  duplicate_email: 'A ticket has already been reserved with this email.',
  already_reserved: 'This device already holds a ticket.',
  invalid: 'Please enter your name and a valid email address.',
}

function TicketStub({ reservation, remaining }: { reservation: Reservation; remaining: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, rotate: -1 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="overflow-hidden rounded-2xl bg-white text-ink shadow-2xl"
    >
      <div className="bg-ted px-6 py-3 text-sm font-bold uppercase tracking-widest text-white">
        Admit one · Free
      </div>
      <div className="space-y-4 px-6 py-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">Ticket code</p>
          <p className="font-mono text-3xl font-bold tracking-wide">{reservation.code}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">Name</p>
            <p className="font-semibold">{reservation.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">Date</p>
            <p className="font-semibold">{EVENT.date}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">Time</p>
            <p className="font-semibold">{EVENT.time}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">Venue</p>
            <p className="font-semibold">{EVENT.venue.name}</p>
          </div>
        </div>
        <p className="border-t border-dashed border-ink/15 pt-4 text-xs text-ink/50">
          Screenshot this ticket or write down your code — you'll show it at the door.{' '}
          {remaining} of {EVENT.capacity} seats still open.
        </p>
      </div>
    </motion.div>
  )
}

export default function Tickets() {
  const [remaining, setRemaining] = useState<number | null>(null)
  const [mine, setMine] = useState<Reservation | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  // Bot resistance: hidden honeypot field + a minimum time-to-fill check.
  const honeypotRef = useRef<HTMLInputElement>(null)
  const mountedAt = useRef(Date.now())

  useEffect(() => {
    getRemaining().then(setRemaining)
    getMyReservation().then(setMine)
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (honeypotRef.current?.value || Date.now() - mountedAt.current < 1500) {
      // Filled the invisible field or submitted inhumanly fast — quietly drop.
      return
    }

    setSubmitting(true)
    const result = await reserveTicket(name, email)
    setSubmitting(false)

    if (result.ok) {
      setMine(result.reservation)
      setRemaining(result.remaining)
    } else {
      setError(ERROR_MESSAGES[result.reason])
    }
  }

  const soldOut = remaining !== null && remaining <= 0 && !mine

  return (
    <section id="tickets" className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-24 md:grid-cols-2 md:py-32">
        <Reveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-ted">
            Free admission
          </p>
          <h2 className="display text-4xl font-black sm:text-5xl">Reserve your seat</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
            TEDx rules cap this event at {EVENT.capacity} attendees, so every seat counts. Tickets
            are completely free — reserve one below and it's held under your name.
          </p>

          <div className="mt-10 flex items-baseline gap-3">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={remaining ?? 'loading'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="display text-6xl font-black text-ted"
              >
                {remaining ?? '—'}
              </motion.span>
            </AnimatePresence>
            <span className="text-lg text-white/60">of {EVENT.capacity} seats remaining</span>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          {mine ? (
            <TicketStub reservation={mine} remaining={remaining ?? 0} />
          ) : soldOut ? (
            <div className="rounded-2xl border border-white/15 p-8">
              <h3 className="text-2xl font-bold">Sold out</h3>
              <p className="mt-3 text-white/70">
                All {EVENT.capacity} seats are reserved. Contact us to join the waitlist — seats
                sometimes open up.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="rounded-2xl border border-white/15 p-8">
              <label className="block text-sm font-semibold" htmlFor="ticket-name">
                Full name
              </label>
              <input
                id="ticket-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-ted"
                placeholder="Ada Lovelace"
              />

              <label className="mt-5 block text-sm font-semibold" htmlFor="ticket-email">
                Email
              </label>
              <input
                id="ticket-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-ted"
                placeholder="you@example.com"
              />

              {/* Honeypot — hidden from humans, tempting for bots */}
              <input
                ref={honeypotRef}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 text-sm font-medium text-red-400"
                    role="alert"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 w-full rounded-full bg-ted py-3.5 font-semibold text-white disabled:opacity-60"
              >
                {submitting ? 'Reserving…' : 'Get my free ticket'}
              </motion.button>

              <p className="mt-4 text-xs leading-relaxed text-white/40">
                One ticket per person. Your email is only used to hold your seat and send event
                updates — never shared.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
