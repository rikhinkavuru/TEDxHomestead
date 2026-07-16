import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section, Reveal } from './chrome'
import { SPEAKERS, type Speaker } from '../data/speakers'

function isPlaceholder(s: Speaker) {
  return s.name.trim().toLowerCase() === 'speaker name'
}
function initials(name: string) {
  const p = name.trim().split(/\s+/)
  return ((p[0]?.[0] ?? '') + (p[1]?.[0] ?? '')).toUpperCase()
}

function Art({ speaker }: { speaker: Speaker }) {
  const [failed, setFailed] = useState(false)
  const placeholder = isPlaceholder(speaker)
  if (!placeholder && !failed) {
    return (
      <div className="smspeaker-art">
        <img
          src={speaker.headshot}
          alt={speaker.name}
          loading="lazy"
          style={speaker.headshotPosition ? { objectPosition: speaker.headshotPosition } : undefined}
          onError={() => setFailed(true)}
        />
      </div>
    )
  }
  return (
    <div className="smspeaker-art">
      {placeholder ? <span className="tba">Reveal soon</span> : initials(speaker.name)}
    </div>
  )
}

function Bio({ speaker }: { speaker: Speaker }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="bio-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="bio" id={`bio-${speaker.id}`}>{speaker.bio}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        className="bio-toggle"
        aria-expanded={open}
        aria-controls={`bio-${speaker.id}`}
        onClick={() => setOpen(v => !v)}
      >
        {open ? 'Hide bio' : 'Read bio'}
        <span className="chev" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
    </>
  )
}

export function Speakers() {
  return (
    <Section id="speakers">
      <div className="smpeople-head">
        <Reveal>
          <h2 className="smhead">Six talks, <span className="g">one evening.</span></h2>
        </Reveal>
      </div>
      <div className="smpeople">
        {SPEAKERS.map((s, i) => {
          const placeholder = isPlaceholder(s)
          return (
            <motion.article
              className="smspeaker"
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Art speaker={s} />
              <div className="smspeaker-body">
                <div className="idx-label">Talk 0{i + 1}</div>
                <h3>{placeholder ? 'To be announced' : s.name}</h3>
                <div className="role">{placeholder ? 'Name drops soon' : s.title}</div>
                <p className="talk">
                  {placeholder ? 'We’re finalizing this speaker now.' : `“${s.talkTitle}”`}
                </p>
                {!placeholder && s.bio.trim() && <Bio speaker={s} />}
              </div>
            </motion.article>
          )
        })}
      </div>
    </Section>
  )
}
