import { currentUser } from './data'

export interface User {
  name: string
  firstName: string
  initials: string
  email: string
  dept: string
  level: string
  campus: string
  phone: string
  bio: string
  joinedAt: string
}

export type ActivityKind =
  | 'auth'
  | 'account'
  | 'service'
  | 'booking'
  | 'saved'
  | 'system'

export interface ActivityEntry {
  id: string
  kind: ActivityKind
  title: string
  detail: string
  at: string
}

export const DEMO_EMAIL = 'damilare@student.aul.edu.ng'
export const DEMO_PASSWORD = 'campus1234'

export const demoAccount = {
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
  user: {
    ...currentUser,
    email: DEMO_EMAIL,
    campus: 'Main Campus',
    phone: '+234 803 555 0142',
    bio: 'Computer Science student, product design enthusiast and campus tutor for CSC 102.',
    joinedAt: 'September 2025',
  } satisfies User,
}

export const demoSignup = {
  name: 'Damilare Adebayo',
  email: 'damilare.adebayo@student.aul.edu.ng',
  dept: 'Computer Science',
  level: '300L',
  password: DEMO_PASSWORD,
}

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString()

export function createSeedActivity(): ActivityEntry[] {
  return [
    {
      id: 'seed-1',
      kind: 'booking',
      title: 'Session confirmed with Chidera Okonkwo',
      detail: 'Calculus II crash course · Today, 3:00 PM · Cafeteria',
      at: minutesAgo(14),
    },
    {
      id: 'seed-2',
      kind: 'saved',
      title: 'Saved a portfolio review',
      detail: 'Zainab Bello · Design · Library Pod 4',
      at: minutesAgo(96),
    },
    {
      id: 'seed-3',
      kind: 'service',
      title: 'Your CSC 102 debugging clinic went live',
      detail: 'Offer published to verified Anchor students',
      at: minutesAgo(410),
    },
    {
      id: 'seed-4',
      kind: 'auth',
      title: 'Signed in from a new device',
      detail: 'Chrome on macOS · Main Campus network',
      at: minutesAgo(1_520),
    },
    {
      id: 'seed-5',
      kind: 'account',
      title: 'Student verification approved',
      detail: 'Matric number matched the Anchor University registry',
      at: minutesAgo(4_360),
    },
  ]
}

export const upcomingSessions = [
  {
    id: 'up-1',
    when: 'Today · 3:00 PM',
    title: 'Calculus II with Chidera',
    meta: 'Cafeteria, Main Campus · Confirmed',
    tint: 'plum' as const,
  },
  {
    id: 'up-2',
    when: 'Fri · 7:00 PM',
    title: 'CV review with Favour',
    meta: 'Google Meet · Pending',
    tint: 'sky' as const,
  },
  {
    id: 'up-3',
    when: 'Sat · 9:00 AM',
    title: 'Statistics prep with Tobi',
    meta: 'Lecture Hall B · Confirmed',
    tint: 'sage' as const,
  },
]

export function initialsFromName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function formatActivityTime(iso: string) {
  const then = new Date(iso).getTime()
  const diff = Math.max(0, Date.now() - then)
  const minutes = Math.floor(diff / 60_000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`

  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso))
}

export function activityDayLabel(iso: string) {
  const date = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: date.getFullYear() === today.getFullYear() ? undefined : 'numeric',
  }).format(date)
}
