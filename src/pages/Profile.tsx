import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { useMarketplace } from '../marketplace'
import { useToast } from '../toast'
import { Avatar } from '../components/Avatar'
import { Icon } from '../icons'

export default function ProfilePage() {
  const { user, activities, updateProfile, resetDemoData } = useAuth()
  const { offers, savedIds } = useMarketplace()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    dept: user?.dept ?? '',
    level: user?.level ?? '300L',
    campus: user?.campus ?? 'Main Campus',
    bio: user?.bio ?? '',
  })

  if (!user) return null

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateProfile(form)
    showToast('Profile saved. The update is on your activity log.')
  }

  const handleReset = () => {
    const confirmed = window.confirm(
      'Reset all demo data? This clears your profile, offers, saves and activity log, then signs you out.',
    )
    if (!confirmed) return

    resetDemoData()
    showToast('Demo data reset. Log in again to start fresh.')
    navigate('/login', { replace: true })
  }

  return (
    <div className='dash-page'>
      <header className='dash-page__head'>
        <div>
          <p className='section-kicker'>Account</p>
          <h1>Your student profile</h1>
          <p>
            Keep your department, level and contact details current so campus
            bookings run smoothly.
          </p>
        </div>
        <span className='dash-page__badge dash-page__badge--verified'>
          <Icon name='badge-check' size={14} />
          Verified student
        </span>
      </header>

      <section className='profile-identity'>
        <div className='profile-identity__avatar'>
          <Avatar initials={user.initials} tint='plum' />
        </div>
        <div className='profile-identity__body'>
          <h2>{user.name}</h2>
          <p>
            {user.level} · {user.dept}
          </p>
          <div className='profile-identity__chips'>
            <span>
              <Icon name='mail' size={13} />
              {user.email}
            </span>
            <span>
              <Icon name='map-pin' size={13} />
              {user.campus}
            </span>
            <span>
              <Icon name='calendar' size={13} />
              Joined {user.joinedAt}
            </span>
          </div>
        </div>
        <dl className='profile-identity__stats'>
          <div>
            <dt>Saved</dt>
            <dd>{savedIds.size}</dd>
          </div>
          <div>
            <dt>Offers</dt>
            <dd>{offers.length}</dd>
          </div>
          <div>
            <dt>Events</dt>
            <dd>{activities.length}</dd>
          </div>
        </dl>
      </section>

      <div className='profile-layout'>
        <section className='panel'>
          <div className='panel__head'>
            <div>
              <p className='section-kicker'>Editable details</p>
              <h2>Profile information</h2>
            </div>
            <span className='panel__hint'>
              <Icon name='shield' size={14} />
              Private to campus
            </span>
          </div>

          <form className='profile-form' onSubmit={handleSave}>
            <div className='field-row'>
              <label className='field'>
                <span>Full name</span>
                <input
                  onChange={(event) => update('name', event.target.value)}
                  required
                  value={form.name}
                />
              </label>
              <label className='field'>
                <span>Phone</span>
                <input
                  onChange={(event) => update('phone', event.target.value)}
                  placeholder='+234 …'
                  value={form.phone}
                />
              </label>
            </div>

            <label className='field'>
              <span>Student email</span>
              <input disabled type='email' value={user.email} />
            </label>

            <div className='field-row'>
              <label className='field'>
                <span>Department</span>
                <input
                  onChange={(event) => update('dept', event.target.value)}
                  required
                  value={form.dept}
                />
              </label>
              <label className='field'>
                <span>Level</span>
                <select
                  onChange={(event) => update('level', event.target.value)}
                  value={form.level}
                >
                  <option>100L</option>
                  <option>200L</option>
                  <option>300L</option>
                  <option>400L</option>
                  <option>500L</option>
                </select>
              </label>
            </div>

            <label className='field'>
              <span>Campus</span>
              <select
                onChange={(event) => update('campus', event.target.value)}
                value={form.campus}
              >
                <option>Main Campus</option>
                <option>City Campus</option>
                <option>Online</option>
              </select>
            </label>

            <label className='field'>
              <span>
                Bio <em>optional</em>
              </span>
              <textarea
                maxLength={220}
                onChange={(event) => update('bio', event.target.value)}
                rows={3}
                value={form.bio}
              />
            </label>

            <div className='profile-form__actions'>
              <p>
                <Icon name='activity' size={15} />
                Saving a change adds a profile event to your activity log.
              </p>
              <button className='btn btn--primary btn--small' type='submit'>
                Save profile
                <Icon name='check' size={16} />
              </button>
            </div>
          </form>
        </section>

        <aside className='profile-side'>
          <section className='panel'>
            <p className='section-kicker'>Demo controls</p>
            <h2>Reset this workspace</h2>
            <p className='panel__body-copy'>
              Clear the demo profile, offers, saved services and activity log,
              then return to the login screen with fresh seed data.
            </p>
            <button
              className='btn btn--danger btn--small'
              onClick={handleReset}
              type='button'
            >
              <Icon name='x' size={15} />
              Reset demo data
            </button>
          </section>

          <section className='panel profile-safety'>
            <span className='profile-safety__icon'>
              <Icon name='shield' size={20} />
            </span>
            <h2>Campus safety promise</h2>
            <p>
              Keep first meetups in public spaces, confirm prices in chat and
              report anything that feels off to Student Affairs.
            </p>
            <Link className='panel__link' to='/#safety'>
              Read the guidelines
              <Icon name='arrow-up-right' size={14} />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  )
}
