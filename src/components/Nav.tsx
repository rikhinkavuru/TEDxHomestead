const LINKS = [
  { href: '#about', label: 'about' },
  { href: '#speakers', label: 'speakers' },
  { href: '#venue', label: 'venue' },
]

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-900 bg-bone-100">
      <nav className="mx-auto flex h-14 max-w-[1240px] items-center justify-between px-[6%]">
        <a
          href="#top"
          className="font-display text-[17px] font-bold lowercase tracking-[-0.02em] text-ink-900"
        >
          tedxhomestead
        </a>

        <div className="flex items-center gap-6">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="label hidden text-ink-500 transition-colors duration-[120ms] hover:text-ink-900 sm:block"
            >
              {l.label}
            </a>
          ))}
          <a href="#tickets" className="btn btn--primary inline-block no-underline">
            get tickets
          </a>
        </div>
      </nav>
    </header>
  )
}
