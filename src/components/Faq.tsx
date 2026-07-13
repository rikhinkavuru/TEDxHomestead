import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Section, Reveal } from './chrome'
import { EVENT } from '../data/event'

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: 'How much do tickets cost?',
    a: `Nothing. Every seat is free, but the room only holds ${EVENT.capacity} people — reserve with your name and email and you're in.`,
  },
  {
    q: 'Who can attend?',
    a: 'Anyone. Students, parents, teachers, and the wider Fort Wayne community. It is not limited to Homestead students.',
  },
  {
    q: 'What exactly is a TEDx event?',
    a: 'TEDx events are independently organized, TED-licensed gatherings that bring the TED format to a local community: short live talks, one idea each. TED provides guidance; students and volunteers run everything you see here.',
  },
  {
    q: 'When are speakers announced?',
    a: 'On a rolling basis in the weeks before the event. Ticket holders get an email the moment each name drops.',
  },
  {
    q: 'Where do I park, and when should I arrive?',
    a: `Parking is free in the ${EVENT.venue.name} lot — enter from Homestead Road. Doors open at ${EVENT.doorsOpen}; talks run ${EVENT.time}.`,
  },
]

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const email = EVENT.contactEmail
  async function copy() {
    let ok = false
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email)
        ok = true
      }
    } catch {
      /* fall through to execCommand */
    }
    if (!ok) {
      try {
        const ta = document.createElement('textarea')
        ta.value = email
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        ok = document.execCommand('copy')
        ta.remove()
      } catch {
        ok = false
      }
    }
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    }
  }
  return (
    <button className="smfaq-copy" onClick={copy} aria-label={`Copy ${email}`}>
      Contact {email}
      {copied ? (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3.5 8.5 6.5 11.5 12.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="5.5" y="5.5" width="8" height="8" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10.5 5.5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {copied && <span className="smfaq-copied">Copied</span>}
    </button>
  )
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Section id="faq">
      <div className="smfaq-head">
        <Reveal>
          <h2 className="smhead">FAQ</h2>
        </Reveal>
      </div>
      <div className="smfaq-list">
      {FAQS.map((f, i) => (
        <div className={`smfaq-item ${open === i ? 'open' : ''}`} key={f.q}>
          <button
            className="smfaq-q"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="n">0{i + 1}</span>
            {f.q}
            <span className="pm" aria-hidden="true">{open === i ? '−' : '+'}</span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                className="smfaq-a"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <p>{f.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      </div>
      <div className="smfaq-foot">
        <span>Still something on your mind?</span>
        <CopyEmail />
      </div>
    </Section>
  )
}
