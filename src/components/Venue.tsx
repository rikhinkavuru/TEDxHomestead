import Reveal from './Reveal'
import { EVENT } from '../data/event'

const DETAILS = [
  { label: 'Date', value: EVENT.date },
  { label: 'Time', value: EVENT.time },
  { label: 'Doors open', value: EVENT.doorsOpen },
  { label: 'Capacity', value: `${EVENT.capacity} attendees` },
]

export default function Venue() {
  return (
    <section id="venue" className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-2 md:py-32">
        <Reveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-ted">
            Getting here
          </p>
          <h2 className="display text-4xl font-black sm:text-5xl">Venue</h2>

          <p className="mt-6 text-2xl font-bold">{EVENT.venue.name}</p>
          <p className="mt-1 text-lg text-ink/70">{EVENT.venue.address}</p>
          {EVENT.venue.room && <p className="mt-1 text-lg text-ink/70">{EVENT.venue.room}</p>}

          <a
            href={EVENT.venue.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block rounded-full border border-ink/20 px-6 py-3 font-semibold transition-colors hover:border-ted hover:text-ted"
          >
            Open in Google Maps ↗
          </a>
        </Reveal>

        <Reveal delay={0.12}>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink/10">
            {DETAILS.map((d) => (
              <div key={d.label} className="bg-paper p-6">
                <dt className="text-xs font-semibold uppercase tracking-wider text-ink/40">
                  {d.label}
                </dt>
                <dd className="mt-1 text-lg font-bold">{d.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-ink/50">
            Free parking is available in the school lot off Homestead Road.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
