import { motion } from 'framer-motion'
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

export function Hero({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="smhero" id="top">
      <HeroBackground />

      <motion.h1 variants={rise} custom={0} initial="hidden" animate="show">
        The ideas stage for Fort Wayne<span className="enddot">.</span>
      </motion.h1>

      <motion.div className="smhero-ctas" variants={rise} custom={1} initial="hidden" animate="show">
        <ArrowButton onClick={() => onNavigate('tickets')}>Get Tickets</ArrowButton>
        <GhostButton onClick={() => onNavigate('speakers')}>Meet the speakers</GhostButton>
      </motion.div>

      <motion.div className="smhero-facts" variants={rise} custom={2} initial="hidden" animate="show">
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
