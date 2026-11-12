import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  categories,
  currentUser,
  formatNaira,
  services as seedServices,
  spotlightId,
} from './data'
import type { Category, Service } from './data'
import { Icon } from './icons'
import type { IconName } from './icons'
import './App.css'

type NavKey = 'home' | 'explore' | 'messages' | 'saved' | 'profile'

const desktopNav: { key: NavKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'explore', label: 'Explore' },
  { key: 'messages', label: 'Messages' },
  { key: 'saved', label: 'Saved' },
]

const mobileNav: { key: Exclude<NavKey, 'messages'>; label: string; icon: IconName }[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'explore', label: 'Explore', icon: 'compass' },
  { key: 'saved', label: 'Saved', icon: 'bookmark' },
  { key: 'profile', label: 'Profile', icon: 'user' },
]

const todayLabel = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date())

function Avatar({
  initials,
  tint,
  small = false,
}: {
  initials: string
  tint: string
  small?: boolean
}) {
  return (
    <span
      aria-hidden='true'
      className={`avatar avatar--${tint}${small ? ' avatar--sm' : ''}`}
    >
      {initials}
    </span>
  )
}

function Rating({ service }: { service: Service }) {
  if (service.provider.reviews === 0) {
    return <span className='new-pill'>New</span>
  }

  return (
    <span className='rating'>
      <Icon name='star' size={13} />
      <strong>{service.provider.rating.toFixed(1)}</strong>
      <span>({service.provider.reviews})</span>
    </span>
  )
}

function ServiceCard({
  service,
  isSaved,
  onOpen,
  onToggleSave,
}: {
  service: Service
  isSaved: boolean
  onOpen: () => void
  onToggleSave: () => void
}) {
  return (
    <article className='service-card'>
      <div className='service-card__top'>
        <span className='service-tag'>{service.category}</span>
        <button
          aria-label={
            isSaved
              ? `Remove ${service.title} from saved services`
              : `Save ${service.title}`
          }
          aria-pressed={isSaved}
          className={`icon-button save-button${isSaved ? ' is-saved' : ''}`}
          onClick={onToggleSave}
          type='button'
        >
          <Icon name='bookmark' size={18} />
        </button>
      </div>

      <button
        aria-label={`View details for ${service.title}`}
        className='service-card__title'
        onClick={onOpen}
        type='button'
      >
        {service.title}
      </button>

      <div className='provider-row'>
        <Avatar initials={service.provider.initials} tint={service.tint} />
        <div className='provider-row__text'>
          <span className='provider-row__name'>
            {service.provider.name}
            {service.provider.verified && (
              <Icon className='verified-icon' name='badge-check' size={14} />
            )}
          </span>
          <span className='provider-row__meta'>
            {service.provider.level} · {service.provider.dept}
          </span>
        </div>
      </div>

      <div className='service-card__meta'>
        <span>
          <Icon name='map-pin' size={15} />
          {service.location}
        </span>
        <span>
          <Icon name='clock' size={15} />
          {service.time}
        </span>
      </div>

      <div className='service-card__footer'>
        <p className='price'>
          {formatNaira(service.price)}
          <small> / {service.unit}</small>
        </p>
        <Rating service={service} />
        <button
          aria-label={`Open ${service.title}`}
          className='round-button'
          onClick={onOpen}
          type='button'
        >
          <Icon name='arrow-up-right' size={18} />
        </button>
      </div>
    </article>
  )
}

