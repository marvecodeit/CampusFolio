import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { useMarketplace } from '../marketplace'
import { useToast } from '../toast'
import { Brand } from '../components/Brand'
import { Avatar } from '../components/Avatar'
import { Icon } from '../icons'
import type { IconName } from '../icons'

interface NavItem {
  to: string
  label: string
  icon: IconName
  end?: boolean
  badge?: number
}

export default function DashboardLayout() {
  const { user, signOut } = useAuth()
  const { savedIds } = useMarketplace()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  if (!user) return null

  const navItems: NavItem[] = [
    { to: '/dashboard', label: 'Overview', icon: 'grid', end: true },
    { to: '/dashboard/explore', label: 'Explore services', icon: 'compass' },
    {
      to: '/dashboard/saved',
      label: 'Saved',
      icon: 'bookmark',
      badge: savedIds.size,
    },
    { to: '/dashboard/offers', label: 'My offers', icon: 'package' },
    { to: '/dashboard/activity', label: 'Activity log', icon: 'activity' },
    { to: '/dashboard/profile', label: 'Profile', icon: 'user' },
  ]

  const activeItem =
    navItems.find((item) =>
      item.end
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to),
    ) ?? navItems[0]

  const handleSignOut = () => {
    signOut()
    showToast('Signed out. Your activity log is saved for next time.')
    navigate('/login', { replace: true })
  }

  return (
    <div className='dash'>
      <aside className='dash-sidebar'>
        <div className='dash-sidebar__head'>
          <Brand subtitle='Student workspace' to='/dashboard' />
        </div>

        <nav aria-label='Dashboard' className='dash-nav'>
          <p className='dash-nav__label'>Workspace</p>
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `dash-nav__link${isActive ? ' is-active' : ''}`
              }
              end={item.end}
              key={item.to}
              to={item.to}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
              {item.badge ? (
                <span className='dash-nav__badge'>{item.badge}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className='dash-sidebar__foot'>
          <div className='dash-campus-card'>
            <span className='dash-campus-card__icon'>
              <Icon name='map-pin' size={16} />
            </span>
            <div>
              <strong>Main Campus</strong>
              <small>Anchor University · Lagos</small>
            </div>
          </div>

          <div className='dash-user-card'>
            <Avatar initials={user.initials} tint='plum' small />
            <div>
              <strong>{user.name}</strong>
              <small>
                {user.level} · {user.dept}
              </small>
            </div>
            <button
              aria-label='Sign out'
              className='dash-user-card__logout'
              onClick={handleSignOut}
              title='Sign out'
              type='button'
            >
              <Icon name='log-out' size={17} />
            </button>
          </div>
        </div>
      </aside>

      <div className='dash-main'>
        <header className='dash-topbar'>
          <div className='dash-crumb'>
            <span>Workspace</span>
            <Icon name='chevron-down' size={13} />
            <strong>{activeItem.label}</strong>
          </div>

          <div className='dash-topbar__actions'>
            <span className='dash-campus-pill'>
              <Icon name='map-pin' size={14} />
              Main Campus
            </span>

            <button
              aria-label='Notifications'
              className='icon-button notification-button'
              onClick={() =>
                showToast('You are all caught up. No new notifications.')
              }
              type='button'
            >
              <Icon name='bell' size={18} />
              <span className='unread-dot' />
            </button>

            <button
              aria-label='Sign out'
              className='dash-mobile-logout'
              onClick={handleSignOut}
              title='Sign out'
              type='button'
            >
              <Icon name='log-out' size={16} />
            </button>

            <NavLink className='dash-profile' to='/dashboard/profile'>
              <Avatar initials={user.initials} small tint='plum' />
              <span>
                <strong>{user.firstName}</strong>
                <small>{user.level}</small>
              </span>
            </NavLink>
          </div>
        </header>

        <main className='dash-content'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
