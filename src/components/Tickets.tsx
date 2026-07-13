import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Section, Reveal, ArrowButton } from './chrome'
import { EVENT } from '../data/event'
import { getMyReservation, getRemaining, reserveTicket, type Reservation } from '../lib/tickets'

const ERROR_MESSAGES: Record<string, string> = {
  sold_out: 'All 100 seats are reserved. Email us for the waitlist.',
  duplicate_email: 'A ticket is already held under this email.',
  already_reserved: 'This device already holds a ticket.',
  invalid: 'Enter your name and a valid email.',
  error: 'Something went wrong reserving your seat. Please try again.',
}

/** Full-screen ticket reveal — dims the page, floats a keepsake ticket. */
function TicketOverlay({ reservation, onClose }: { reservation: Reservation; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className="tkt-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Your ticket"
    >
      <button className="tkt-close" onClick={onClose}>← Back to event</button>

      <motion.div
        className="tkt"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 30, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      >
        <div className="tkt-main">
          <div className="tkt-kicker">TEDxHomestead presents</div>
          <div className="tkt-name">{reservation.name}</div>
          <div className="tkt-foot">
            <span>{EVENT.venue.name} · {EVENT.dateLine} 2026</span>
            <span className="tkt-code">{reservation.code}</span>
          </div>
        </div>
        <div className="tkt-stub">
          <span className="tkt-admit">ADMIT ONE</span>
        </div>
        <span className="tkt-notch tkt-notch--top" aria-hidden="true" />
        <span className="tkt-notch tkt-notch--bottom" aria-hidden="true" />
      </motion.div>

      <p className="tkt-note">
        This ticket is just for fun! We&apos;ll email you with updates, and hope to see you at the
        event!
      </p>
    </motion.div>
  )
}

export function Tickets() {
  const [remaining, setRemaining] = useState<number | null>(null)
  const [mine, setMine] = useState<Reservation | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showTicket, setShowTicket] = useState(false)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const mountedAt = useRef(Date.now())

  useEffect(() => {
    getRemaining().then(setRemaining)
    getMyReservation().then(setMine)
  }, [])

  // lock body scroll while the ticket overlay is open
  useEffect(() => {
    document.body.style.overflow = showTicket ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [showTicket])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (honeypotRef.current?.value || Date.now() - mountedAt.current < 1500) return
    setSubmitting(true)
    const result = await reserveTicket(name, email)
    setSubmitting(false)
    if (result.ok) {
      setMine(result.reservation)
      setRemaining(result.remaining)
      setShowTicket(true)
    } else {
      setError(ERROR_MESSAGES[result.reason])
    }
  }

  const soldOut = remaining !== null && remaining <= 0 && !mine
  const taken = remaining === null ? 0 : EVENT.capacity - remaining
  const pct = Math.min(100, Math.round((taken / EVENT.capacity) * 100))

  return (
    <Section id="tickets">
      <div className="smtix">
        <Reveal>
          <h2 className="smhead smtix-title">
            One hundred seats. <span className="g">Yours is free.</span>
          </h2>
          <p className="smtix-lead">
            TEDx caps this event at {EVENT.capacity} attendees, so every seat is reserved by name.
            One ticket per person — claim yours before they&apos;re gone.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="smtix-card">
            {mine ? (
              <div className="smtix-done">
                <div className="smtix-done-badge">You&apos;re in ✓</div>
                <h3>Seat reserved for {mine.name.split(' ')[0]}.</h3>
                <p>Your ticket code is <b>{mine.code}</b>. We&apos;ll email event updates.</p>
                <button className="smbtn primary" onClick={() => setShowTicket(true)}>
                  View your ticket
                </button>
              </div>
            ) : soldOut ? (
              <div className="smtix-done">
                <h3>Sold out</h3>
                <p>
                  All {EVENT.capacity} seats are reserved. Seats sometimes open up — contact us for
                  the waitlist.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <h4>Reserve your seat</h4>

                <label htmlFor="ticket-name">Name</label>
                <input
                  id="ticket-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="First Last"
                />

                <label htmlFor="ticket-email">Email</label>
                <input
                  id="ticket-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />

                <input
                  ref={honeypotRef}
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="smhp"
                />

                <AnimatePresence>
                  {error && (
                    <motion.p
                      className="smtix-err"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      role="alert"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <ArrowButton type="submit" disabled={submitting}>
                  {submitting ? 'Reserving…' : 'Get my free ticket'}
                </ArrowButton>

                <p className="fine">
                  One ticket per person. Your email holds your seat and receives event updates —
                  nothing else.
                </p>
              </form>
            )}

            {/* thin fill line: how many of the 100 seats are claimed */}
            <div className="smtix-fill" role="img" aria-label={`${taken} of ${EVENT.capacity} seats reserved`}>
              <motion.i
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </Reveal>

        <p className="smtix-count">{taken} of {EVENT.capacity} seats reserved</p>
      </div>

      <AnimatePresence>
        {showTicket && mine && (
          <TicketOverlay reservation={mine} onClose={() => setShowTicket(false)} />
        )}
      </AnimatePresence>
    </Section>
  )
}
