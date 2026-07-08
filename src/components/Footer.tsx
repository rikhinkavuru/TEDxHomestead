import { EVENT } from '../data/event'

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black tracking-tight">
            <span className="text-ted">TEDx</span>Homestead
          </p>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-ink/50">
            This independent TEDx event is operated under license from TED.
          </p>
        </div>
        <div className="text-sm text-ink/60">
          <p>{EVENT.venue.name}</p>
          <p>{EVENT.venue.address}</p>
          {EVENT.contactEmail && (
            <a href={`mailto:${EVENT.contactEmail}`} className="text-ted hover:underline">
              {EVENT.contactEmail}
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
