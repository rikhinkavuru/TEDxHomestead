import { useEffect, useState } from 'react'
import { ArrowButton } from './chrome'

const LINKS: Array<{ label: string; id: string }> = [
  { label: 'About', id: 'event' },
  { label: 'Speakers', id: 'speakers' },
  { label: 'Tickets', id: 'tickets' },
  { label: 'FAQ', id: 'faq' },
]

export function Nav({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`smnav ${scrolled ? 'scrolled' : ''}`}>
      <div className="smnav-inner">
        <button className="smnav-logo" onClick={() => onNavigate('top')}>
          TED<span className="x">x</span>Homestead
        </button>
        <nav className="smnav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <button key={l.id} onClick={() => onNavigate(l.id)}>
              {l.label}
            </button>
          ))}
        </nav>
        <div className="smnav-cta">
          <ArrowButton onClick={() => onNavigate('tickets')}>Get Tickets</ArrowButton>
        </div>
      </div>
    </header>
  )
}