function App() {
  const [activeNav, setActiveNav] = useState<NavKey>('home')
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState<Set<string>>(
    () => new Set(['figma-review']),
  )
  const [extraServices, setExtraServices] = useState<Service[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [hasUnread, setHasUnread] = useState(true)
  const searchRef = useRef<HTMLInputElement>(null)

  const allServices = useMemo(
    () => [...extraServices, ...seedServices],
    [extraServices],
  )

  const spotlight =
    allServices.find((service) => service.id === spotlightId) ?? allServices[0]

  const selected = allServices.find((service) => service.id === selectedId)

  const filteredServices = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase()

    return allServices.filter((service) => {
      if (activeNav === 'saved' && !saved.has(service.id)) return false
      if (activeCategory !== 'All' && service.category !== activeCategory) {
        return false
      }
      if (!normalisedQuery) return true

      const haystack = [
        service.title,
        service.provider.name,
        service.provider.dept,
        service.category,
        service.location,
        ...service.tags,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalisedQuery)
    })
  }, [activeCategory, activeNav, allServices, query, saved])

  const topRated = useMemo(() => {
    const seen = new Set<string>()

    return allServices
      .filter((service) => service.provider.reviews > 0)
      .sort(
        (a, b) =>
          b.provider.rating - a.provider.rating ||
          b.provider.reviews - a.provider.reviews,
      )
      .filter((service) => {
        if (seen.has(service.provider.name)) return false
        seen.add(service.provider.name)
        return true
      })
      .slice(0, 3)
  }, [allServices])

  useEffect(() => {
    if (!toast) return

    const timer = window.setTimeout(() => setToast(null), 3600)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable

      if (event.key === 'Escape') {
        setSelectedId(null)
        setComposeOpen(false)
        return
      }

      if (isTyping) return

      if (
        event.key === '/' ||
        ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')
      ) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const modalOpen = Boolean(selected) || composeOpen
    document.body.style.overflow = modalOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [composeOpen, selected])

  const scrollToServices = () => {
    document
      .getElementById('services')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleNav = (key: NavKey) => {
    if (key === 'messages') {
      setToast('Messages are coming to Campus Folio shortly.')
      return
    }

    if (key === 'profile') {
      setToast('Your Campus Folio profile page is coming soon.')
      return
    }

    setActiveNav(key)

    if (key === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    scrollToServices()
  }

  const toggleSaved = (id: string) => {
    setSaved((current) => {
      const next = new Set(current)

      if (next.has(id)) {
        next.delete(id)
        setToast('Removed from your saved services.')
      } else {
        next.add(id)
        setToast('Saved. Find it under Saved in the menu.')
      }

      return next
    })
  }

  const resetFilters = () => {
    setActiveCategory('All')
    setQuery('')
    setActiveNav('explore')
  }

  const handlePublish = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const title = String(form.get('title') ?? '').trim()
    if (!title) return

    const category = String(
      form.get('category') ?? 'Academics',
    ) as Exclude<Category, 'All'>

    const price = Math.max(0, Number(form.get('price')) || 0)
    const location = String(form.get('location') ?? 'Main Campus')
    const time = String(form.get('time') ?? 'Flexible')
    const blurb =
      String(form.get('blurb') ?? '').trim() ||
      'Message me before booking so we can agree the details.'

    const newService: Service = {
      id: `own-${Date.now()}`,
      title,
      category,
      provider: {
        name: currentUser.name,
        initials: currentUser.initials,
        dept: currentUser.dept,
        level: currentUser.level,
        rating: 0,
        reviews: 0,
        verified: true,
      },
      price,
      unit: 'session',
      location,
      time,
      duration: 'Flexible',
      mode: 'In person',
      tags: [category],
      blurb,
      includes: ['Direct chat with you', 'Public campus meetup'],
      tint: 'plum',
    }

    setExtraServices((current) => [newService, ...current])
    setComposeOpen(false)
    setActiveNav('home')
    setActiveCategory('All')
    setQuery('')
    setToast('Your offer is live. Students nearby can now find it.')

    window.requestAnimationFrame(() => {
      document
        .getElementById('services')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const requestSession = () => {
    if (!selected) return

    const firstName = selected.provider.name.split(' ')[0]
    setSelectedId(null)
    setToast(`Request sent to ${firstName}. Expect a reply in about 12 minutes.`)
  }

  return (
    <div className='app'>
      <a className='skip-link' href='#main'>
        Skip to content
      </a>

      <header className='site-header'>
        <div className='header-inner'>
          <button
            aria-label='Campus Folio home'
            className='brand'
            onClick={() => handleNav('home')}
            type='button'
          >
            <span className='brand-mark'>
              <svg aria-hidden='true' viewBox='0 0 24 24'>
                <path
                  d='M6 4.75A1.75 1.75 0 0 1 7.75 3H19v14.5H7.75A1.75 1.75 0 0 0 6 19.25V4.75Z'
                  fill='currentColor'
                />
                <path
                  d='M8.75 7.25h6.5M8.75 10.25h4.25'
                  stroke='#5a2058'
                  strokeLinecap='round'
                  strokeWidth='1.5'
                />
                <circle cx='18.75' cy='19.25' r='2.25' fill='#1b93d0' />
              </svg>
            </span>
            <span className='brand-word'>
              <strong>Campus Folio</strong>
              <small>Anchor University · Lagos</small>
            </span>
          </button>

          <nav aria-label='Primary' className='desktop-nav'>
            {desktopNav.map((item) => (
              <button
                aria-current={activeNav === item.key ? 'page' : undefined}
                className={`nav-link${activeNav === item.key ? ' is-active' : ''}`}
                key={item.key}
                onClick={() => handleNav(item.key)}
                type='button'
              >
                {item.label}
                {item.key === 'saved' && saved.size > 0 && (
                  <span className='nav-count'>{saved.size}</span>
                )}
              </button>
            ))}
          </nav>

          <div className='header-actions'>
            <button
              className='campus-pill'
              onClick={() => setToast('Campus switching opens soon. You are on Main Campus.')}
              type='button'
            >
              <Icon name='map-pin' size={15} />
              Main Campus
              <Icon name='chevron-down' size={14} />
            </button>

            <button
              aria-label={
                hasUnread ? 'Notifications, one unread' : 'Notifications'
              }
              className='icon-button notification-button'
              onClick={() => {
                setHasUnread(false)
                setToast('You are all caught up. No new notifications.')
              }}
              type='button'
            >
              <Icon name='bell' size={19} />
              {hasUnread && <span className='unread-dot' />}
            </button>

            <button
              aria-label='Open profile'
              className='profile-button'
              onClick={() => setToast('Your Campus Folio profile page is coming soon.')}
              type='button'
            >
              <Avatar
                initials={currentUser.initials}
                small
                tint='plum'
              />
              <span className='profile-button__text'>
                <strong>{currentUser.firstName}</strong>
                <small>{currentUser.level}</small>
              </span>
              <Icon name='chevron-down' size={14} />
            </button>
          </div>
        </div>
      </header>

      <main id='main'>
        <section className='hero' id='top'>
          <div className='hero__copy'>
            <p className='hero__eyebrow'>
              <span className='status-dot' />
              {todayLabel}
              <span className='hero__divider' />
              Main Campus
            </p>

            <h1>
              Find the student who <em>already aced it.</em>
            </h1>

            <p className='hero__lede'>
              Tutoring, design, tech help and everyday campus runs — booked from
              verified Anchor students, at student prices.
            </p>

            <div className='hero__actions'>
              <button
                className='btn btn--primary'
                onClick={() => handleNav('explore')}
                type='button'
              >
                Explore services
                <Icon name='arrow-right' size={18} />
              </button>
              <button
                className='btn btn--ghost'
                onClick={() => setComposeOpen(true)}
                type='button'
              >
                <Icon name='plus' size={18} />
                Offer a service
              </button>
            </div>

            <div className='trust-row'>
              <span>
                <Icon name='shield' size={16} />
                Verified students
              </span>
              <span>
                <Icon name='clock' size={16} />
                Replies in ~12 min
              </span>
              <span>
                <Icon name='map-pin' size={16} />
                Meet on campus
              </span>
            </div>
          </div>

          <div className='hero__visual'>
            <article className='spotlight'>
              <span aria-hidden='true' className='spotlight__orb' />
              <span aria-hidden='true' className='spotlight__grid' />

              <div className='spotlight__top'>
                <span className='spotlight__label'>
                  <span className='live-dot' />
                  Tonight near you
                </span>
                <span className='spotlight__seats'>3 seats left</span>
              </div>

              <div className='spotlight__body'>
                <p className='spotlight__course'>MAT 122 · Calculus II</p>
                <h2>
                  One session.
                  <br />
                  Friday&rsquo;s test, handled.
                </h2>

                <div className='spotlight__host'>
                  <Avatar
                    initials={spotlight.provider.initials}
                    tint={spotlight.tint}
                  />
                  <div>
                    <span className='spotlight__host-name'>
                      {spotlight.provider.name}
                      <Icon name='badge-check' size={14} />
                    </span>
                    <span className='spotlight__host-meta'>
                      {spotlight.provider.level} · {spotlight.provider.dept}
                    </span>
                  </div>
                  <span className='spotlight__rating'>
                    <Icon name='star' size={12} />
                    {spotlight.provider.rating.toFixed(1)}
                  </span>
                </div>

                <div className='spotlight__meta'>
                  <span>
                    <Icon name='clock' size={15} />
                    Today, 3:00 PM
                  </span>
                  <span>
                    <Icon name='map-pin' size={15} />
                    Cafeteria
                  </span>
                </div>
              </div>

              <div className='spotlight__footer'>
                <p>
                  {formatNaira(spotlight.price)}
                  <small> / seat</small>
                </p>
                <button
                  onClick={() => setSelectedId(spotlight.id)}
                  type='button'
                >
                  Reserve a seat
                  <Icon name='arrow-up-right' size={17} />
                </button>
              </div>
            </article>

            <button
              className='hero__pulse'
              onClick={() => {
                setActiveNav('explore')
                scrollToServices()
              }}
              type='button'
            >
              <span className='live-dot' />
              <span>
                <strong>248 students</strong>
                <small>online on campus now</small>
              </span>
              <Icon name='arrow-up-right' size={16} />
            </button>
          </div>
        </section>

        <section aria-label='Find a service' className='discovery'>
          <div className='search-shell'>
            <Icon className='search-shell__icon' name='search' size={20} />
            <input
              aria-label='Search campus services'
              onChange={(event) => {
                setQuery(event.target.value)
                if (activeNav === 'saved') setActiveNav('explore')
              }}
              placeholder='Search calculus, Figma, CV review, laundry…'
              ref={searchRef}
              type='search'
              value={query}
            />
            {query ? (
              <button
                aria-label='Clear search'
                className='search-clear'
                onClick={() => {
                  setQuery('')
                  searchRef.current?.focus()
                }}
                type='button'
              >
                <Icon name='x' size={16} />
              </button>
            ) : (
              <kbd className='search-kbd'>/</kbd>
            )}
          </div>

          <div
            aria-label='Filter services by category'
            className='category-rail'
            role='group'
          >
            {categories.map((category) => {
              const active = activeCategory === category.name

              return (
                <button
                  aria-pressed={active}
                  className={`category-pill${active ? ' is-active' : ''}`}
                  key={category.name}
                  onClick={() => {
                    setActiveCategory(category.name)
                    setActiveNav((current) =>
                      current === 'saved' ? 'explore' : current,
                    )
                  }}
                  type='button'
                >
                  <Icon name={category.icon} size={16} />
                  {category.name}
                </button>
              )
            })}
          </div>
        </section>

        <div className='content-grid'>
          <section
            aria-labelledby='services-heading'
            className='services'
            id='services'
          >
            <div className='section-head'>
              <div>
                <p className='section-kicker'>
                  {activeNav === 'saved' ? 'Your shortlist' : 'Around campus'}
                </p>
                <h2 id='services-heading'>
                  {activeNav === 'saved'
                    ? 'Saved for later'
                    : query.trim()
                      ? `Results for “${query.trim()}”`
                      : activeCategory === 'All'
                        ? 'Open right now'
                        : `${activeCategory} services`}
                </h2>
              </div>
              <span className='section-count'>
                {filteredServices.length}{' '}
                {filteredServices.length === 1 ? 'service' : 'services'}
              </span>
            </div>

            {filteredServices.length > 0 ? (
              <div className='service-grid'>
                {filteredServices.map((service) => (
                  <ServiceCard
                    isSaved={saved.has(service.id)}
                    key={service.id}
                    onOpen={() => setSelectedId(service.id)}
                    onToggleSave={() => toggleSaved(service.id)}
                    service={service}
                  />
                ))}
              </div>
            ) : (
              <div className='empty-state'>
                <span className='empty-state__icon'>
                  <Icon name={activeNav === 'saved' ? 'bookmark' : 'search'} size={24} />
                </span>
                <h3>
                  {activeNav === 'saved'
                    ? 'Nothing saved yet'
                    : 'No services match that search'}
                </h3>
                <p>
                  {activeNav === 'saved'
                    ? 'Tap the bookmark on a listing to keep it here for later.'
                    : 'Try a different subject, skill or location. New offers go live every day.'}
                </p>
                <button className='btn btn--soft' onClick={resetFilters} type='button'>
                  Browse all services
                  <Icon name='arrow-right' size={17} />
                </button>
              </div>
            )}

            <div className='request-strip'>
              <div className='request-strip__icon'>
                <Icon name='message' size={20} />
              </div>
              <div>
                <h3>Nothing fits quite right?</h3>
                <p>Post what you need and let campus come to you.</p>
              </div>
              <button
                className='btn btn--ghost btn--small'
                onClick={() => setComposeOpen(true)}
                type='button'
              >
                Post a request
                <Icon name='arrow-up-right' size={16} />
              </button>
            </div>
          </section>

          <aside aria-label='Campus overview' className='rail'>
            <section className='rail-card'>
              <div className='rail-card__head'>
                <div>
                  <p className='section-kicker'>{todayLabel}</p>
                  <h2>Your week</h2>
                </div>
                <Avatar initials={currentUser.initials} small tint='plum' />
              </div>

              <ol className='timeline'>
                <li>
                  <span className='timeline__dot timeline__dot--plum' />
                  <div>
                    <span className='timeline__time'>Today · 3:00 PM</span>
                    <h3>Calculus II with Chidera</h3>
                    <p>Cafeteria · Confirmed</p>
                  </div>
                </li>
                <li>
                  <span className='timeline__dot timeline__dot--sky' />
                  <div>
                    <span className='timeline__time'>Fri · 7:00 PM</span>
                    <h3>CV review with Favour</h3>
                    <p>Google Meet · Pending</p>
                  </div>
                </li>
              </ol>

              <p className='rail-card__foot'>
                <Icon name='shield' size={15} />
                Meetups in public campus spaces are covered by our safety
                promise.
              </p>
            </section>

            <section className='rail-card'>
              <div className='rail-card__head'>
                <div>
                  <p className='section-kicker'>Campus ranking</p>
                  <h2>Top rated this week</h2>
                </div>
                <span className='live-pill'>
                  <span />
                  Live
                </span>
              </div>

              <ol className='leaderboard'>
                {topRated.map((service, index) => (
                  <li key={service.provider.name}>
                    <span className='leaderboard__rank'>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <button
                      className='leaderboard__person'
                      onClick={() => setSelectedId(service.id)}
                      type='button'
                    >
                      <Avatar
                        initials={service.provider.initials}
                        small
                        tint={service.tint}
                      />
                      <span className='leaderboard__text'>
                        <strong>{service.provider.name}</strong>
                        <small>{service.provider.dept}</small>
                      </span>
                      <span className='leaderboard__rating'>
                        <Icon name='star' size={12} />
                        {service.provider.rating.toFixed(1)}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>

            <section className='note-card'>
              <span className='note-card__icon'>
                <Icon name='calendar' size={19} />
              </span>
              <div>
                <p className='section-kicker'>Campus note</p>
                <h3>Quiet hours begin Monday</h3>
                <p>
                  The library runs until 11 PM through mid-semester week. Group
                  rooms can be booked at the front desk.
                </p>
                <span className='note-card__source'>Student Affairs · 2h ago</span>
              </div>
            </section>
          </aside>
        </div>

        <footer className='site-footer'>
          <div className='footer-brand'>
            <span className='brand-mark brand-mark--small'>
              <svg aria-hidden='true' viewBox='0 0 24 24'>
                <path
                  d='M6 4.75A1.75 1.75 0 0 1 7.75 3H19v14.5H7.75A1.75 1.75 0 0 0 6 19.25V4.75Z'
                  fill='currentColor'
                />
                <circle cx='18.75' cy='19.25' r='2.25' fill='#96cde9' />
              </svg>
            </span>
            <div>
              <strong>Campus Folio</strong>
              <p>Built for the Anchor University Lagos community.</p>
            </div>
          </div>
          <p className='footer-note'>
            Buy and sell real skills, not shortcuts. Every meetup stays on
            campus.
          </p>
          <div className='footer-links'>
            <button
              onClick={() => setToast('Community guidelines are coming soon.')}
              type='button'
            >
              Community guidelines
            </button>
            <button
              onClick={() => setToast('Campus support is available at the front desk.')}
              type='button'
            >
              Support
            </button>
            <span>2026</span>
          </div>
        </footer>
      </main>

      <nav aria-label='Mobile primary' className='bottom-nav'>
        {mobileNav.slice(0, 2).map((item) => (
          <button
            aria-current={activeNav === item.key ? 'page' : undefined}
            className={`bottom-nav__item${activeNav === item.key ? ' is-active' : ''}`}
            key={item.key}
            onClick={() => handleNav(item.key)}
            type='button'
          >
            <Icon name={item.icon} size={21} />
            <span>{item.label}</span>
            {item.key === 'saved' && saved.size > 0 && (
              <span className='bottom-nav__badge'>{saved.size}</span>
            )}
          </button>
        ))}

        <button
          aria-label='Offer a service'
          className='bottom-nav__post'
          onClick={() => setComposeOpen(true)}
          type='button'
        >
          <span className='bottom-nav__plus'>
            <Icon name='plus' size={22} />
          </span>
          <span>Post</span>
        </button>

        {mobileNav.slice(2).map((item) => (
          <button
            aria-current={activeNav === item.key ? 'page' : undefined}
            className={`bottom-nav__item${activeNav === item.key ? ' is-active' : ''}`}
            key={item.key}
            onClick={() => handleNav(item.key)}
            type='button'
          >
            <Icon name={item.icon} size={21} />
            <span>{item.label}</span>
            {item.key === 'saved' && saved.size > 0 && (
              <span className='bottom-nav__badge'>{saved.size}</span>
            )}
          </button>
        ))}
      </nav>

      {selected && (
        <div className='sheet-layer'>
          <button
            aria-label='Close service details'
            className='sheet-scrim'
            onClick={() => setSelectedId(null)}
            tabIndex={-1}
            type='button'
          />
          <section
            aria-labelledby='detail-title'
            aria-modal='true'
            className='sheet detail-sheet'
            role='dialog'
          >
            <div className='sheet__bar'>
              <span aria-hidden='true' className='sheet__grabber' />
              <button
                aria-label='Close service details'
                autoFocus
                className='icon-button sheet__close'
                onClick={() => setSelectedId(null)}
                type='button'
              >
                <Icon name='x' size={18} />
              </button>
            </div>

            <div className='detail-sheet__body'>
              <div className='detail-head'>
                <span className='service-tag'>{selected.category}</span>
                <span className='detail-mode'>
                  <Icon name='map-pin' size={14} />
                  {selected.mode}
                </span>
              </div>

              <h2 id='detail-title'>{selected.title}</h2>

              <div className='detail-provider'>
                <Avatar
                  initials={selected.provider.initials}
                  tint={selected.tint}
                />
                <div className='detail-provider__text'>
                  <strong>
                    {selected.provider.name}
                    {selected.provider.verified && (
                      <Icon name='badge-check' size={15} />
                    )}
                  </strong>
                  <small>
                    {selected.provider.level} · {selected.provider.dept}
                  </small>
                </div>
                {selected.provider.reviews > 0 ? (
                  <span className='detail-provider__rating'>
                    <Icon name='star' size={13} />
                    {selected.provider.rating.toFixed(1)}
                    <small>({selected.provider.reviews})</small>
                  </span>
                ) : (
                  <span className='new-pill'>New</span>
                )}
              </div>

              <p className='detail-blurb'>{selected.blurb}</p>

              <div className='detail-meta'>
                <div>
                  <span className='detail-meta__icon'>
                    <Icon name='map-pin' size={17} />
                  </span>
                  <span>
                    <small>Where</small>
                    <strong>{selected.location}</strong>
                  </span>
                </div>
                <div>
                  <span className='detail-meta__icon'>
                    <Icon name='calendar' size={17} />
                  </span>
                  <span>
                    <small>When</small>
                    <strong>{selected.time}</strong>
                  </span>
                </div>
                <div>
                  <span className='detail-meta__icon'>
                    <Icon name='clock' size={17} />
                  </span>
                  <span>
                    <small>Duration</small>
                    <strong>{selected.duration}</strong>
                  </span>
                </div>
              </div>

              <h3 className='detail-subhead'>What&rsquo;s included</h3>
              <ul className='check-list'>
                {selected.includes.map((item) => (
                  <li key={item}>
                    <Icon name='check' size={15} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className='detail-safety'>
                <Icon name='shield' size={19} />
                <p>
                  <strong>Meet with confidence.</strong> Keep the first meetup in
                  a public campus space and confirm the price in chat before you
                  start.
                </p>
              </div>
            </div>

            <div className='detail-sheet__foot'>
              <div>
                <span className='detail-price'>
                  {formatNaira(selected.price)}
                  <small> / {selected.unit}</small>
                </span>
                <span className='detail-footnote'>
                  No payment until the session is confirmed
                </span>
              </div>
              <button
                className='btn btn--primary'
                onClick={requestSession}
                type='button'
              >
                Request session
                <Icon name='arrow-right' size={18} />
              </button>
            </div>
          </section>
        </div>
      )}

      {composeOpen && (
        <div className='sheet-layer'>
          <button
            aria-label='Close offer form'
            className='sheet-scrim'
            onClick={() => setComposeOpen(false)}
            tabIndex={-1}
            type='button'
          />
          <section
            aria-labelledby='compose-title'
            aria-modal='true'
            className='sheet compose-sheet'
            role='dialog'
          >
            <div className='sheet__bar'>
              <span aria-hidden='true' className='sheet__grabber' />
              <button
                aria-label='Close offer form'
                className='icon-button sheet__close'
                onClick={() => setComposeOpen(false)}
                type='button'
              >
                <Icon name='x' size={18} />
              </button>
            </div>

            <form onSubmit={handlePublish}>
              <div className='compose-intro'>
                <p className='section-kicker'>Give campus a hand</p>
                <h2 id='compose-title'>Offer a service</h2>
                <p>
                  Share what you do well. Keep it specific, honest and easy to
                  book.
                </p>
              </div>

              <label className='field'>
                <span>What are you offering?</span>
                <input
                  autoFocus
                  maxLength={90}
                  name='title'
                  placeholder='e.g. Calculus II crash course before Friday'
                  required
                />
              </label>

              <div className='field-row'>
                <label className='field'>
                  <span>Category</span>
                  <select defaultValue='Academics' name='category'>
                    {categories
                      .filter((category) => category.name !== 'All')
                      .map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </label>
                <label className='field'>
                  <span>Price (₦)</span>
                  <input
                    min='0'
                    name='price'
                    placeholder='3000'
                    required
                    step='500'
                    type='number'
                  />
                </label>
              </div>

              <div className='field-row'>
                <label className='field'>
                  <span>Where</span>
                  <select defaultValue='Cafeteria, Main Campus' name='location'>
                    <option>Cafeteria, Main Campus</option>
                    <option>Main Library</option>
                    <option>Lecture Hall B</option>
                    <option>Cyber Café, Block C</option>
                    <option>Online · Google Meet</option>
                    <option>Main Campus</option>
                  </select>
                </label>
                <label className='field'>
                  <span>When</span>
                  <input
                    name='time'
                    placeholder='Today · 3:00 PM'
                    required
                  />
                </label>
              </div>

              <label className='field'>
                <span>
                  Details <em>optional</em>
                </span>
                <textarea
                  name='blurb'
                  placeholder='What should a student expect from the session?'
                  rows={3}
                />
              </label>

              <p className='compose-note'>
                <Icon name='shield' size={16} />
                Your offer is visible to verified Anchor students only.
              </p>

              <button className='btn btn--primary compose-submit' type='submit'>
                Publish offer
                <Icon name='arrow-right' size={18} />
              </button>
            </form>
          </section>
        </div>
      )}

      {toast && (
        <div aria-live='polite' className='toast' role='status'>
          <span className='toast__icon'>
            <Icon name='check' size={15} />
          </span>
          <span>{toast}</span>
          <button
            aria-label='Dismiss message'
            className='toast__close'
            onClick={() => setToast(null)}
            type='button'
          >
            <Icon name='x' size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

export default App
