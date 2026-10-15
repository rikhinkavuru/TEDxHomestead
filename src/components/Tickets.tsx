import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Section, Reveal, ArrowButton } from './chrome'
import { EVENT } from '../data/event'
import {
  getRemaining,
  isValidEmail,
  isValidPhone,
  reserveTicket,
  type Reservation,
} from '../lib/tickets'

const ERROR_MESSAGES: Record<string, string> = {
  sold_out: 'All 100 seats are reserved. Email us for the waitlist.',
  duplicate_name: 'This person already has a ticket under this email.',
  // Returned by the database before the group-tickets migration runs.
  duplicate_email: 'A ticket is already held under this email.',
  email_limit: 'This email already holds 6 tickets. Use a different email for this person.',
  invalid: 'Check this person\'s name, email, and phone number.',
  error: 'Something went wrong reserving this seat. Please try again.',
}

/** Most people one form submission can reserve. */
const MAX_GROUP = 6

const NUMBER_WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six']

interface Person {
  id: number
  name: string
  email: string
  phone: string
  error?: string
  /** Which field the error is about; unset means the whole person (server errors). */
  errorField?: Field
}

type Field = 'name' | 'email' | 'phone'

interface Booked {
  reservation: Reservation
  emailSent: boolean
}

let nextPersonId = 1
const blankPerson = (): Person => ({ id: nextPersonId++, name: '', email: '', phone: '' })

/** Client-side check so we can point at the exact field before hitting the server. */
function problemWith(p: Person): Pick<Person, 'error' | 'errorField'> {
  if (!p.name.trim()) return { error: 'Enter a name.', errorField: 'name' }
  if (!isValidEmail(p.email)) return { error: 'Enter a valid email.', errorField: 'email' }
  if (!isValidPhone(p.phone)) {
    return { error: 'Enter a phone number with at least 7 digits.', errorField: 'phone' }
  }
  return { error: undefined, errorField: undefined }
}

const isBad = (p: Person, field: Field) => !!p.error && (!p.errorField || p.errorField === field)

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
}

const firstName = (b: Booked) => b.reservation.name.split(' ')[0]

