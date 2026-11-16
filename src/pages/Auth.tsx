import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { Brand } from '../components/Brand'
import { DEMO_EMAIL, DEMO_PASSWORD, demoSignup } from '../demo'
import { Icon } from '../icons'

type SignupState = typeof demoSignup & { confirm: string }

function passwordToggle(
  visible: boolean,
  onToggle: () => void,
  label: string,
) {
  return (
    <button
      aria-label={label}
      className='password-toggle'
      onClick={onToggle}
      type='button'
    >
      <Icon name={visible ? 'eye-off' : 'eye'} size={17} />
    </button>
  )
}

export default function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState<SignupState>({
    ...demoSignup,
    confirm: demoSignup.password,
  })
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [accepted, setAccepted] = useState(true)

  const from =
    (location.state as { from?: string } | null)?.from ?? '/dashboard'

  if (user) {
    return <Navigate replace to='/dashboard' />
  }

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const result = signIn(email, password)
    if (!result.ok) {
      setError(result.error ?? 'Unable to sign in.')
      return
    }

    navigate(from, { replace: true })
  }

  const handleSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (form.password !== form.confirm) {
      setError('Your passwords do not match yet.')
      return
    }

    if (!accepted) {
      setError('Accept the campus guidelines to create your account.')
      return
    }

    const result = signUp({
      name: form.name,
      email: form.email,
      dept: form.dept,
      level: form.level,
      password: form.password,
    })

    if (!result.ok) {
      setError(result.error ?? 'Unable to create your account.')
      return
    }

    navigate('/dashboard', { replace: true })
  }

  const fillDemo = () => {
    setError(null)
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setShowPassword(false)
  }

  const fillSignupDemo = () => {
    setError(null)
    setForm({ ...demoSignup, confirm: demoSignup.password })
    setAccepted(true)
  }

  const update = (key: keyof SignupState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className='auth-page'>
      <aside className='auth-aside'>
        <Link aria-label='Campus Folio home' className='auth-aside__brand' to='/'>
          <Brand subtitle='Anchor University Lagos' />
        </Link>

        <div className='auth-aside__body'>
          <p className='section-kicker'>Built for Anchor campus</p>
          <h1>
            One folio for everything you do
            <em> outside the lecture hall.</em>
          </h1>
          <p>
            Book verified student help, offer your own skills and keep your
            whole campus schedule in one clean dashboard.
          </p>

          <ul className='auth-points'>
            <li>
              <span>
                <Icon name='badge-check' size={16} />
              </span>
              Verified Anchor students only
            </li>
            <li>
              <span>
                <Icon name='calendar' size={16} />
              </span>
              Bookings, offers and saves in one place
            </li>
            <li>
              <span>
                <Icon name='activity' size={16} />
              </span>
              A full activity log, updated as you go
            </li>
          </ul>
        </div>

        <figure className='auth-aside__quote'>
          <blockquote>
            I found a calculus tutor between lectures and had the session
            confirmed before my next class.
          </blockquote>
          <figcaption>
            <strong>Chidera Okonkwo</strong>
            <span>300L Mathematics · Campus tutor</span>
          </figcaption>
        </figure>
      </aside>

      <main className='auth-main'>
        <div className='auth-card'>
          <div className='auth-card__head'>
            <p className='section-kicker'>
              {mode === 'login' ? 'Welcome back' : 'Join Campus Folio'}
            </p>
            <h2>
              {mode === 'login'
                ? 'Log in to your folio.'
                : 'Create your student folio.'}
            </h2>
            <p>
              {mode === 'login'
                ? 'Pick up your bookings, saved services and activity right where you left them.'
                : 'Your account comes loaded with demo data so you can explore every route immediately.'}
            </p>
          </div>

          {mode === 'login' ? (
            <div className='demo-box'>
              <div className='demo-box__head'>
                <span>
                  <Icon name='sparkles' size={15} />
                  Demo account
                </span>
                <span className='demo-box__status'>Ready</span>
              </div>
              <dl>
                <div>
                  <dt>Email</dt>
                  <dd>{DEMO_EMAIL}</dd>
                </div>
                <div>
                  <dt>Password</dt>
                  <dd>{DEMO_PASSWORD}</dd>
                </div>
              </dl>
              <button className='demo-box__fill' onClick={fillDemo} type='button'>
                Use demo credentials
                <Icon name='arrow-right' size={15} />
              </button>
            </div>
          ) : (
            <div className='demo-box demo-box--compact'>
              <div className='demo-box__head'>
                <span>
                  <Icon name='sparkles' size={15} />
                  Demo details are prefilled
                </span>
                <button className='demo-box__link' onClick={fillSignupDemo} type='button'>
                  Reset demo
                </button>
              </div>
              <p>
                The form already contains demo student data. Submit as-is to
                create a working account, or edit any field.
              </p>
            </div>
          )}

          {error && (
            <div className='form-alert' role='alert'>
              <Icon name='x' size={16} />
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form className='auth-form' onSubmit={handleLogin}>
              <label className='field'>
                <span>Email address</span>
                <input
                  autoComplete='email'
                  name='email'
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder='you@student.aul.edu.ng'
                  required
                  type='email'
                  value={email}
                />
              </label>

              <label className='field'>
                <span>Password</span>
                <span className='password-field'>
                  <input
                    autoComplete='current-password'
                    name='password'
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder='Enter your password'
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                  />
                  {passwordToggle(showPassword, () => setShowPassword((v) => !v), showPassword ? 'Hide password' : 'Show password')}
                </span>
              </label>

              <div className='auth-form__row'>
                <label className='check-field'>
                  <input defaultChecked type='checkbox' />
                  <span>Keep me signed in</span>
                </label>
                <button
                  className='text-button'
                  onClick={() =>
                    setError('Password reset is disabled in this demo. Use the demo password above.')
                  }
                  type='button'
                >
                  Forgot password?
                </button>
              </div>

              <button className='btn btn--primary auth-submit' type='submit'>
                Log in
                <Icon name='arrow-right' size={18} />
              </button>
            </form>
          ) : (
            <form className='auth-form' onSubmit={handleSignup}>
              <label className='field'>
                <span>Full name</span>
                <input
                  autoComplete='name'
                  name='name'
                  onChange={(event) => update('name', event.target.value)}
                  placeholder='Your full name'
                  required
                  value={form.name}
                />
              </label>

              <label className='field'>
                <span>Student email</span>
                <input
                  autoComplete='email'
                  name='email'
                  onChange={(event) => update('email', event.target.value)}
                  placeholder='you@student.aul.edu.ng'
                  required
                  type='email'
                  value={form.email}
                />
              </label>

              <div className='field-row'>
                <label className='field'>
                  <span>Department</span>
                  <input
                    name='dept'
                    onChange={(event) => update('dept', event.target.value)}
                    required
                    value={form.dept}
                  />
                </label>
                <label className='field'>
                  <span>Level</span>
                  <select
                    name='level'
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

              <div className='field-row'>
                <label className='field'>
                  <span>Password</span>
                  <span className='password-field'>
                    <input
                      autoComplete='new-password'
                      minLength={8}
                      name='password'
                      onChange={(event) => update('password', event.target.value)}
                      required
                      type={showSignupPassword ? 'text' : 'password'}
                      value={form.password}
                    />
                    {passwordToggle(showSignupPassword, () => setShowSignupPassword((v) => !v), showSignupPassword ? 'Hide password' : 'Show password')}
                  </span>
                </label>
                <label className='field'>
                  <span>Confirm password</span>
                  <input
                    autoComplete='new-password'
                    minLength={8}
                    name='confirm'
                    onChange={(event) => update('confirm', event.target.value)}
                    required
                    type={showSignupPassword ? 'text' : 'password'}
                    value={form.confirm}
                  />
                </label>
              </div>

              <label className='check-field check-field--terms'>
                <input
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                  type='checkbox'
                />
                <span>
                  I agree to the campus guidelines and will keep first meetups
                  in public spaces.
                </span>
              </label>

              <button className='btn btn--primary auth-submit' type='submit'>
                Create my folio
                <Icon name='arrow-right' size={18} />
              </button>
            </form>
          )}

          <p className='auth-switch'>
            {mode === 'login' ? (
              <>
                New to Campus Folio? <Link to='/signup'>Create an account</Link>
              </>
            ) : (
              <>
                Already have a folio? <Link to='/login'>Log in</Link>
              </>
            )}
          </p>
        </div>

        <Link className='auth-back' to='/'>
          <Icon name='arrow-left' size={16} />
          Back to landing page
        </Link>
      </main>
    </div>
  )
}
