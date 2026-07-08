import Reveal from './Reveal'

export default function About() {
  return (
    <section id="about" className="border-t border-ink-900">
      <div className="mx-auto max-w-[1240px] px-[6%] py-24">
        <Reveal>
          <p className="eyebrow mb-4">
            <span className="n">—</span> what is tedx
          </p>
          <h2 className="display mb-6">
            ideas worth
            <br />
            spreading, locally
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <p className="max-w-[62ch] text-[18px] leading-[1.45] text-ink-700">
              In the spirit of discovering and spreading ideas, TED has created a program called
              TEDx. TEDx is a program of local, self-organized events that bring people together to
              share a TED-like experience. Our event is called TEDxHomesteadHighSchool, where{' '}
              <b className="text-ink-900">x = independently organized TED event</b>.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="max-w-[62ch] text-[18px] leading-[1.45] text-ink-700">
              Six live talks, one evening, one hundred seats. The TED Conference provides general
              guidance for the TEDx program, but individual TEDx events, including ours, are
              self-organized.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
