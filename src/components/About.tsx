import { Section, Reveal, TedxLogo } from './chrome'
import { EVENT } from '../data/event'

/** Split the theme name so the accent portion renders in red. */
function ThemeName() {
  const { name, accent } = EVENT.theme
  if (accent && name.includes(accent)) {
    const [before] = name.split(accent)
    return (
      <>
        {before}
        <span className="g">{accent}</span>
      </>
    )
  }
  return <>{name}</>
}

export function About() {
  return (
    <Section id="event">
      <div className="smabout">
        {/* left column — laid straight on the background */}
        <div className="smabout-col">
          <Reveal>
            <h2 className="smabout-h">What is TEDx?</h2>
            <p className="smabout-p">
              TEDx events are locally organized gatherings where live talks and performances combine
              to spark deep discussion and connection. While inspired by the spirit of TED, TEDx
              events are planned and coordinated independently by communities around the world.
            </p>
            <p className="smabout-p smabout-p--muted">
              This independent TEDx event is operated under license from TED.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="smabout-theme">
              <span className="smabout-label">Theme</span>
              <h3 className="smabout-themetitle"><ThemeName /></h3>
              <p className="smabout-p">{EVENT.theme.blurb}</p>
            </div>
          </Reveal>
        </div>

        {/* right column — single event card, logo on top, full height */}
        <Reveal delay={0.05} className="smabout-cardwrap">
          <div className="smabout-card">
            <div className="smabout-card-logo">
              <TedxLogo className="smabout-card-logoimg" />
            </div>
            <div className="smabout-card-body">
              <span className="smabout-label">Event</span>
              <p className="smabout-when">{EVENT.date}, {EVENT.time}</p>
              <p className="smabout-where">
                {EVENT.venue.name} · Fort Wayne, Indiana
                <br />
                <span className="smabout-addr">4310 Homestead Rd, Fort Wayne, IN 46814</span>
              </p>
              <a className="smabout-dir" href={EVENT.venue.mapsUrl} target="_blank" rel="noreferrer">
                Get directions →
              </a>
              <hr className="smabout-rule" />
              <span className="smabout-label">Format</span>
              <p className="smabout-format">{EVENT.format}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
