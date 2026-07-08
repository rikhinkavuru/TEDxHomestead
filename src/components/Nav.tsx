import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EVENT } from '../data/event'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#speakers', label: 'Speakers' },
  { href: '#venue', label: 'Venue' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur border-b border-black/10' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-baseline gap-0.5 font-black tracking-tight">
          <span className={scrolled ? 'text-ted' : 'text-ted'}>TEDx</span>
          <span className={scrolled ? 'text-ink' : 'text-white'}>Homestead</span>
        </a>

        <div className="flex items-center gap-6">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`hidden text-sm font-medium sm:block hover:text-ted transition-colors ${
                scrolled ? 'text-ink/70' : 'text-white/80'
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#tickets"
            className="rounded-full bg-ted px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Get a free ticket
          </a>
        </div>
      </nav>
      <span className="sr-only">{EVENT.name}</span>
    </motion.header>
  )
}
