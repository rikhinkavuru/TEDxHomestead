const PHOTO = '/hero/hero-2.jpg'

/**
 * Static black-and-white photo behind the hero, under a cream scrim so the
 * light hero text stays easily readable. Deliberately still: the rotating
 * word in the tagline is the hero's only motion, so the two don't compete.
 */
export function HeroBackground() {
  return (
    <div className="smhero-bg" aria-hidden="true">
      <div className="smhero-photos">
        <div className="smhero-photo" style={{ backgroundImage: `url(${PHOTO})` }} />
      </div>
      <div className="smhero-scrim" />
    </div>
  )
}
