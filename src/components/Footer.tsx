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
          <p className="tag">Organized by independent student volunteers.</p>
          <p className="smfooter-legal">
            This independent TEDx event is operated under license from TED. It is not sponsored
            by, endorsed by, or affiliated with Homestead High School or Southwest Allen County
            Schools.
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
            {EVENT.venue.name}, {EVENT.venue.branch}
          </a>
          <a href={EVENT.venue.mapsUrl} target="_blank" rel="noopener noreferrer">
            {EVENT.venue.address}
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
