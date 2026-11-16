import { Link } from 'react-router-dom'
import { Brand, BrandMark } from '../components/Brand'
import { Avatar } from '../components/Avatar'
import { categories, services } from '../data'
import type { IconName } from '../icons'
import { Icon } from '../icons'

const stats = [
  { value: '2,400+', label: 'students on campus' },
  { value: '380', label: 'live student offers' },
  { value: '4.9/5', label: 'average session rating' },
  { value: '12 min', label: 'median reply time' },
]

const features: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'badge-check',
    title: 'Verified students only',
    body: 'Every provider is checked against the Anchor University registry before their first listing goes live.',
  },
  {
    icon: 'calendar',
    title: 'Book in under a minute',
    body: 'Pick a slot, confirm the meeting point and get a reply fast. No long back-and-forth before every session.',
  },
  {
    icon: 'shield',
    title: 'Campus-safe meetups',
    body: 'First sessions happen in public campus spaces. Your safety promise is built into every booking.',
  },
  {
    icon: 'wallet',
    title: 'Student-friendly prices',
    body: 'Set your own rates, pay after confirmation, and keep every naira inside the campus community.',
  },
  {
    icon: 'users',
    title: 'Built around your department',
    body: 'Find help from the people who already aced the exact course, project or portfolio review you need.',
  },
  {
    icon: 'activity',
    title: 'Every action logged',
    body: 'Bookings, saves, offers and profile changes land in one activity timeline you can always check.',
  },
]

const categoryCopy: Record<string, string> = {
  Academics: 'Tutoring, past questions and exam prep',
  Design: 'Portfolios, posters and brand work',
  Tech: 'Debugging, builds and tech support',
  Writing: 'CVs, essays and applications',
  Errands: 'Laundry, pickups and campus runs',
  Music: 'Lessons, practice and chapel teams',
}

const steps = [
  {
    number: '01',
    title: 'Create your student profile',
    body: 'Sign up with your campus email, department and level. Your folio is ready in under a minute.',
  },
  {
    number: '02',
    title: 'Find help or offer a skill',
    body: 'Browse verified student services, save what fits, or publish your own offer at a price you choose.',
  },
  {
    number: '03',
    title: 'Book, meet and track it',
    body: 'Request a session, meet in a public campus space and watch every update land in your activity log.',
  },
]

