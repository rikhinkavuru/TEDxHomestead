export interface Speaker {
  id: string
  name: string
  title: string
  talkTitle: string
  bio: string
  /** Path under /public/headshots/, e.g. "/headshots/speaker-1.jpg" */
  headshot: string
  /** CSS object-position to keep the face centered in the crop (default "50% 12%") */
  headshotPosition?: string
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
    id: 'lynn-cross',
    name: 'Lynn Cross',
    title: 'Speaker, Coach & Founder, Illumalight',
    talkTitle: 'How to Raise Teens Who Come to You When It Matters Most',
    bio: 'Lynn Cross is a speaker, coach, and founder of Illumalight, where she helps parents build the kind of trust and connection that allows children to come to them when it matters most. After a 25-year corporate career leading teams and shaping consumer behavior for some of the world’s largest brands, Lynn turned her focus to one question: What helps teens feel safe enough to come to their parents when life gets hard? Today, through keynote speaking, coaching, courses, and practical family connection tools, she helps parents make the small shifts that build lasting trust and emotional safety. Her work is built around one simple but transformative belief: connection is one of the most overlooked forms of safety.',
    headshot: '/headshots/lynn-cross.jpg',
    headshotPosition: '50% 50%',
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
