import { useEffect, useRef, useState } from 'react'
import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

/** Blur-fade reveal: children rise out of a blur when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(9px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** rAF count-up that fires once in view; static under reduced motion. */
export function Ticker({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(to)
      return
    }
    let raf = 0
    let started = false
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return
        started = true
        const start = performance.now()
        const dur = 1200
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur)
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to])
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  )
}

/**
 * TEDx "x" brand mark: two crossing italic strokes with squared caps,
 * drawn as pure geometry so it scales crisply. `color` overrides for
 * dark surfaces (pass "#fff").
 */
export function XMark({
  size = 26,
  color = 'var(--red, #e62b1e)',
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      {/* two bars crossing, slight italic slant like the event wordmark */}
      <path d="M6.5 3.5 L24.5 24.5" stroke={color} strokeWidth="5.4" strokeLinecap="square" />
      <path d="M21.5 3.5 L3.5 24.5" stroke={color} strokeWidth="5.4" strokeLinecap="square" />
    </svg>
  )
}

/** A plain section: content laid on the page background, no rail, no box. */
export function Section({
  id,
  children,
}: {
  label?: string
  index?: number
  total?: number
  id?: string
  children: ReactNode
}) {
  return (
    <section className="smsection" id={id}>
      <div className="smwrap">{children}</div>
    </section>
  )
}

/** The TEDx event logo (red on black). */
export function TedxLogo({ className = '' }: { className?: string }) {
  return <img className={`tedx-logo ${className}`} src="/tedx-logo.jpg" alt="TEDx" />
}

/** Primary button with the divided arrow cell. */
export function ArrowButton({
  children,
  className = '',
  ...rest
}: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`smbtn primary ${className}`} {...rest}>
      {children}
      <span className="arr-cell">
        <span className="arr" aria-hidden="true">→</span>
      </span>
    </button>
  )
}

export function GhostButton({
  children,
  className = '',
  ...rest
}: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`smbtn ghost ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function GhostLink({
  children,
  className = '',
  ...rest
}: { children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`smbtn ghost ${className}`} {...rest}>
      {children}
    </a>
  )
}