/** Draw the ticket to a canvas and download it as a PNG keepsake. */
async function saveTicket(r: Reservation) {
  const W = 1000
  const H = 560
  const s = 2
  const canvas = document.createElement('canvas')
  canvas.width = W * s
  canvas.height = H * s
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.scale(s, s)
  try {
    await document.fonts.ready
  } catch {
    /* fall back to system fonts */
  }

  const r16 = (x: number, y: number, w: number, h: number, rad: number) => {
    ctx.beginPath()
    ctx.moveTo(x + rad, y)
    ctx.arcTo(x + w, y, x + w, y + h, rad)
    ctx.arcTo(x + w, y + h, x, y + h, rad)
    ctx.arcTo(x, y + h, x, y, rad)
    ctx.arcTo(x, y, x + w, y, rad)
    ctx.closePath()
  }

  // ticket body
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, '#ff8a63')
  grad.addColorStop(0.44, '#e62b1e')
  grad.addColorStop(1, '#b51c12')
  r16(0, 0, W, H, 26)
  ctx.fillStyle = grad
  ctx.fill()

  const stubX = W - 128

  // perforation
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'
  ctx.lineWidth = 2
  ctx.setLineDash([10, 10])
  ctx.beginPath()
  ctx.moveTo(stubX, 24)
  ctx.lineTo(stubX, H - 24)
  ctx.stroke()
  ctx.setLineDash([])

  // main text
  const pad = 60
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = 'rgba(255,255,255,0.88)'
  ctx.font = "500 20px 'DM Mono', ui-monospace, monospace"
  ctx.fillText('TEDXHOMESTEAD PRESENTS', pad, 78)

  ctx.fillStyle = '#ffffff'
  ctx.font = "600 74px 'Bricolage Grotesque', sans-serif"
  const name = r.name.toUpperCase()
  const maxW = stubX - pad - 40
  const words = name.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  const nameLines = lines.slice(0, 2)
  let ny = 250
  for (const l of nameLines) {
    ctx.fillText(l, pad, ny)
    ny += 78
  }

  ctx.font = "500 22px 'DM Mono', ui-monospace, monospace"
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.fillText(EVENT.venue.name, pad, H - 118)
  ctx.fillText(`${EVENT.dateLine}, 2026 · ${EVENT.timeShort}`, pad, H - 86)
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.fillText(r.code, pad, H - 54)

  // ADMIT ONE, vertical
  ctx.save()
  ctx.translate(stubX + 64, H / 2)
  ctx.rotate(Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = "500 26px 'DM Mono', ui-monospace, monospace"
  ctx.fillText('A D M I T   O N E', 0, 0)
  ctx.restore()

  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'))
  if (!blob) return

  const safeName = r.name.replace(/[^a-zA-Z0-9]/g, '') || 'Guest'
  const filename = `${safeName}TEDxTicket.png`
  const file = new File([blob], filename, { type: 'image/png' })

  // On phones/tablets, open the native share sheet so the user can "Save Image"
  // straight to their camera roll (people don't download files on mobile).
  // Desktop always downloads.
  const isTouch =
    (navigator.maxTouchPoints ?? 0) > 0 || window.matchMedia('(pointer: coarse)').matches
  if (isTouch && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'My TEDxHomestead ticket' })
      return
    } catch (err) {
      // user cancelled the share sheet — don't fall back to a download
      if (err instanceof Error && err.name === 'AbortError') return
      // otherwise fall through to the download path below
    }
  }

  // Desktop (or share unsupported): download the PNG.
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Full-screen ticket reveal — dims the page, floats one keepsake ticket per person. */
function TicketOverlay({ tickets, onClose }: { tickets: Booked[]; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const count = tickets.length
  const current = tickets[Math.min(index, count - 1)]
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (count > 1 && e.key === 'ArrowRight') setIndex((i) => (i + 1) % count)
      if (count > 1 && e.key === 'ArrowLeft') setIndex((i) => (i - 1 + count) % count)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, count])

  const allEmailed = tickets.every((t) => t.emailSent)

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
      aria-label={count > 1 ? 'Your tickets' : 'Your ticket'}
    >
      <button className="tkt-close" onClick={onClose}>← Back to event</button>

      <AnimatePresence mode="wait">
        <motion.div
          key={Math.min(index, count - 1)}
          className="tkt"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="tkt-main">
            <div className="tkt-kicker">TEDxHomestead presents</div>
            <div className="tkt-name">{current.reservation.name}</div>
            <div className="tkt-foot">
              <span>{EVENT.venue.name}</span>
              <span>{EVENT.dateLine}, 2026 · {EVENT.timeShort}</span>
              <span className="tkt-code">{current.reservation.code}</span>
            </div>
          </div>
          <div className="tkt-stub">
            <span className="tkt-admit">ADMIT ONE</span>
          </div>
          <span className="tkt-notch tkt-notch--top" aria-hidden="true" />
          <span className="tkt-notch tkt-notch--bottom" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>

      <div className="tkt-actions" onClick={(e) => e.stopPropagation()}>
        {count > 1 && (
          <button className="tkt-save tkt-nav" onClick={() => go(-1)} aria-label="Previous ticket">
            ‹
          </button>
        )}
        <button className="tkt-save" onClick={() => saveTicket(current.reservation)}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 2v8m0 0 3-3m-3 3L5 7M3 12v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Save
        </button>
        {count > 1 && (
          <button className="tkt-save tkt-nav" onClick={() => go(1)} aria-label="Next ticket">
            ›
          </button>
        )}
      </div>
      {count > 1 && (
        <div className="tkt-count" aria-live="polite">
          {Math.min(index, count - 1) + 1} of {count}
        </div>
      )}

      <p className="tkt-note">
        {allEmailed
          ? count > 1
            ? 'Each person gets a confirmation at their email. See you at the event!'
            : `A confirmation is on its way to ${current.reservation.email}. See you at the event!`
          : 'Save your tickets or note the codes. We hope to see you at the event!'}
      </p>
    </motion.div>
  )
}

