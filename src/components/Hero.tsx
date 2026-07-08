import { motion } from 'framer-motion'
import { EVENT } from '../data/event'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink text-white">
      {/* subtle red glow, anchored off-canvas so it reads as stage light */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-25"
        style={{ background: 'radial-gradient(closest-side, #eb0028, transparent 70%)' }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-32"
      >
        <motion.p variants={item} className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
          An independently organized TED event
        </motion.p>

        <motion.h1 variants={item} className="display text-[clamp(2.5rem,9.5vw,8rem)] font-black leading-[0.95]">
          <span className="text-ted">TEDx</span>Homestead
          <br />
          High School
        </motion.h1>

        <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-base sm:text-lg">
          <span className="font-semibold">{EVENT.date}</span>
          <span className="h-1 w-1 rounded-full bg-ted" aria-hidden />
          <span>{EVENT.time}</span>
          <span className="h-1 w-1 rounded-full bg-ted" aria-hidden />
          <span className="text-white/70">{EVENT.venue.name} · Fort Wayne, IN</span>
        </motion.div>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#tickets"
            className="rounded-full bg-ted px-7 py-3.5 font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Reserve your free seat
          </a>
          <a
            href="#speakers"
            className="rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white/90 transition-colors hover:border-white/60"
          >
            Meet the speakers
          </a>
          <span className="text-sm text-white/50">Limited to {EVENT.capacity} attendees</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