export default function LandingPage() {
  const categoryCounts = categories
    .filter((category) => category.name !== 'All')
    .map((category) => ({
      ...category,
      count: services.filter((service) => service.category === category.name)
        .length,
    }))

  return (
    <div className='landing'>
      <a className='skip-link' href='#main'>
        Skip to content
      </a>

      <header className='landing-header'>
        <div className='landing-header__inner'>
          <Brand subtitle='Anchor University Lagos' />

          <nav aria-label='Primary' className='landing-nav'>
            <a href='#features'>Why Folio</a>
            <a href='#categories'>Categories</a>
            <a href='#how'>How it works</a>
            <a href='#safety'>Safety</a>
          </nav>

          <div className='landing-header__actions'>
            <Link className='landing-login' to='/login'>
              Log in
            </Link>
            <Link className='btn btn--primary btn--small' to='/signup'>
              Get started
              <Icon name='arrow-right' size={16} />
            </Link>
          </div>
        </div>
      </header>

      <main id='main'>
        <section className='landing-hero'>
          <div className='landing-hero__copy'>
            <p className='hero__eyebrow'>
              <span className='status-dot' />
              Anchor University Lagos
              <span className='hero__divider' />
              Student marketplace
            </p>

            <h1>
              Your campus,
              <br />
              <em>in one folio.</em>
            </h1>

            <p className='landing-hero__lede'>
              Find trusted student tutors, designers, builders and everyday
              helpers. Book in minutes, meet on campus and keep every session in
              one tidy folio.
            </p>

            <div className='hero__actions'>
              <Link className='btn btn--primary' to='/signup'>
                Create free account
                <Icon name='arrow-right' size={18} />
              </Link>
              <Link className='btn btn--ghost' to='/login'>
                <Icon name='log-out' size={17} />
                Log in to demo
              </Link>
            </div>

            <div className='trust-row'>
              <span>
                <Icon name='shield' size={16} />
                Verified students
              </span>
              <span>
                <Icon name='clock' size={16} />
                Replies in ~12 min
              </span>
              <span>
                <Icon name='map-pin' size={16} />
                Campus-only meetups
              </span>
            </div>

            <div className='landing-demo-note'>
              <span className='landing-demo-note__icon'>
                <Icon name='sparkles' size={16} />
              </span>
              <p>
                <strong>Demo ready.</strong> Log in with{' '}
                <code>damilare@student.aul.edu.ng</code> and{' '}
                <code>campus1234</code>.
              </p>
            </div>
          </div>

          <div className='landing-hero__visual'>
            <span aria-hidden='true' className='landing-orb' />
            <span aria-hidden='true' className='landing-grid' />

            <article className='folio-preview'>
              <div className='folio-preview__top'>
                <BrandMark small />
                <div>
                  <strong>Your campus folio</strong>
                  <small>Tuesday · Main Campus</small>
                </div>
                <span className='live-pill'>
                  <span />
                  Live
                </span>
              </div>

              <div className='folio-preview__next'>
                <p className='section-kicker'>Next up</p>
                <h2>Calculus II with Chidera</h2>
                <div className='folio-preview__person'>
                  <Avatar initials='CO' tint='plum' />
                  <div>
                    <strong>
                      Chidera Okonkwo
                      <Icon name='badge-check' size={13} />
                    </strong>
                    <small>300L · Mathematics</small>
                  </div>
                  <span className='folio-preview__rating'>
                    <Icon name='star' size={12} />4.9
                  </span>
                </div>
                <div className='folio-preview__meta'>
                  <span>
                    <Icon name='clock' size={14} />
                    Today · 3:00 PM
                  </span>
                  <span>
                    <Icon name='map-pin' size={14} />
                    Cafeteria
                  </span>
                </div>
              </div>

              <div className='folio-preview__activity'>
                <div>
                  <span className='preview-dot preview-dot--sky' />
                  <p>
                    <strong>Zainab</strong> accepted your portfolio review
                  </p>
                  <small>2m</small>
                </div>
                <div>
                  <span className='preview-dot preview-dot--plum' />
                  <p>
                    <strong>Favour</strong> sent a CV draft to review
                  </p>
                  <small>1h</small>
                </div>
                <div>
                  <span className='preview-dot preview-dot--sage' />
                  <p>Your CSC 102 clinic went live</p>
                  <small>6h</small>
                </div>
              </div>

              <div className='folio-preview__foot'>
                <Icon name='shield' size={14} />
                Verified students · Public campus meetups
              </div>
            </article>

            <div className='float-card float-card--rating'>
              <span className='float-card__icon float-card__icon--plum'>
                <Icon name='star' size={16} />
              </span>
              <div>
                <strong>4.9 average</strong>
                <small>from 212 campus reviews</small>
              </div>
            </div>

            <div className='float-card float-card--online'>
              <span className='float-card__icon float-card__icon--sky'>
                <Icon name='users' size={16} />
              </span>
              <div>
                <strong>248 students</strong>
                <small>online on campus now</small>
              </div>
            </div>
          </div>
        </section>

        <section aria-label='Campus Folio at a glance' className='landing-stats'>
          {stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className='landing-section' id='features'>
          <div className='landing-section__head'>
            <p className='section-kicker'>Why Campus Folio</p>
            <h2>
              Campus life is busy enough.
              <br />
              <em>Your side hustle should feel simple.</em>
            </h2>
            <p>
              One place for the skills, help and small services that keep Anchor
              moving — with trust, safety and a paper trail built in.
            </p>
          </div>

          <div className='feature-grid'>
            {features.map((feature) => (
              <article className='feature-card' key={feature.title}>
                <span className='feature-card__icon'>
                  <Icon name={feature.icon} size={20} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className='landing-section landing-section--tint' id='categories'>
          <div className='landing-section__head landing-section__head--row'>
            <div>
              <p className='section-kicker'>What moves on campus</p>
              <h2>Six categories. One student economy.</h2>
            </div>
            <Link className='btn btn--ghost btn--small' to='/signup'>
              Browse after signup
              <Icon name='arrow-up-right' size={16} />
            </Link>
          </div>

          <div className='landing-categories'>
            {categoryCounts.map((category) => (
              <Link
                className='landing-category'
                key={category.name}
                to='/signup'
              >
                <span className='landing-category__icon'>
                  <Icon name={category.icon} size={20} />
                </span>
                <strong>{category.name}</strong>
                <p>{categoryCopy[category.name]}</p>
                <span className='landing-category__count'>
                  {category.count} live offers
                  <Icon name='arrow-up-right' size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className='landing-section' id='how'>
          <div className='landing-section__head'>
            <p className='section-kicker'>How it works</p>
            <h2>From hello to booked in three steps.</h2>
          </div>

          <div className='steps-grid'>
            {steps.map((step) => (
              <article className='step-card' key={step.number}>
                <span className='step-card__number'>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>

          <div className='landing-safety' id='safety'>
            <span className='landing-safety__icon'>
              <Icon name='shield' size={22} />
            </span>
            <div>
              <p className='section-kicker'>The campus promise</p>
              <h3>Real students. Public spaces. Zero shortcuts.</h3>
              <p>
                Every meetup starts in a public campus space, every provider is
                verified, and your full activity history stays available from
                your dashboard.
              </p>
            </div>
            <Link className='btn btn--soft btn--small' to='/signup'>
              Join the community
              <Icon name='arrow-right' size={16} />
            </Link>
          </div>
        </section>

        <section className='landing-quote'>
          <div className='landing-quote__mark' aria-hidden='true'>
            &ldquo;
          </div>
          <blockquote>
            Campus Folio turned my scattered WhatsApp bookings into one clean
            schedule. I know who I&rsquo;m meeting, where, and when — and my
            activity log keeps every update in one place.
          </blockquote>
          <div className='landing-quote__person'>
            <Avatar initials='CO' tint='plum' />
            <div>
              <strong>Chidera Okonkwo</strong>
              <small>300L Mathematics · Campus tutor</small>
            </div>
            <span className='landing-quote__stars'>
              <Icon name='star' size={13} />
              <Icon name='star' size={13} />
              <Icon name='star' size={13} />
              <Icon name='star' size={13} />
              <Icon name='star' size={13} />
            </span>
          </div>
        </section>

        <section className='landing-cta'>
          <div>
            <p className='section-kicker'>Your folio is waiting</p>
            <h2>Make campus work for you.</h2>
            <p>
              Join 2,400+ Anchor students buying, selling and booking real skills
              on campus. The demo account is already loaded with activity.
            </p>
          </div>
          <div className='landing-cta__actions'>
            <Link className='btn btn--primary' to='/signup'>
              Create free account
              <Icon name='arrow-right' size={18} />
            </Link>
            <Link className='btn btn--ghost' to='/login'>
              Log in to demo
            </Link>
          </div>
        </section>
      </main>

      <footer className='landing-footer'>
        <div className='landing-footer__top'>
          <div className='landing-footer__brand'>
            <Brand subtitle='Anchor University Lagos' />
            <p>
              The student services marketplace for Anchor University Lagos.
              Built for real skills, student prices and safe campus meetups.
            </p>
          </div>

          <div className='landing-footer__links'>
            <div>
              <strong>Product</strong>
              <a href='#features'>Why Folio</a>
              <a href='#categories'>Categories</a>
              <a href='#how'>How it works</a>
            </div>
            <div>
              <strong>Account</strong>
              <Link to='/login'>Log in</Link>
              <Link to='/signup'>Create account</Link>
              <Link to='/dashboard'>Dashboard</Link>
            </div>
            <div>
              <strong>Campus</strong>
              <a href='#safety'>Safety promise</a>
              <a href='#how'>Support</a>
              <a href='#main'>Back to top</a>
            </div>
          </div>
        </div>

        <div className='landing-footer__bottom'>
          <span>© 2026 Campus Folio · Anchor University Lagos</span>
          <span>Contributors: Onyema Marvellous &amp; Claude</span>
        </div>
      </footer>
    </div>
  )
}
