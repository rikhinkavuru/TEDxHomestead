import { EVENT } from '../data/event'

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink-900">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-[6%] py-10">
        <div>
          <p className="font-display text-[17px] font-bold lowercase tracking-[-0.02em]">
            tedxhomestead
          </p>
          <p className="mt-1 max-w-[52ch] text-[11px] leading-[1.4] text-ink-500">
            This independent TEDx event is operated under license from TED.
            {EVENT.contactEmail && (
              <>
                {' '}
                <a className="sys-link" href={`mailto:${EVENT.contactEmail}`}>
                  {EVENT.contactEmail}
                </a>
              </>
            )}
          </p>
        </div>
        <span className="label">{EVENT.venue.name}</span>
      </div>
    </footer>
  )
}
