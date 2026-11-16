import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import { useMarketplace } from '../marketplace'
import { upcomingSessions } from '../demo'
import { ActivityFeed } from '../components/ActivityFeed'
import { ServiceCard } from '../components/ServiceCard'
import { ServiceDetail } from '../components/ServiceDetail'
import { Icon } from '../icons'
import type { IconName } from '../icons'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const today = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date())

export default function OverviewPage() {
  const { user, activities } = useAuth()
  const { services, offers, savedIds, isSaved, toggleSave, requestSession } =
    useMarketplace()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = services.find((service) => service.id === selectedId)

  const recommended = useMemo(() => {
    const seen = new Set<string>()
    return services
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
  }, [services])

  const stats: {
    label: string
    value: string
    foot: string
    icon: IconName
    tone: string
  }[] = [
    {
      label: 'Saved services',
      value: String(savedIds.size),
      foot: 'Ready for your shortlist',
      icon: 'bookmark',
      tone: 'sky',
    },
    {
      label: 'Active offers',
      value: String(offers.length),
      foot: offers.length ? 'Visible to campus' : 'Publish your first skill',
      icon: 'package',
      tone: 'sage',
    },
    {
      label: 'Sessions booked',
      value: String(
        activities.filter((entry) => entry.kind === 'booking').length,
      ),
      foot: 'Tracked in your activity log',
      icon: 'calendar',
      tone: 'lilac',
    },
    {
      label: 'Activity events',
      value: String(activities.length),
      foot: 'Every action, newest first',
      icon: 'activity',
      tone: 'plum',
    },
  ]

  if (!user) return null

  return (
    <div className='dash-page'>
      <header className='dash-page__head'>
        <div>
          <p className='section-kicker'>Overview · {today}</p>
          <h1>
            {greeting()}, {user.firstName}.
          </h1>
          <p>
            Here is what is moving across your campus folio today. Bookings,
            saves and account updates are all tracked below.
          </p>
        </div>
        <div className='dash-page__actions'>
          <Link className='btn btn--ghost btn--small' to='/dashboard/explore'>
            <Icon name='compass' size={16} />
            Explore services
          </Link>
          <Link className='btn btn--primary btn--small' to='/dashboard/offers'>
            <Icon name='plus' size={16} />
            Offer a service
          </Link>
        </div>
      </header>

      <div className='stat-grid'>
        {stats.map((stat) => (
          <article className='stat-card' key={stat.label}>
            <span className={`stat-card__icon stat-card__icon--${stat.tone}`}>
              <Icon name={stat.icon} size={18} />
            </span>
            <strong>{stat.value}</strong>
            <span className='stat-card__label'>{stat.label}</span>
            <small>{stat.foot}</small>
          </article>
        ))}
      </div>

      <div className='overview-grid'>
        <section className='panel'>
          <div className='panel__head'>
            <div>
              <p className='section-kicker'>Your week</p>
              <h2>Upcoming sessions</h2>
            </div>
            <Link className='panel__link' to='/dashboard/activity'>
              View log
              <Icon name='arrow-up-right' size={14} />
            </Link>
          </div>

          <ol className='timeline timeline--dash'>
            {upcomingSessions.map((session) => (
              <li key={session.id}>
                <span
                  className={`timeline__dot timeline__dot--${
                    session.tint === 'sage' ? 'plum' : session.tint
                  }`}
                />
                <div>
                  <span className='timeline__time'>{session.when}</span>
                  <h3>{session.title}</h3>
                  <p>{session.meta}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className='panel__foot'>
            <Icon name='shield' size={15} />
            Meetups in public campus spaces are covered by our safety promise.
          </p>
        </section>

        <section className='panel'>
          <div className='panel__head'>
            <div>
              <p className='section-kicker'>Live trail</p>
              <h2>Recent activity</h2>
            </div>
            <Link className='panel__link' to='/dashboard/activity'>
              All activity
              <Icon name='arrow-up-right' size={14} />
            </Link>
          </div>

          <ActivityFeed entries={activities.slice(0, 4)} grouped={false} />
        </section>
      </div>

      <section className='panel panel--wide'>
        <div className='panel__head'>
          <div>
            <p className='section-kicker'>Picked for you</p>
            <h2>Top rated around campus</h2>
          </div>
          <Link className='panel__link' to='/dashboard/explore'>
            Explore all
            <Icon name='arrow-up-right' size={14} />
          </Link>
        </div>

        <div className='service-grid service-grid--three'>
          {recommended.map((service) => (
            <ServiceCard
              isSaved={isSaved(service.id)}
              key={service.id}
              onOpen={() => setSelectedId(service.id)}
              onToggleSave={() => toggleSave(service.id)}
              service={service}
            />
          ))}
        </div>
      </section>

      <section className='dash-note'>
        <span className='dash-note__icon'>
          <Icon name='calendar' size={19} />
        </span>
        <div>
          <p className='section-kicker'>Campus note</p>
          <h3>Quiet hours begin Monday</h3>
          <p>
            The library runs until 11 PM through mid-semester week. Group rooms
            can be booked at the front desk.
          </p>
          <span className='dash-note__source'>Student Affairs · 2h ago</span>
        </div>
      </section>

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
