import { useState } from 'react'
import Reveal from './Reveal'
import { SPEAKERS, type Speaker } from '../data/speakers'

/** Photography enters as dots. Until a headshot exists, the screen stands in. */
function Headshot({ speaker }: { speaker: Speaker }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <div className="screen aspect-[4/5] w-full border border-ink-900" aria-hidden />
  }

  return (
    <div className="halftone aspect-[4/5] w-full border border-ink-900">
      <img src={speaker.headshot} alt={speaker.name} loading="lazy" onError={() => setFailed(true)} />
    </div>
  )
}

export default function Speakers() {
  return (
    <section id="speakers" className="border-t border-ink-900 bg-bone-100">
      <div className="mx-auto max-w-[1240px] px-[6%] py-24">
        <Reveal>
          <p className="eyebrow mb-4">
            <span className="n">—</span> speakers
          </p>
          <h2 className="display mb-12">six talks, one evening</h2>
        </Reveal>

        <div className="border-b border-t border-ink-900">
          {SPEAKERS.map((s, i) => (
            <Reveal key={s.id}>
              <article
                className={`grid grid-cols-[64px_1fr] gap-x-5 gap-y-4 py-6 sm:grid-cols-[40px_128px_1fr] md:grid-cols-[40px_150px_1fr_1.4fr] ${
                  i > 0 ? 'border-t border-ink-300' : ''
                }`}
              >
                <span className="label pt-1 text-ink-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="w-full max-w-[150px]">
                  <Headshot speaker={s} />
                </div>
                <div>
                  <h3 className="font-display text-[24px] font-bold leading-none tracking-[-0.02em]">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-[11px] leading-[1.3] text-ink-500">{s.title}</p>
                </div>
                <div className="col-span-2 sm:col-start-3 md:col-span-1 md:col-start-4">
                  <p className="text-[13px] font-bold leading-[1.35]">“{s.talkTitle}”</p>
                  <p className="mt-2 max-w-[52ch] text-[13px] leading-normal text-ink-700">
                    {s.bio}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-3 text-[11px] leading-[1.4] text-ink-500">
          Lineup in running order. Talk titles to be announced.
        </p>
      </div>
    </section>
  )
}
