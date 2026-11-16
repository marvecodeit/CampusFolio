import { activityDayLabel, formatActivityTime } from '../demo'
import type { ActivityEntry, ActivityKind } from '../demo'
import { Icon } from '../icons'
import type { IconName } from '../icons'

const activityMeta: Record<
  ActivityKind,
  { icon: IconName; label: string; tone: string }
> = {
  auth: { icon: 'shield', label: 'Account access', tone: 'plum' },
  account: { icon: 'user', label: 'Profile', tone: 'sky' },
  service: { icon: 'package', label: 'Offer', tone: 'sage' },
  booking: { icon: 'calendar', label: 'Booking', tone: 'lilac' },
  saved: { icon: 'bookmark', label: 'Saved', tone: 'sky' },
  system: { icon: 'activity', label: 'System', tone: 'plum' },
}

function ActivityRow({ entry }: { entry: ActivityEntry }) {
  const meta = activityMeta[entry.kind]

  return (
    <li className='activity-item'>
      <span className={`activity-item__icon activity-item__icon--${meta.tone}`}>
        <Icon name={meta.icon} size={17} />
      </span>
      <div className='activity-item__body'>
        <div className='activity-item__head'>
          <strong>{entry.title}</strong>
          <time dateTime={entry.at}>{formatActivityTime(entry.at)}</time>
        </div>
        <p>{entry.detail}</p>
        <span className='activity-item__kind'>{meta.label}</span>
      </div>
    </li>
  )
}

export function ActivityFeed({
  entries,
  grouped = true,
}: {
  entries: ActivityEntry[]
  grouped?: boolean
}) {
  if (entries.length === 0) {
    return (
      <div className='activity-empty'>
        <span className='activity-empty__icon'>
          <Icon name='activity' size={22} />
        </span>
        <h3>No activity yet</h3>
        <p>Your bookings, saves and account updates will appear here.</p>
      </div>
    )
  }

  if (!grouped) {
    return (
      <ol className='activity-feed'>
        {entries.map((entry) => (
          <ActivityRow entry={entry} key={entry.id} />
        ))}
      </ol>
    )
  }

  const groups = entries.reduce<{ label: string; items: ActivityEntry[] }[]>(
    (acc, entry) => {
      const label = activityDayLabel(entry.at)
      const last = acc[acc.length - 1]
      if (last && last.label === label) {
        last.items.push(entry)
      } else {
        acc.push({ label, items: [entry] })
      }
      return acc
    },
    [],
  )

  return (
    <div className='activity-groups'>
      {groups.map((group) => (
        <section className='activity-group' key={group.label}>
          <h3 className='activity-group__label'>{group.label}</h3>
          <ol className='activity-feed'>
            {group.items.map((entry) => (
              <ActivityRow entry={entry} key={entry.id} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