export function Tickets() {
  const [remaining, setRemaining] = useState<number | null>(null)
  const [people, setPeople] = useState<Person[]>(() => [blankPerson()])
  const [booked, setBooked] = useState<Booked[]>([])
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState<{ at: number; of: number } | null>(null)
  const [showTicket, setShowTicket] = useState(false)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const mountedAt = useRef(Date.now())
  const focusId = useRef<number | null>(null)

  useEffect(() => {
    getRemaining().then(setRemaining)
  }, [])

  // lock body scroll while the ticket overlay is open
  useEffect(() => {
    document.body.style.overflow = showTicket ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [showTicket])

  // focus the name field of a newly added person
  useEffect(() => {
    if (focusId.current === null) return
    document.getElementById(`ticket-name-${focusId.current}`)?.focus()
    focusId.current = null
  }, [people])

  function update(id: number, field: Field, value: string) {
    setPeople((ps) =>
      ps.map((p) =>
        p.id === id ? { ...p, [field]: value, error: undefined, errorField: undefined } : p,
      ),
    )
  }

  function addPerson() {
    const p = blankPerson()
    focusId.current = p.id
    setPeople((ps) => [...ps, p])
  }

  function removePerson(id: number) {
    setPeople((ps) => ps.filter((p) => p.id !== id))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (honeypotRef.current?.value || Date.now() - mountedAt.current < 1500) return

    const checked = people.map((p) => ({ ...p, ...problemWith(p) }))
    if (checked.some((p) => p.error)) {
      setPeople(checked)
      return
    }
    if (remaining !== null && people.length > remaining) {
      setError(
        remaining === 0
          ? ERROR_MESSAGES.sold_out
          : `Only ${remaining} seat${remaining === 1 ? ' is' : 's are'} left. Remove someone to continue.`,
      )
      return
    }

    // Reserve each person separately: their own row, their own email.
    const succeeded: Booked[] = []
    const failed: Person[] = []
    let left = remaining
    for (let i = 0; i < people.length; i++) {
      setSubmitting({ at: i + 1, of: people.length })
      const p = people[i]
      const result = await reserveTicket(p.name, p.email, p.phone)
      if (result.ok) {
        succeeded.push({ reservation: result.reservation, emailSent: result.emailSent })
        left = result.remaining
      } else {
        failed.push({
          ...p,
          error: ERROR_MESSAGES[result.reason] ?? ERROR_MESSAGES.error,
          errorField: undefined,
        })
      }
    }
    setSubmitting(null)
    if (left !== null) setRemaining(left)

    const allBooked = [...booked, ...succeeded]
    setBooked(allBooked)
    if (failed.length === 0) {
      setPeople([blankPerson()])
      setDone(true)
      setShowTicket(true)
    } else {
      setPeople(failed)
      if (succeeded.length > 0) setShowTicket(true)
    }
  }

  function reserveMore() {
    setBooked([])
    setPeople([blankPerson()])
    setError(null)
    setDone(false)
  }

  const soldOut = remaining !== null && remaining <= 0 && !done && booked.length === 0
  const canAdd = people.length < MAX_GROUP && (remaining === null || people.length < remaining)
  const n = people.length
  const submitLabel = submitting
    ? submitting.of > 1
      ? `Reserving ${submitting.at} of ${submitting.of}…`
      : 'Reserving…'
    : n === 1
      ? 'Get my free ticket'
      : `Get my ${NUMBER_WORDS[n] ?? n} free tickets`
  const allEmailed = booked.every((b) => b.emailSent)

  return (
    <Section id="tickets">
      <div className="smtix">
        <Reveal>
          <h2 className="smhead smtix-title">
            Claim <span className="g">your spot.</span>
          </h2>
          <p className="smtix-lead">
            Coming with family or a group? Reserve a separate ticket for each person.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="smtix-card">
            {done ? (
              <div className="smtix-done">
                <div className="smtix-done-badge">You&apos;re in ✓</div>
                <h3>
                  {booked.length === 1
                    ? `Seat reserved for ${firstName(booked[0])}.`
                    : `${booked.length} seats reserved.`}
                </h3>
                <p>
                  {booked.length === 1 ? (
                    <>Ticket code <b>{booked[0].reservation.code}</b>. </>
                  ) : (
                    <>Tickets for {joinNames(booked.map(firstName))}. </>
                  )}
                  {allEmailed
                    ? booked.length === 1
                      ? `A confirmation is on its way to ${booked[0].reservation.email}.`
                      : 'Each person gets a confirmation at their email.'
                    : 'Save your tickets so you have the codes handy.'}
                </p>
                <button className="smbtn primary" onClick={() => setShowTicket(true)}>
                  {booked.length === 1 ? 'View ticket' : 'View tickets'}
                </button>
                {remaining !== 0 && (
                  <button className="smbtn ghost" onClick={reserveMore}>
                    Reserve more tickets
                  </button>
                )}
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
              <form onSubmit={onSubmit} noValidate>
                <h4>{n === 1 ? 'Reserve your seat' : 'Reserve your seats'}</h4>

                {booked.length > 0 && (
                  <p className="smtix-partial">
                    Reserved for {joinNames(booked.map(firstName))}.{' '}
                    <button type="button" onClick={() => setShowTicket(true)}>
                      View {booked.length === 1 ? 'ticket' : 'tickets'}
                    </button>
                    <br />
                    The {n === 1 ? 'person' : 'people'} below still need a seat.
                  </p>
                )}

                <AnimatePresence initial={false}>
                  {people.map((p, i) => (
                    <motion.fieldset
                      key={p.id}
                      className="smtix-person"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {n > 1 && (
                        <div className="smtix-person-head">
                          <legend>Person {i + 1}</legend>
                          <button
                            type="button"
                            className="smtix-remove"
                            onClick={() => removePerson(p.id)}
                            aria-label={`Remove person ${i + 1}`}
                          >
                            Remove
                          </button>
                        </div>
                      )}

                      <label htmlFor={`ticket-name-${p.id}`}>Name</label>
                      <input
                        id={`ticket-name-${p.id}`}
                        type="text"
                        value={p.name}
                        onChange={(e) => update(p.id, 'name', e.target.value)}
                        required
                        autoComplete={i === 0 ? 'name' : 'off'}
                        placeholder="First Last"
                        aria-invalid={isBad(p, 'name')}
                      />

                      <label htmlFor={`ticket-email-${p.id}`}>Email</label>
                      <input
                        id={`ticket-email-${p.id}`}
                        type="email"
                        value={p.email}
                        onChange={(e) => update(p.id, 'email', e.target.value)}
                        required
                        autoComplete={i === 0 ? 'email' : 'off'}
                        placeholder="you@example.com"
                        aria-invalid={isBad(p, 'email')}
                      />

                      <label htmlFor={`ticket-phone-${p.id}`}>Phone</label>
                      <input
                        id={`ticket-phone-${p.id}`}
                        type="tel"
                        value={p.phone}
                        onChange={(e) => update(p.id, 'phone', e.target.value)}
                        required
                        autoComplete={i === 0 ? 'tel' : 'off'}
                        inputMode="tel"
                        placeholder="(408) 555-0123"
                        aria-invalid={isBad(p, 'phone')}
                      />

                      {p.error && (
                        <p className="smtix-err" role="alert">
                          {p.error}
                        </p>
                      )}
                    </motion.fieldset>
                  ))}
                </AnimatePresence>

                {canAdd && (
                  <button type="button" className="smtix-add" onClick={addPerson}>
                    <span aria-hidden="true">+</span> Add another person
                  </button>
                )}

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

                <ArrowButton type="submit" disabled={!!submitting}>
                  {submitLabel}
                </ArrowButton>

                <p className="fine">
                  We&apos;ll email a confirmation and event updates. Your phone number is only for
                  day-of logistics.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {showTicket && booked.length > 0 && (
          <TicketOverlay tickets={booked} onClose={() => setShowTicket(false)} />
        )}
      </AnimatePresence>
    </Section>
  )
}
