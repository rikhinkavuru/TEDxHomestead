/**
 * Single source of truth for event details.
 * Update here and every section of the site stays in sync.
 */
export const EVENT = {
  name: 'TEDxHomesteadHighSchool',
  shortName: 'TEDxHomestead',
  // The headline message on the site. Edit freely.
  tagline: 'Ideas worth spreading,\nfrom our own backyard.',
  blurb:
    'One evening. Seven speakers from our community. A hundred seats. TEDxHomestead brings the TED stage to Fort Wayne — real ideas, told live, worth carrying home.',
  date: 'Tuesday, October 27, 2026',
  dateShort: 'tue, oct 27 2026',
  dateLine: 'Tue, Oct 27',
  dateISO: '2026-10-27',
  // Date free tickets opened — shown only in the hero announcement pill.
  ticketsOpenLabel: 'Jul 30',
  time: '6:00 PM – 8:00 PM',
  timeShort: '6pm — 8pm',
  doorsOpen: '5:30 PM',
  format: 'Curated short talks, performances, and conversations.',
  capacity: 100,
  // THEME — placeholder. Replace once the final theme is chosen.
  theme: {
    name: 'Bold Ideas, Lasting Change',
    // The part of the name rendered in red (leave '' for none).
    accent: 'Lasting Change',
    blurb:
      'The ideas that reshape a life rarely shout — they take root and hold. Our speakers explore what it takes to stand apart, protect what matters, build real trust, and turn conviction into impact that outlasts the moment. From differentiation and financial know-how to preserving endangered cultures and strengthening the bonds closest to home, these are ideas built to endure.',
  },
  venue: {
    name: 'Allen County Public Library',
    branch: 'Main Branch',
    address: '900 Library Plaza, Fort Wayne, IN 46802',
    room: 'Theater',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Allen+County+Public+Library+Main+Branch+900+Library+Plaza+Fort+Wayne+IN+46802',
  },
  contactEmail: 'rikhinkavuru@gmail.com',
  socials: {
    instagram: '', // fill in
  },
} as const
