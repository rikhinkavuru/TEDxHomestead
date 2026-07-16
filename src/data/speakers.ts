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
    id: 'barry-labov',
    name: 'Barry LaBov',
    title: 'Founder, LABOV Marketing, Consulting and Training',
    talkTitle: 'The Power of Differentiation',
    bio: 'Barry LaBov is a two-time Ernst & Young Entrepreneur of the Year, a recognized author, keynote speaker, brand strategist, and founder of LABOV Marketing, Consulting, and Training. His agency specializes in helping brands and individuals discover and celebrate their differentiation. LABOV’s clientele includes Harley-Davidson, The Macallan Scotch whisky, Audi, and other leading brands worldwide. His book, “The Power of Differentiation: Win Hearts, Minds, and Market Share,” was the #1 New Release in Marketing on Amazon. Barry has guested on nearly 100 podcasts and is co-host of Difference Talks, which has featured top-selling authors, leading CEOs, and performers in sports and music. Barry keynotes nationwide and serves as a resource for universities to help inspire our future generation of leaders.',
    headshot: '/headshots/barry-labov.jpg',
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
