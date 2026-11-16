import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './auth'
import { services as seedServices } from './data'
import type { Category, Service } from './data'
import { useToast } from './toast'

export interface OfferInput {
  title: string
  category: Exclude<Category, 'All'>
  price: number
  location: string
  time: string
  blurb: string
}

interface MarketplaceContextValue {
  services: Service[]
  offers: Service[]
  savedIds: Set<string>
  isSaved: (id: string) => boolean
  toggleSave: (id: string) => void
  publishOffer: (input: OfferInput) => void
  requestSession: (service: Service) => void
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null)

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const { user, logActivity } = useAuth()
  const { showToast } = useToast()
  const [offers, setOffers] = useState<Service[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(
    () => new Set(['figma-review']),
  )

  const services = useMemo(() => [...offers, ...seedServices], [offers])

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds])

  const toggleSave = useCallback(
    (id: string) => {
      const service = services.find((item) => item.id === id)
      if (!service) return

      const saving = !savedIds.has(id)

      setSavedIds((current) => {
        const next = new Set(current)
        if (saving) {
          next.add(id)
        } else {
          next.delete(id)
        }
        return next
      })

      showToast(
        saving
          ? 'Saved to your shortlist.'
          : 'Removed from your saved services.',
      )
      logActivity(
        'saved',
        saving ? 'Saved a service' : 'Removed a saved service',
        `${service.title} · ${service.provider.name}`,
      )
    },
    [logActivity, savedIds, services, showToast],
  )

  const publishOffer = useCallback(
    (input: OfferInput) => {
      if (!user) return

      const newService: Service = {
        id: `own-${Date.now()}`,
        title: input.title,
        category: input.category,
        provider: {
          name: user.name,
          initials: user.initials,
          dept: user.dept,
          level: user.level,
          rating: 0,
          reviews: 0,
          verified: true,
        },
        price: input.price,
        unit: 'session',
        location: input.location,
        time: input.time,
        duration: 'Flexible',
        mode: input.location.startsWith('Online') ? 'Online' : 'In person',
        tags: [input.category, user.dept],
        blurb:
          input.blurb ||
          'Message me before booking so we can agree the details.',
        includes: ['Direct chat with you', 'Public campus meetup'],
        tint: 'plum',
      }

      setOffers((current) => [newService, ...current])
      logActivity(
        'service',
        'Published a new offer',
        `${input.title} · ${input.category}`,
      )
      showToast('Your offer is live. Students nearby can now find it.')
    },
    [logActivity, showToast, user],
  )

  const requestSession = useCallback(
    (service: Service) => {
      const firstName = service.provider.name.split(' ')[0]
      logActivity(
        'booking',
        `Requested a session with ${service.provider.name}`,
        `${service.title} · ${service.location} · ${service.time}`,
      )
      showToast(
        `Request sent to ${firstName}. Expect a reply in about 12 minutes.`,
      )
    },
    [logActivity, showToast],
  )

  const value = useMemo<MarketplaceContextValue>(
    () => ({
      services,
      offers,
      savedIds,
      isSaved,
      toggleSave,
      publishOffer,
      requestSession,
    }),
    [
      isSaved,
      offers,
      publishOffer,
      requestSession,
      savedIds,
      services,
      toggleSave,
    ],
  )

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  )
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext)
  if (!context) {
    throw new Error('useMarketplace must be used inside a MarketplaceProvider')
  }
  return context
}
