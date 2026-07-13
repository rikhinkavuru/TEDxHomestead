import { useLayoutEffect, useState } from 'react'

const DISMISS_KEY = 'tedxhomestead.announce.dismissed.v1'

function initialShown() {
  try {
    return localStorage.getItem(DISMISS_KEY) !== '1'
  } catch {
    return true
  }
}

/**
 * Slim announcement bar pinned above the nav. Dismissible (remembers the
 * choice), and while shown it sets --bar-h on <html> so the fixed nav and the
 * hero drop below it with no overlap. Dismiss state is read synchronously and
 * the class applied before paint, so there's no load flicker / layout shift.
 */
export function AnnouncementBar({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [shown, setShown] = useState(initialShown)

  useLayoutEffect(() => {
    const root = document.documentElement
    if (shown) root.classList.add('has-bar')
    else root.classList.remove('has-bar')
    return () => root.classList.remove('has-bar')
  }, [shown])

  function dismiss() {
    setShown(false)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  if (!shown) return null

  return (
    <div className="smbar" role="region" aria-label="Announcement">
      <button className="smbar-msg" onClick={() => onNavigate('tickets')}>
        <span className="smbar-dot" aria-hidden="true" />
        Free tickets are now open — reserve your seat
        <span className="smbar-arr" aria-hidden="true">→</span>
      </button>
      <button className="smbar-close" onClick={dismiss} aria-label="Dismiss announcement">
        ×
      </button>
    </div>
  )
}
