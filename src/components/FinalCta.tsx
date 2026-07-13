import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Section, ArrowButton, GhostButton, Ticker } from './chrome'
import { EVENT } from '../data/event'
import { getRemaining } from '../lib/tickets'

const SLOT_WORDS = ['Friday', 'evening', 'seat', 'idea', 'city', 'school']

/** Slot-machine word: fixed-width box, words roll through vertically. */
function SlotWord() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setI((n) => (n + 1) % SLOT_WORDS.length), 2200)
    return () => window.clearInterval(t)
  }, [])
  return (
    <span className="boxed slot">
      <span className="slot-window">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={SLOT_WORDS[i]}
            className="slot-word"
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-105%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {SLOT_WORDS[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  )
}

export function FinalCta({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [remaining, setRemaining] = useState<number>(EVENT.capacity)
  useEffect(() => {
    getRemaining().then(setRemaining)
  }, [])

  return (
    <Section label="Be there" index={6} id="join">
      <div className="smfinal">
        <h2>
          Your <SlotWord /> deserves a{' '}
          <span className="g">better conversation.</span>
        </h2>
        <div className="smfinal-row">
          <div className="smcount">
            <div className="lbl">Free seats still open</div>
            <div className="num"><Ticker to={remaining} /></div>
          </div>
          <div className="smfinal-ctas">
            <ArrowButton onClick={() => onNavigate('tickets')}>Get Tickets</ArrowButton>
            <GhostButton onClick={() => onNavigate('speakers')}>
              See who&apos;s speaking
            </GhostButton>
          </div>
        </div>
      </div>
    </Section>
  )
}
