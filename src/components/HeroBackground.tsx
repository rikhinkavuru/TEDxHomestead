import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const PHOTOS = [
  '/hero/hero-1.png',
  '/hero/hero-2.jpg',
  '/hero/hero-3.png',
  '/hero/hero-4.png',
  '/hero/hero-5.png',
]

const INTERVAL_MS = 5000

/**
 * Rotating black-and-white photo slideshow behind the hero. Photos cross-fade,
 * carry a grain overlay for texture, and sit under a cream scrim so the dark
 * hero text stays easily readable. Static (first frame only) under reduced
 * motion. Pauses while the tab is hidden.
 */
export function HeroBackground() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce) return
    let timer: number | undefined
    const tick = () => {
      if (!document.hidden) setIndex((i) => (i + 1) % PHOTOS.length)
    }
    timer = window.setInterval(tick, INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [reduce])

  return (
    <div className="smhero-bg" aria-hidden="true">
      <div className="smhero-photos">
        {PHOTOS.map((src, i) => (
          <div
            key={src}
            className="smhero-photo"
            style={{
              backgroundImage: `url(${src})`,
              opacity: i === index ? 1 : 0,
            }}
          />
        ))}
      </div>
      <div className="smhero-scrim" />
      <div className="smhero-grain" />
    </div>
  )
}
