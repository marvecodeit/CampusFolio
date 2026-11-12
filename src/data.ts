import type { IconName } from './icons'

export type Category =
  | 'All'
  | 'Academics'
  | 'Design'
  | 'Tech'
  | 'Writing'
  | 'Errands'
  | 'Music'

export type ServiceMode = 'In person' | 'Online' | 'Hybrid'

export interface Provider {
  name: string
  initials: string
  dept: string
  level: string
  rating: number
  reviews: number
  verified: boolean
}

export interface Service {
  id: string
  title: string
  category: Exclude<Category, 'All'>
  provider: Provider
  price: number
  unit: string
  location: string
  time: string
  duration: string
  mode: ServiceMode
  tags: string[]
  blurb: string
  includes: string[]
  tint: string
}

export interface CategoryOption {
  name: Category
  icon: IconName
}

export const categories: CategoryOption[] = [
  { name: 'All', icon: 'grid' },
  { name: 'Academics', icon: 'book' },
  { name: 'Design', icon: 'palette' },
  { name: 'Tech', icon: 'code' },
  { name: 'Writing', icon: 'pen' },
  { name: 'Errands', icon: 'package' },
  { name: 'Music', icon: 'music' },
]

export const currentUser = {
  name: 'Damilare Adebayo',
  firstName: 'Damilare',
  initials: 'DA',
  dept: 'Computer Science',
  level: '300L',
}

