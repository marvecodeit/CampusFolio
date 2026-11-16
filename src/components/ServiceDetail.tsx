import { useEffect } from 'react'
import { formatNaira } from '../data'
import type { Service } from '../data'
import { Icon } from '../icons'
import { Avatar } from './Avatar'

export function ServiceDetail({
  service,
  onClose,
  onRequest,
}: {
  service: Service
  onClose: () => void
  onRequest: () => void
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div className='sheet-layer'>
      <button
        aria-label='Close service details'
        className='sheet-scrim'
        onClick={onClose}
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
            onClick={onClose}
            type='button'
          >
            <Icon name='x' size={18} />
          </button>
        </div>

        <div className='detail-sheet__body'>
          <div className='detail-head'>
            <span className='service-tag'>{service.category}</span>
            <span className='detail-mode'>
              <Icon name='map-pin' size={14} />
              {service.mode}
            </span>
          </div>

          <h2 id='detail-title'>{service.title}</h2>

          <div className='detail-provider'>
            <Avatar initials={service.provider.initials} tint={service.tint} />
            <div className='detail-provider__text'>
              <strong>
                {service.provider.name}
                {service.provider.verified && (
                  <Icon name='badge-check' size={15} />
                )}
              </strong>
              <small>
                {service.provider.level} · {service.provider.dept}
              </small>
            </div>
            {service.provider.reviews > 0 ? (
              <span className='detail-provider__rating'>
                <Icon name='star' size={13} />
                {service.provider.rating.toFixed(1)}
                <small>({service.provider.reviews})</small>
              </span>
            ) : (
              <span className='new-pill'>New</span>
            )}
          </div>

          <p className='detail-blurb'>{service.blurb}</p>

          <div className='detail-meta'>
            <div>
              <span className='detail-meta__icon'>
                <Icon name='map-pin' size={17} />
              </span>
              <span>
                <small>Where</small>
                <strong>{service.location}</strong>
              </span>
            </div>
            <div>
              <span className='detail-meta__icon'>
                <Icon name='calendar' size={17} />
              </span>
              <span>
                <small>When</small>
                <strong>{service.time}</strong>
              </span>
            </div>
            <div>
              <span className='detail-meta__icon'>
                <Icon name='clock' size={17} />
              </span>
              <span>
                <small>Duration</small>
                <strong>{service.duration}</strong>
              </span>
            </div>
          </div>

          <h3 className='detail-subhead'>What&rsquo;s included</h3>
          <ul className='check-list'>
            {service.includes.map((item) => (
              <li key={item}>
                <Icon name='check' size={15} />
                {item}
              </li>
            ))}
          </ul>

          <div className='detail-safety'>
            <Icon name='shield' size={19} />
            <p>
              <strong>Meet with confidence.</strong> Keep the first meetup in a
              public campus space and confirm the price in chat before you
              start.
            </p>
          </div>
        </div>

        <div className='detail-sheet__foot'>
          <div>
            <span className='detail-price'>
              {formatNaira(service.price)}
              <small> / {service.unit}</small>
            </span>
            <span className='detail-footnote'>
              No payment until the session is confirmed
            </span>
          </div>
          <button className='btn btn--primary' onClick={onRequest} type='button'>
            Request session
            <Icon name='arrow-right' size={18} />
          </button>
        </div>
      </section>
    </div>
  )
}
