export interface Speaker {
  id: string
  name: string
  title: string
  talkTitle: string
  bio: string
  /** Path under /public/headshots/, e.g. "/headshots/speaker-1.jpg" */
  headshot: string
}

/**
 * FILL IN: replace each placeholder with the real speaker's info,
 * and drop their headshot into public/headshots/ using the same filename.
 * The layout adapts automatically — no other changes needed.
 */
export const SPEAKERS: Speaker[] = [
  {
    id: 'speaker-1',
    name: 'Speaker Name',
    title: 'Title / Role',
    talkTitle: 'Talk title goes here',
    bio: 'A short bio for this speaker — who they are, what they do, and why their idea matters.',
    headshot: '/headshots/speaker-1.jpg',
  },
  {
    id: 'speaker-2',
    name: 'Speaker Name',
    title: 'Title / Role',
    talkTitle: 'Talk title goes here',
    bio: 'A short bio for this speaker — who they are, what they do, and why their idea matters.',
    headshot: '/headshots/speaker-2.jpg',
  },
  {
    id: 'speaker-3',
    name: 'Speaker Name',
    title: 'Title / Role',
    talkTitle: 'Talk title goes here',
    bio: 'A short bio for this speaker — who they are, what they do, and why their idea matters.',
    headshot: '/headshots/speaker-3.jpg',
  },
  {
    id: 'speaker-4',
    name: 'Speaker Name',
    title: 'Title / Role',
    talkTitle: 'Talk title goes here',
    bio: 'A short bio for this speaker — who they are, what they do, and why their idea matters.',
    headshot: '/headshots/speaker-4.jpg',
  },
  {
    id: 'speaker-5',
    name: 'Speaker Name',
    title: 'Title / Role',
    talkTitle: 'Talk title goes here',
    bio: 'A short bio for this speaker — who they are, what they do, and why their idea matters.',
    headshot: '/headshots/speaker-5.jpg',
  },
  {
    id: 'speaker-6',
    name: 'Speaker Name',
    title: 'Title / Role',
    talkTitle: 'Talk title goes here',
    bio: 'A short bio for this speaker — who they are, what they do, and why their idea matters.',
    headshot: '/headshots/speaker-6.jpg',
  },
]
