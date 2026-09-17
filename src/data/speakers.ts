export interface Person {
  name: string
  title: string
  bio: string
  headshot: string
  headshotPosition?: string
}

export interface Speaker {
  id: string
  name: string
  title: string
  /** Leave empty while the talk title is still being finalized. */
  talkTitle: string
  /** Optional note shown under the talk line, e.g. a shared talk credit. */
  talkNote?: string
  bio: string
  /** Path under /public/headshots/, e.g. "/headshots/speaker-1.jpg" */
  headshot: string
  /** CSS object-position to keep the face centered in the crop (default "50% 12%") */
  headshotPosition?: string
  /** Two people sharing one talk — renders a single card with both headshots. */
  people?: Person[]
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
    title: 'Speaker & Parenting Coach',
    talkTitle: 'How to Raise Teens Who Come to You When It Matters Most',
    bio: 'Lynn Cross is a parenting coach and speaker who helps parents build the kind of trust and connection that allows their children to come to them when it matters most. After a 25-year corporate career leading teams and shaping consumer behavior for some of the world’s largest brands, Lynn turned her focus to one question: What helps teens feel safe enough to come to their parents when life gets hard? Today, through speaking, coaching, and practical parenting resources, she helps parents understand what’s happening beneath difficult moments and make small shifts in how they respond that build lasting trust and emotional safety. Her work is built around one simple but transformative belief: connection is one of the most overlooked forms of safety.',
    headshot: '/headshots/lynn-cross.jpg',
    headshotPosition: '50% 25%',
  },
  {
    id: 'bischoff',
    name: 'Dr. Shannon & Prof. Mary Encabo Bischoff',
    title: 'UNESCO Chairs \u00b7 Purdue University Fort Wayne',
    talkTitle: '',
    bio: '',
    headshot: '/headshots/shannon-bischoff.jpg',
    people: [
      {
        name: 'Dr. Shannon Bischoff',
        title: 'UNESCO Chair; Purdue University Named Professor; Chair, Communication Sciences and Disorders, PFW',
        bio: 'Dr. Shannon Bischoff is a UNESCO Chair, Purdue University Named Professor, and Chair of the Department of Communication Sciences and Disorders at PFW. He is also the President of the Endangered Language Fund and Assistant Editor of the Journal Indigenous Languages Rights and Realities. His research spans computational linguistics, linguistic anthropology, language rights, and human rights. He has secured over $2 million in funding, published widely with leading presses, and collaborates globally with Indigenous and non-dominant language communities, as well as with governments, the United Nations, and the United Nations Education, Science, and Culture Organization (UNESCO).',
        headshot: '/headshots/shannon-bischoff.jpg',
        headshotPosition: '50% 8%',
      },
      {
        name: 'Prof. Mary Encabo Bischoff',
        title: 'UNESCO Chair; Clinical Assistant Professor of Linguistics; Director, Teaching English as a New Language, PFW',
        bio: 'Prof. Mary Encabo Bischoff is a UNESCO Chair, Clinical Assistant Professor of Linguistics, and Director of the Teaching English as a New Language program at Purdue University Fort Wayne. At PFW, she not only teaches college students, but also works with local ELL teachers and international colleagues. She created and continues to direct the English Language Partners (ELP) Program, which has served over 2,000 individuals, including indigenous communities, from Myanmar, Thailand, Nepal, the Philippines, Ecuador, India, Japan, and members of our local immigrant and refugee communities. She previously served on the board of Fort Wayne Sister Cities, which led to exchanges and partnerships with universities and high schools in Myanmar and Japan. She has advised Ministers of Education and been invited to speak at the UNESCO headquarters in Paris, the United Nations in New York City, and at the 2024 UN Global Education Meeting.',
        headshot: '/headshots/mary-encabo-bischoff.jpg',
        headshotPosition: '50% 6%',
      },
    ],
  },
  {
    id: 'joshua-seluzhitskiy',
    name: 'Joshua Seluzhitskiy',
    title: 'Author, Researcher & Youth Advocate',
    talkTitle: 'Someday I Will',
    bio: 'Joshua Seluzhitskiy is a young author, researcher, and youth advocate passionate about the intersection of medicine and social impact. His work spans AI and healthcare research, youth-led initiatives, and expanding opportunities for today’s youth. Through his projects, he aims to challenge traditional ideas about age and showcase the impact young people can make before being handed a diploma.',
    headshot: '/headshots/joshua-seluzhitskiy.jpg',
    headshotPosition: '50% 0%',
  },
  {
    id: 'barry-abejide',
    name: 'Barry Abejide',
    title: '',
    talkTitle: '',
    bio: '',
    headshot: '/headshots/barry-abejide.jpg',
  },
  {
    id: 'jake-dunn',
    name: 'Jake Dunn',
    title: '',
    talkTitle: '',
    bio: '',
    headshot: '/headshots/jake-dunn.jpg',
  },
]
