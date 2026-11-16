import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  createSeedActivity,
  demoAccount,
  initialsFromName,
} from './demo'
import type { ActivityEntry, ActivityKind, User } from './demo'

const SESSION_KEY = 'campus-folio.session.v1'
const activityKey = (email: string) => `campus-folio.activity.v1:${email}`

interface AuthResult {
  ok: boolean
  error?: string
}

interface SignupInput {
  name: string
  email: string
  dept: string
  level: string
  password: string
}

interface AuthContextValue {
  user: User | null
  activities: ActivityEntry[]
  signIn: (email: string, password: string) => AuthResult
  signUp: (input: SignupInput) => AuthResult
  signOut: () => void
  updateProfile: (patch: Partial<User>) => void
  logActivity: (kind: ActivityKind, title: string, detail: string) => void
  resetDemoData: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): User | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as User
    return parsed?.email ? parsed : null
  } catch {
    return null
  }
}

function readActivity(email: string): ActivityEntry[] {
  try {
    const raw = window.localStorage.getItem(activityKey(email))
    if (!raw) return []
    const parsed = JSON.parse(raw) as ActivityEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function storeSession(user: User) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

function storeActivity(email: string, activities: ActivityEntry[]) {
  window.localStorage.setItem(activityKey(email), JSON.stringify(activities))
}

function makeEntry(
  kind: ActivityKind,
  title: string,
  detail: string,
): ActivityEntry {
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind,
    title,
    detail,
    at: new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readSession)
  const [activities, setActivities] = useState<ActivityEntry[]>(() => {
    const session = readSession()
    if (!session) return []
    const stored = readActivity(session.email)
    return stored.length > 0 ? stored : createSeedActivity()
  })

  useEffect(() => {
    if (!user) return
    storeActivity(user.email, activities)
  }, [activities, user])

  const signIn = useCallback((email: string, password: string): AuthResult => {
    const normalised = email.trim().toLowerCase()

    if (!normalised || !password) {
      return { ok: false, error: 'Enter your email and password to continue.' }
    }

    if (normalised !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      return {
        ok: false,
        error:
          'Those details do not match the demo account. Use the demo credentials below.',
      }
    }

    const nextUser = demoAccount.user
    storeSession(nextUser)
    setUser(nextUser)

    const stored = readActivity(nextUser.email)
    const nextActivities =
      stored.length > 0
        ? [
            makeEntry(
              'auth',
              'Signed in',
              'Demo session started on the Campus Folio web app',
            ),
            ...stored,
          ]
        : [
            makeEntry(
              'auth',
              'Signed in',
              'Demo session started on the Campus Folio web app',
            ),
            ...createSeedActivity(),
          ]

    setActivities(nextActivities)
    return { ok: true }
  }, [])

  const signUp = useCallback((input: SignupInput): AuthResult => {
    const email = input.email.trim().toLowerCase()
    const name = input.name.trim()

    if (!name || !email || !input.dept.trim()) {
      return { ok: false, error: 'Fill in your name, email and department.' }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: 'Enter a valid email address.' }
    }

    if (email === DEMO_EMAIL) {
      return {
        ok: false,
        error: 'That email already has an account. Log in with the demo password instead.',
      }
    }

    if (input.password.length < 8) {
      return { ok: false, error: 'Use at least 8 characters for your password.' }
    }

    const [firstName = name] = name.split(/\s+/)
    const nextUser: User = {
      name,
      firstName,
      initials: initialsFromName(name),
      email,
      dept: input.dept.trim(),
      level: input.level,
      campus: 'Main Campus',
      phone: '',
      bio: 'New to Campus Folio — building a profile on Anchor campus.',
      joinedAt: new Intl.DateTimeFormat('en-GB', {
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    }

    storeSession(nextUser)
    setUser(nextUser)
    setActivities([
      makeEntry(
        'account',
        'Welcome to Campus Folio',
        'Account created and student profile started',
      ),
      ...createSeedActivity(),
    ])

    return { ok: true }
  }, [])

  const signOut = useCallback(() => {
    if (user) {
      const next = [
        makeEntry('auth', 'Signed out', 'You ended the demo session'),
        ...activities,
      ].slice(0, 40)
      storeActivity(user.email, next)
      window.localStorage.removeItem(SESSION_KEY)
    }
    setUser(null)
    setActivities([])
  }, [activities, user])

  const updateProfile = useCallback(
    (patch: Partial<User>) => {
      if (!user) return

      const next = { ...user, ...patch }
      if (patch.name) {
        next.firstName = patch.name.trim().split(/\s+/)[0] ?? user.firstName
        next.initials = initialsFromName(patch.name)
      }

      storeSession(next)
      setUser(next)
      setActivities((current) => [
        makeEntry(
          'account',
          'Profile details updated',
          'Your student profile changes are now visible on campus',
        ),
        ...current,
      ])
    },
    [user],
  )

  const logActivity = useCallback(
    (kind: ActivityKind, title: string, detail: string) => {
      setActivities((current) => [makeEntry(kind, title, detail), ...current])
    },
    [],
  )

  const resetDemoData = useCallback(() => {
    if (user) {
      window.localStorage.removeItem(activityKey(user.email))
    }
    window.localStorage.removeItem(SESSION_KEY)
    setUser(null)
    setActivities([])
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      activities,
      signIn,
      signUp,
      signOut,
      updateProfile,
      logActivity,
      resetDemoData,
    }),
    [
      activities,
      logActivity,
      resetDemoData,
      signIn,
      signOut,
      signUp,
      updateProfile,
      user,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}
