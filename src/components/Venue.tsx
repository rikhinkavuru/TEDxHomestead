import Reveal from './Reveal'
import { EVENT } from '../data/event'

export default function Venue() {
  return (
    <section id="venue" className="border-t border-ink-900">
      <div className="mx-auto max-w-[1240px] px-[6%] py-24">
        <Reveal>
          <p className="eyebrow mb-4">
            <span className="n">—</span> venue
          </p>
          <h2 className="display mb-12">getting there</h2>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 border-b border-t border-ink-900 sm:grid-cols-[1fr_1.6fr_1.4fr]">
            <div className="py-3 pr-4 sm:border-r sm:border-ink-900">
              <p className="text-[13px] font-bold leading-normal">
                {EVENT.venue.name}
                <br />
                4310 Homestead Rd
                <br />
                Fort Wayne, IN 46814
              </p>
            </div>
            <div className="border-t border-ink-900 py-3 sm:border-t-0 sm:border-r sm:border-ink-900 sm:px-4">
              <div className="py-0.5 text-[13px]">Free parking in the school lot</div>
              <div className="border-t border-ink-300 py-0.5 text-[13px]">
                Enter from Homestead Road
              </div>
              <div className="border-t border-ink-300 py-0.5 text-[13px]">
                <a
                  className="sys-link"
                  href={EVENT.venue.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  open in google maps
                </a>
              </div>
            </div>
            <div className="border-t border-ink-900 py-3 sm:border-t-0 sm:px-4">
              <div className="py-0.5 text-[13px] text-red-700">Doors open at {EVENT.doorsOpen}</div>
              <div className="border-t border-ink-300 py-0.5 text-[13px] text-red-700">
                Talks {EVENT.timeShort}
              </div>
              <div className="border-t border-ink-300 py-0.5 text-[13px] text-red-700">
                Free / {EVENT.capacity} seats
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
