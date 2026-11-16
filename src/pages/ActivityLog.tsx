import { useMemo, useState } from 'react'
import { useAuth } from '../auth'
import { ActivityFeed } from '../components/ActivityFeed'
import { formatActivityTime } from '../demo'
import type { ActivityKind } from '../demo'
import { Icon } from '../icons'

type Filter = 'all' | 'booking' | 'service' | 'saved' | 'account'

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All activity' },
  { key: 'booking', label: 'Bookings' },
  { key: 'service', label: 'Offers' },
  { key: 'saved', label: 'Saved' },
  { key: 'account', label: 'Account' },
]

function matches(entryKind: ActivityKind, filter: Filter) {
  if (filter === 'all') return true
  if (filter === 'account') {
    return entryKind === 'account' || entryKind === 'auth'
  }
  return entryKind === filter
}

export default function ActivityLogPage() {
  const { activities } = useAuth()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(
    () => activities.filter((entry) => matches(entry.kind, filter)),
    [activities, filter],
  )

  const todayCount = useMemo(() => {
    const today = new Date().toDateString()
    return activities.filter(
      (entry) => new Date(entry.at).toDateString() === today,
    ).length
  }, [activities])

  const latest = activities[0]

  return (
    <div className='dash-page'>
      <header className='dash-page__head'>
        <div>
          <p className='section-kicker'>Account trail</p>
          <h1>Activity log</h1>
          <p>
            Every sign-in, booking, save and profile change on your folio,
            newest first. This trail is stored on your device for the demo.
          </p>
        </div>
        <span className='dash-page__badge'>
          <span className='live-dot' />
          {activities.length} events
        </span>
      </header>

      <div className='activity-layout'>
        <section className='panel'>
          <div className='panel__head panel__head--stack'>
            <div>
              <p className='section-kicker'>Filter the trail</p>
              <h2>All routes, one log</h2>
            </div>
            <div
              aria-label='Filter activity'
              className='filter-tabs'
              role='group'
            >
              {filters.map((item) => (
                <button
                  aria-pressed={filter === item.key}
                  className={`filter-tab${
                    filter === item.key ? ' is-active' : ''
                  }`}
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  type='button'
                >
                  {item.label}
                  <span>
                    {item.key === 'all'
                      ? activities.length
                      : activities.filter((entry) =>
                          matches(entry.kind, item.key),
                        ).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <ActivityFeed entries={filtered} />
        </section>

        <aside className='activity-summary'>
          <section className='panel'>
            <p className='section-kicker'>At a glance</p>
            <h2>Log summary</h2>
            <dl className='summary-list'>
              <div>
                <dt>Total events</dt>
                <dd>{activities.length}</dd>
              </div>
              <div>
                <dt>Today</dt>
                <dd>{todayCount}</dd>
              </div>
              <div>
                <dt>Bookings</dt>
                <dd>
                  {
                    activities.filter((entry) => entry.kind === 'booking')
                      .length
                  }
                </dd>
              </div>
              <div>
                <dt>Last update</dt>
                <dd>{latest ? formatActivityTime(latest.at) : '—'}</dd>
              </div>
            </dl>
          </section>

          <section className='panel activity-legend'>
            <p className='section-kicker'>What gets logged</p>
            <h2>Tracked actions</h2>
            <ul>
              <li>
                <Icon name='shield' size={16} />
                Sign in and sign out
              </li>
              <li>
                <Icon name='calendar' size={16} />
                Session requests and confirmed bookings
              </li>
              <li>
                <Icon name='bookmark' size={16} />
                Services saved or removed
              </li>
              <li>
                <Icon name='package' size={16} />
                Offers published from your profile
              </li>
              <li>
                <Icon name='user' size={16} />
                Profile and account changes
              </li>
            </ul>
            <p className='activity-legend__note'>
              <Icon name='shield' size={14} />
              Your log is private to this demo account and is cleared when you
              reset demo data from Profile.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
