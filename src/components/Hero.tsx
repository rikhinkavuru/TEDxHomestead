import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EVENT } from '../data/event'
import { ArrowButton, GhostButton } from './chrome'
import { HeroBackground } from './HeroBackground'

const rise = {
  hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const WORDS = ['community', 'school', 'friends', 'city', 'class']

/** Seamless vertical word carousel for the subheader. */
function RotatingWord() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce) return
    const t = window.setInterval(() => setI((n) => (n + 1) % WORDS.length), 2200)
    return () => window.clearInterval(t)
  }, [reduce])
  return (
    <span className="rot">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={WORDS[i]}
          className="rot-w"
          initial={reduce ? { opacity: 0 } : { y: '105%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: '-105%', opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function Hero({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="smhero" id="top">
      <HeroBackground />

      <motion.h1 variants={rise} custom={0} initial="hidden" animate="show">
        TED<span className="enddot">x</span>Homestead
        <br />
        High School
      </motion.h1>

      <motion.p className="smhero-tagline" variants={rise} custom={1} initial="hidden" animate="show">
        <span className="smhero-tagline-line">
          Ideas worth spreading — for your <RotatingWord />
        </span>
        <span className="smhero-tagline-sub">
          Six live talks, one night, a hundred seats.
        </span>
      </motion.p>

      <motion.div className="smhero-ctas" variants={rise} custom={2} initial="hidden" animate="show">
        <ArrowButton onClick={() => onNavigate('tickets')}>Get Tickets</ArrowButton>
        <GhostButton onClick={() => onNavigate('speakers')}>Meet the speakers</GhostButton>
      </motion.div>

      <motion.div className="smhero-facts" variants={rise} custom={3} initial="hidden" animate="show">
        <span className="fact"><b>{EVENT.dateLine}</b> 2026</span>
        <span className="dot" />
        <span className="fact">Doors {EVENT.doorsOpen}</span>
        <span className="dot" />
        <span className="fact">Talks {EVENT.timeShort}</span>
        <span className="dot" />
        <span className="fact">{EVENT.venue.name}</span>
      </motion.div>
    </div>
  )
}
