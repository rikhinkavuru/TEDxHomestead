/**
 * Single source of truth for event details.
 * Update here and every section of the site stays in sync.
 */
export const EVENT = {
  name: 'TEDxHomesteadHighSchool',
  shortName: 'TEDxHomestead',
  theme: '', // fill in: event theme, e.g. "Uncharted"
  date: 'Friday, October 2, 2026',
  dateISO: '2026-10-02',
  time: '5:00 PM – 8:00 PM',
  doorsOpen: '4:30 PM',
  capacity: 100,
  venue: {
    name: 'Homestead High School',
    address: '4310 Homestead Rd, Fort Wayne, IN 46814',
    room: '', // fill in: e.g. "Main Theater"
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Homestead+High+School+4310+Homestead+Rd+Fort+Wayne+IN+46814',
  },
  contactEmail: '', // fill in: organizer contact email
  socials: {
    instagram: '', // fill in
  },
} as const