export const services: Service[] = [
  {
    id: 'calculus-crash',
    title: "Calculus II crash course before Friday's test",
    category: 'Academics',
    provider: {
      name: 'Chidera Okonkwo',
      initials: 'CO',
      dept: 'Mathematics',
      level: '300L',
      rating: 4.9,
      reviews: 28,
      verified: true,
    },
    price: 3000,
    unit: 'session',
    location: 'Cafeteria, Main Campus',
    time: 'Today · 3:00 PM',
    duration: '90 min',
    mode: 'In person',
    tags: ['MAT 122', 'Calculus', 'Integration', 'Past questions'],
    blurb:
      "We'll work through the exact question styles from Dr. Bello's past papers, then run a timed mock so you walk into Friday calm. Bring your notebook and a red pen.",
    includes: [
      'Past-question walkthrough',
      'Timed mock paper',
      'Formula sheet you can keep',
    ],
    tint: 'plum',
  },
  {
    id: 'figma-review',
    title: 'Portfolio review for your design submission',
    category: 'Design',
    provider: {
      name: 'Zainab Bello',
      initials: 'ZB',
      dept: 'Visual Communication',
      level: '400L',
      rating: 5,
      reviews: 17,
      verified: true,
    },
    price: 5000,
    unit: 'review',
    location: 'Library Pod 4',
    time: 'Thu · 11:00 AM',
    duration: '45 min',
    mode: 'In person',
    tags: ['Figma', 'Portfolio', 'Layout', 'Critique'],
    blurb:
      "A focused critique of three projects from your portfolio: layout, type, hierarchy and how the story reads. You leave with a marked-up file and a shortlist of fixes.",
    includes: [
      'Three-project critique',
      'Annotated Figma file',
      'Written next steps',
    ],
    tint: 'sky',
  },
  {
    id: 'python-rescue',
    title: 'Python assignment rescue, debugging included',
    category: 'Tech',
    provider: {
      name: 'Emeka Nwosu',
      initials: 'EN',
      dept: 'Computer Science',
      level: '200L',
      rating: 4.8,
      reviews: 34,
      verified: true,
    },
    price: 2500,
    unit: 'hour',
    location: 'Cyber Café, Block C',
    time: 'Today · 5:30 PM',
    duration: '60 min',
    mode: 'In person',
    tags: ['Python', 'Debugging', 'CSC 102', 'Loops'],
    blurb:
      'Stuck on a lab that will not run? We debug it together line by line, then rewrite the messy parts so you can explain every line in your defence.',
    includes: [
      'Live debugging session',
      'Clean, commented code',
      'A short walkthrough you keep',
    ],
    tint: 'lilac',
  },
  {
    id: 'cv-rewrite',
    title: 'CV and cover letter rewrite for internship season',
    category: 'Writing',
    provider: {
      name: 'Favour Adeyemi',
      initials: 'FA',
      dept: 'English & Literature',
      level: '300L',
      rating: 4.9,
      reviews: 21,
      verified: true,
    },
    price: 4000,
    unit: 'draft',
    location: 'Online · Google Meet',
    time: 'Fri · 7:00 PM',
    duration: '60 min',
    mode: 'Online',
    tags: ['CV', 'Careers', 'Internship', 'Cover letter'],
    blurb:
      'A cleaner one-page CV built around the roles you actually want, plus a cover letter template that does not sound like everyone else in your class.',
    includes: [
      'One-page CV rebuild',
      'Tailored cover letter',
      '30-day edit support',
    ],
    tint: 'sage',
  },
  {
    id: 'stats-prep',
    title: 'Statistics exam prep, past questions walkthrough',
    category: 'Academics',
    provider: {
      name: 'Tobi Ogunleye',
      initials: 'TO',
      dept: 'Economics',
      level: '400L',
      rating: 4.7,
      reviews: 19,
      verified: true,
    },
    price: 3500,
    unit: 'session',
    location: 'Lecture Hall B',
    time: 'Sat · 9:00 AM',
    duration: '2 hrs',
    mode: 'In person',
    tags: ['STA 202', 'Statistics', 'Regression', 'Exam prep'],
    blurb:
      'Two hours of regression, distribution questions and the shortcuts that save time in the exam hall. Small group, so bring a friend if you like.',
    includes: [
      'Six-year past-question drill',
      'Worked answer booklet',
      'Group concept review',
    ],
    tint: 'sky',
  },
  {
    id: 'poster-design',
    title: 'Event poster design, print-ready in 24 hours',
    category: 'Design',
    provider: {
      name: 'David Ilesanmi',
      initials: 'DI',
      dept: 'Architecture',
      level: '200L',
      rating: 5,
      reviews: 12,
      verified: true,
    },
    price: 6000,
    unit: 'project',
    location: 'Design Studio, Block D',
    time: 'Fri · 2:00 PM',
    duration: '1 day',
    mode: 'Hybrid',
    tags: ['Poster', 'Branding', 'Canva', 'Print'],
    blurb:
      'For chapel events, society nights and hall parties. One concept, two rounds of edits and a print-ready file sized for A3 and Instagram.',
    includes: [
      'One original concept',
      'Two revision rounds',
      'A3 and social exports',
    ],
    tint: 'plum',
  },
  {
    id: 'laundry-run',
    title: 'Hostel laundry pickup and drop-off',
    category: 'Errands',
    provider: {
      name: 'Blessing Eze',
      initials: 'BE',
      dept: 'Microbiology',
      level: '100L',
      rating: 4.8,
      reviews: 41,
      verified: true,
    },
    price: 1500,
    unit: 'load',
    location: 'Female Hostel Gate',
    time: 'Daily · 7:00 AM',
    duration: '4 hrs',
    mode: 'In person',
    tags: ['Laundry', 'Hostel', 'Errands', 'Same day'],
    blurb:
      'Leave your bag at the hostel gate before 7 AM and get it back folded by lunch. Washing, drying and folding are all covered in the price.',
    includes: [
      'Pickup at your hostel',
      'Wash, dry and fold',
      'Same-day return',
    ],
    tint: 'sage',
  },
  {
    id: 'bass-lessons',
    title: 'Bass guitar lessons for chapel team beginners',
    category: 'Music',
    provider: {
      name: 'Samuel Adekunle',
      initials: 'SA',
      dept: 'Music',
      level: '300L',
      rating: 4.9,
      reviews: 15,
      verified: true,
    },
    price: 3500,
    unit: 'lesson',
    location: 'Chapel Annex',
    time: 'Sun · 4:00 PM',
    duration: '45 min',
    mode: 'In person',
    tags: ['Bass', 'Chapel', 'Beginner', 'Worship'],
    blurb:
      'Start with the four-note patterns behind most worship sets, then learn to lock in with a drummer. Instruments are available if you do not own one yet.',
    includes: [
      'One-to-one lesson',
      'Practice plan for the week',
      'Instrument available on request',
    ],
    tint: 'lilac',
  },
]

export const spotlightId = 'calculus-crash'

export function formatNaira(value: number) {
  return `₦${value.toLocaleString('en-NG')}`
}
