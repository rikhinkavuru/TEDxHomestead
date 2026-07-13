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

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Section id="faq">
      <div className="smfaq-head">
        <Reveal>
          <h2 className="smhead">The fine print, <span className="g">in plain English.</span></h2>
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
        {EVENT.contactEmail ? (
          <a href={`mailto:${EVENT.contactEmail}`}>Ask the organizers →</a>
        ) : (
          <span>Ask any organizer at school</span>
        )}
      </div>
    </Section>
  )
}
