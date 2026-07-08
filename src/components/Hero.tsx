import { EVENT } from '../data/event'
import { SPEAKERS } from '../data/speakers'

/**
 * The hero is a reconstruction of the poster grammar:
 * two flat fields, one full-bleed band carrying all the type,
 * one sail cut from the red, a halftone screen at the base.
 */
export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col bg-bone-100">
      {/* fields — bone left, red right, seam at 52.8% */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-y-0 left-[52.8%] right-0 bg-red-500" />
        <div
          className="absolute inset-y-0 left-[52.8%] right-0 bg-bone-50"
          style={{ clipPath: 'polygon(74% 46%, 91% 6%, 100% 30%)' }}
        />
      </div>

      {/* kicker */}
      <div className="relative z-10 flex justify-between gap-4 px-[6%] pt-10">
        <span className="label text-ink-900">an independently organized ted event</span>
        <span className="label hidden text-right text-bone-50 sm:block">fort wayne, indiana</span>
      </div>

      <div className="flex-1" />

      {/* the band — all primary content lives here */}
      <div className="relative z-10 bg-bone-50 px-[6%] py-[clamp(20px,3vw,44px)]">
        {/* fills its measure: font-size is a fraction of canvas width, per the wordmark law */}
        <h1 className="wordmark text-[clamp(40px,13.1vw,220px)]">tedxhomestead</h1>

        <div className="mt-[0.6vw] border-t-2 border-ink-900" />

        <p className="flex justify-between gap-4 pb-[1.2vw] pt-[1vw] font-display text-[clamp(15px,3.4vw,44px)] font-bold lowercase leading-none tracking-[-0.02em]">
          <span>{EVENT.dateShort}</span>
          <span>{EVENT.timeShort}</span>
        </p>

        {/* datablock: when & where / lineup / the commercial column */}
        <div className="grid grid-cols-1 border-b border-t border-ink-900 sm:grid-cols-[1fr_1.6fr_1.4fr]">
          <div className="py-2 pr-3 sm:border-r sm:border-ink-900">
            <p className="text-[13px] font-bold leading-normal">
              Friday
              <br />
              October 2nd 2026
              <br />
              {EVENT.venue.name}
              <br />
              Fort Wayne, Indiana
            </p>
          </div>
          <div className="border-t border-ink-900 px-0 py-2 sm:border-t-0 sm:px-3 sm:border-r sm:border-r-ink-900">
            <div className="py-0.5 text-[13px] text-ink-500">Presents:</div>
            {SPEAKERS.map((s) => (
              <div key={s.id} className="border-t border-ink-300 py-0.5">
                <span className="text-[13px] font-bold">{s.name}</span>
                <span className="ml-1 text-[9px] text-ink-500">({s.title.toLowerCase()})</span>
              </div>
            ))}
          </div>
          <div className="border-t border-ink-900 px-0 py-2 sm:border-t-0 sm:px-3">
            <div className="py-0.5 text-[13px] text-red-700">Doors open at {EVENT.doorsOpen}</div>
            <div className="border-t border-ink-300 py-0.5 text-[13px] text-red-700">
              Free ticket / reserve below
            </div>
            <div className="border-t border-ink-300 py-0.5 text-[13px] text-red-700">
              {EVENT.capacity} seats only
            </div>
            <a
              href="#tickets"
              className="btn btn--primary mt-3 inline-block no-underline"
            >
              get tickets
            </a>
          </div>
        </div>

        {/* band foot: lockup + marquee */}
        <div className="flex items-center justify-between gap-4 pt-3">
          <span className="font-display text-[17px] font-bold lowercase tracking-[-0.02em]">
            tedxhomestead
          </span>
          <span className="label text-right">{EVENT.venue.name}</span>
        </div>
      </div>

      {/* the screen — photography as dots, split on the seam */}
      <div className="relative z-[1] grid h-[max(14svh,110px)] grid-cols-[52.8%_1fr]">
        <div className="screen" style={{ '--dot': 'var(--color-ink-700)' } as React.CSSProperties} />
        <div className="screen screen--red border-l border-bone-100" />
      </div>
    </section>
  )
}
