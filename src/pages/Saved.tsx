import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMarketplace } from '../marketplace'
import { ServiceCard } from '../components/ServiceCard'
import { ServiceDetail } from '../components/ServiceDetail'
import { Icon } from '../icons'

export default function SavedPage() {
  const { services, savedIds, isSaved, toggleSave, requestSession } =
    useMarketplace()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const saved = services.filter((service) => savedIds.has(service.id))
  const selected = services.find((service) => service.id === selectedId)

  return (
    <div className='dash-page'>
      <header className='dash-page__head'>
        <div>
          <p className='section-kicker'>Your shortlist</p>
          <h1>Saved services</h1>
          <p>
            Keep the offers you are considering in one place. Removing a service
            is logged on your activity trail too.
          </p>
        </div>
        <span className='dash-page__badge'>
          <Icon name='bookmark' size={14} />
          {saved.length} saved
        </span>
      </header>

      {saved.length > 0 ? (
        <div className='service-grid service-grid--three'>
          {saved.map((service) => (
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
        <div className='empty-state empty-state--tall'>
          <span className='empty-state__icon'>
            <Icon name='bookmark' size={24} />
          </span>
          <h3>Nothing saved yet</h3>
          <p>
            Tap the bookmark on any listing to keep it here for later. Saved
            services also appear in your activity log.
          </p>
          <Link className='btn btn--soft' to='/dashboard/explore'>
            Browse all services
            <Icon name='arrow-right' size={17} />
          </Link>
        </div>
      )}

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
