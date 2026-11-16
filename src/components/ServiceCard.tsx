import { formatNaira } from '../data'
import type { Service } from '../data'
import { Icon } from '../icons'
import { Avatar } from './Avatar'

export function Rating({ service }: { service: Service }) {
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

export function ServiceCard({
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
