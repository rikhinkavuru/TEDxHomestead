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
  sold_out: 'all 100 seats are reserved. email us for the waitlist.',
  duplicate_email: 'a ticket is already held under this email.',
  already_reserved: 'this device already holds a ticket.',
  invalid: 'enter your name and a valid email.',
}

function TicketStub({ reservation }: { reservation: Reservation }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
      className="border border-ink-900 bg-bone-50"
    >
      <div className="flex justify-between bg-red-500 px-4 py-2.5">
        <span className="label text-bone-50">admit one</span>
        <span className="label text-bone-50">free</span>
      </div>
      <div className="px-4 py-4">
        <p className="text-[11px] text-ink-500">Ticket code</p>
        <p className="font-display text-[40px] font-black leading-none tracking-[-0.02em]">
          {reservation.code}
        </p>
      </div>
      <div className="grid grid-cols-1 border-t border-ink-900 sm:grid-cols-[1fr_1.6fr_1.4fr]">
        <div className="px-4 py-2 sm:border-r sm:border-ink-900">
          <p className="text-[13px] font-bold leading-normal">{reservation.name}</p>
        </div>
        <div className="border-t border-ink-300 px-4 py-2 sm:border-t-0 sm:border-r sm:border-ink-900">
          <p className="text-[13px] leading-normal">
            Friday October 2nd 2026
            <br />
            {EVENT.venue.name}
          </p>
        </div>
        <div className="border-t border-ink-300 px-4 py-2 sm:border-t-0">
          <p className="text-[13px] leading-normal text-red-700">
            Doors open at {EVENT.doorsOpen}
            <br />
            {EVENT.timeShort}
          </p>
        </div>
      </div>
      <p className="border-t border-ink-300 px-4 py-3 text-[11px] leading-[1.4] text-ink-500">
        Screenshot this stub or write down the code — you'll show it at the door.
      </p>
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
    <section id="tickets" className="border-t border-ink-900">
      <div className="mx-auto max-w-[1240px] px-[6%] py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-4">
              <span className="n">—</span> tickets
            </p>
            <h2 className="display mb-6">one hundred seats</h2>
            <p className="max-w-[52ch] text-[18px] leading-[1.45] text-ink-700">
              TEDx caps this event at {EVENT.capacity} attendees. Tickets are free. One per
              person — a reservation holds a seat under your name.
            </p>

            <div className="mt-10 flex items-baseline gap-3 border-t border-ink-900 pt-4">
              <span className="font-display text-[64px] font-black leading-[0.82] tracking-[-0.04em] text-red-500">
                {remaining ?? '—'}
              </span>
              <span className="text-[13px] text-ink-500">of {EVENT.capacity} seats remaining</span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            {mine ? (
              <TicketStub reservation={mine} />
            ) : soldOut ? (
              <div className="border border-ink-900 bg-bone-50 p-6">
                <h3 className="font-display text-[24px] font-bold lowercase tracking-[-0.02em]">
                  sold out
                </h3>
                <p className="mt-3 text-[15px] text-ink-700">
                  All {EVENT.capacity} seats are reserved. Seats sometimes open up — contact us
                  for the waitlist.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="border border-ink-900 bg-bone-50 p-6">
                <label className="label block text-ink-900" htmlFor="ticket-name">
                  name
                </label>
                <input
                  id="ticket-name"
                  className="field mt-2"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="first last"
                />

                <label className="label mt-5 block text-ink-900" htmlFor="ticket-email">
                  email
                </label>
                <input
                  id="ticket-email"
                  className="field mt-2"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
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
                      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                      className="mt-4 text-[13px] font-bold text-red-700"
                      role="alert"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={submitting} className="btn btn--primary mt-6 w-full">
                  {submitting ? 'reserving' : 'get ticket'}
                </button>

                <p className="mt-4 text-[11px] leading-[1.4] text-ink-500">
                  One ticket per person. Your email holds your seat and receives event updates —
                  nothing else.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
