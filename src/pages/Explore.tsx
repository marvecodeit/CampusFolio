import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data'
import type { Category } from '../data'
import { useMarketplace } from '../marketplace'
import { ServiceCard } from '../components/ServiceCard'
import { ServiceDetail } from '../components/ServiceDetail'
import { Icon } from '../icons'

export default function ExplorePage() {
  const { services, isSaved, toggleSave, requestSession } = useMarketplace()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category>('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selected = services.find((service) => service.id === selectedId)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable

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

  const filtered = useMemo(() => {
    const normalised = query.trim().toLowerCase()

    return services.filter((service) => {
      if (category !== 'All' && service.category !== category) return false
      if (!normalised) return true

      return [
        service.title,
        service.provider.name,
        service.provider.dept,
        service.category,
        service.location,
        ...service.tags,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalised)
    })
  }, [category, query, services])

  const resetFilters = () => {
    setCategory('All')
    setQuery('')
  }

  return (
    <div className='dash-page'>
      <header className='dash-page__head'>
        <div>
          <p className='section-kicker'>Marketplace</p>
          <h1>Explore campus services</h1>
          <p>
            Search verified student offers, filter by category and save what
            fits. Every save lands in your activity log.
          </p>
        </div>
        <span className='dash-page__badge'>
          <span className='live-dot' />
          {filtered.length} live{' '}
          {filtered.length === 1 ? 'service' : 'services'}
        </span>
      </header>

      <section aria-label='Find a service' className='discovery dash-discovery'>
        <div className='search-shell'>
          <Icon className='search-shell__icon' name='search' size={20} />
          <input
            aria-label='Search campus services'
            onChange={(event) => setQuery(event.target.value)}
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
          {categories.map((item) => {
            const active = category === item.name
            return (
              <button
                aria-pressed={active}
                className={`category-pill${active ? ' is-active' : ''}`}
                key={item.name}
                onClick={() => setCategory(item.name)}
                type='button'
              >
                <Icon name={item.icon} size={16} />
                {item.name}
              </button>
            )
          })}
        </div>
      </section>

      <div className='section-head'>
        <div>
          <p className='section-kicker'>
            {query.trim()
              ? `Results for “${query.trim()}”`
              : category === 'All'
                ? 'Around campus'
                : category}
          </p>
          <h2>
            {query.trim()
              ? 'Matching services'
              : category === 'All'
                ? 'Open right now'
                : `${category} services`}
          </h2>
        </div>
        <span className='section-count'>
          {filtered.length} {filtered.length === 1 ? 'service' : 'services'}
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className='service-grid service-grid--three'>
          {filtered.map((service) => (
            <ServiceCard
              isSaved={isSaved(service.id)}
              key={service.id}
              onOpen={() => setSelectedId(service.id)}
              onToggleSave={() => toggleSave(service.id)}
              service={service}
            />
          ))}
        </div>
      ) : (
        <div className='empty-state'>
          <span className='empty-state__icon'>
            <Icon name='search' size={24} />
          </span>
          <h3>No services match that search</h3>
          <p>
            Try a different subject, skill or location. New offers go live every
            day.
          </p>
          <button className='btn btn--soft' onClick={resetFilters} type='button'>
            Browse all services
            <Icon name='arrow-right' size={17} />
          </button>
        </div>
      )}

      <div className='request-strip'>
        <div className='request-strip__icon'>
          <Icon name='package' size={20} />
        </div>
        <div>
          <h3>Have a skill worth sharing?</h3>
          <p>Publish an offer and let campus come to you.</p>
        </div>
        <Link className='btn btn--ghost btn--small' to='/dashboard/offers'>
          Offer a service
          <Icon name='arrow-up-right' size={16} />
        </Link>
      </div>

      {selected && (
        <ServiceDetail
          onClose={() => setSelectedId(null)}
          onRequest={() => {
            requestSession(selected)
            setSelectedId(null)
          }}
          service={selected}
        />
      )}
    </div>
  )
}
