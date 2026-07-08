import Reveal from './Reveal'

export default function About() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-[1fr_2fr] md:py-32">
        <Reveal>
          <h2 className="display text-3xl font-black sm:text-4xl">
            What is <span className="text-ted">TEDx</span>?
          </h2>
        </Reveal>

        <div className="space-y-6 text-lg leading-relaxed text-ink/80">
          <Reveal delay={0.1}>
            <p>
              In the spirit of discovering and spreading ideas, TED has created a program called
              TEDx. TEDx is a program of local, self-organized events that bring people together to
              share a TED-like experience. Our event is called TEDxHomesteadHighSchool, where{' '}
              <span className="font-semibold text-ink">x = independently organized TED event</span>.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p>
              At TEDxHomesteadHighSchool, live speakers will spark deep discussion and connection in
              a small group — six talks, one evening, one hundred seats. The TED Conference provides
              general guidance for the TEDx program, but individual TEDx events, including ours, are
              self-organized.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
