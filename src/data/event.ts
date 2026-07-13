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
    'One evening. Six speakers from our community. A hundred seats. TEDxHomestead brings the TED stage to Fort Wayne — real ideas, told live, worth carrying home.',
  date: 'Friday, October 2, 2026',
  dateShort: 'fri, oct 2 2026',
  dateLine: 'Fri, Oct 2',
  dateISO: '2026-10-02',
  // Date free tickets opened — shown only in the hero announcement pill.
  ticketsOpenLabel: 'Jul 30',
  time: '5:00 PM – 8:00 PM',
  timeShort: '5pm — 8pm',
  doorsOpen: '4:30PM',
  format: 'Curated short talks, performances, and conversations.',
  capacity: 100,
  // THEME — placeholder. Replace once the final theme is chosen.
  theme: {
    name: 'Small Steps, Big Impact',
    // The part of the name rendered in red (leave '' for none).
    accent: 'Big Impact',
    blurb:
      'Change rarely happens all at once. Our theme celebrates the small, persistent actions that unlock outsized outcomes — in our schools, neighborhoods, and the wider world. Speakers will share ideas and stories that show how momentum starts with a single step.',
  },
  venue: {
    name: 'Homestead High School',
    address: '4310 Homestead Rd, Fort Wayne, IN 46814',
    room: '', // fill in: e.g. "Main Theater"
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Homestead+High+School+4310+Homestead+Rd+Fort+Wayne+IN+46814',
  },
  contactEmail: 'rikhinkavuru@gmail.com',
  socials: {
    instagram: '', // fill in
  },
} as const
