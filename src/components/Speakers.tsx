import { useState } from 'react'
import { motion } from 'framer-motion'
import Reveal from './Reveal'
import { SPEAKERS, type Speaker } from '../data/speakers'

function Headshot({ speaker }: { speaker: Speaker }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    // Placeholder until real headshots are dropped into public/headshots/
    return (
      <div className="flex aspect-[4/5] w-full items-end justify-start bg-gradient-to-b from-neutral-200 to-neutral-300 p-4">
        <span className="text-6xl font-black text-neutral-400/70" aria-hidden>
          {speaker.name.charAt(0)}
        </span>
      </div>
    )
  }

  return (
    <img
      src={speaker.headshot}
      alt={speaker.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
    />
  )
}

export default function Speakers() {
  return (
    <section id="speakers" className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <Reveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-ted">
            Six talks · One evening
          </p>
          <h2 className="display mb-14 text-4xl font-black sm:text-5xl">Speakers</h2>
        </Reveal>

        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {SPEAKERS.map((s, i) => (
            <motion.article
              key={s.id}
              className="group"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <div className="mb-5 overflow-hidden rounded-xl">
                <Headshot speaker={s} />
              </div>
              <h3 className="text-xl font-bold">{s.name}</h3>
              <p className="mb-3 text-sm font-medium text-ink/50">{s.title}</p>
              <p className="font-semibold leading-snug text-ted">“{s.talkTitle}”</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.bio}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
