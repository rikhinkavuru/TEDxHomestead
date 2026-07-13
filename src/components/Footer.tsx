import { EVENT } from '../data/event'
import { CopyEmail } from './chrome'

const LINKS: Array<{ label: string; id: string }> = [
  { label: 'About', id: 'event' },
  { label: 'Speakers', id: 'speakers' },
  { label: 'Tickets', id: 'tickets' },
]

export function Footer({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <footer className="smfooter">
      <div className="smfooter-inner">
        <div>
          <h4>Ideas worth spreading, from our own backyard.</h4>
          <p className="tag">
            This independent TEDx event is operated under license from TED.
            Organized and run by students at {EVENT.venue.name}.
          </p>
        </div>
        <div className="smfooter-col">
          <div className="h">Event</div>
          {LINKS.map((l) => (
            <button key={l.id} onClick={() => onNavigate(l.id)}>{l.label}</button>
          ))}
        </div>
        <div className="smfooter-col">
          <div className="h">Find us</div>
          <a href={EVENT.venue.mapsUrl} target="_blank" rel="noopener noreferrer">
            {EVENT.venue.name}
          </a>
          <a href={EVENT.venue.mapsUrl} target="_blank" rel="noopener noreferrer">
            4310 Homestead Rd, Fort Wayne, IN
          </a>
          {EVENT.contactEmail && (
            <p className="smfooter-support">
              For support, contact <CopyEmail email={EVENT.contactEmail} />
            </p>
          )}
          {EVENT.socials.instagram && (
            <a
              href={`https://instagram.com/${EVENT.socials.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram / @{EVENT.socials.instagram}
            </a>
          )}
        </div>
      </div>
      <div className="smfooter-brand" aria-hidden="true">
        <div className="smfooter-ghost">tedxhomestead.</div>
      </div>
    </footer>
  )
}
