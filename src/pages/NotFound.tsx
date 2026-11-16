import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { Icon } from '../icons'

export default function NotFoundPage() {
  return (
    <div className='not-found'>
      <Brand subtitle='Anchor University Lagos' />
      <div className='not-found__body'>
        <p className='section-kicker'>404 · Off the map</p>
        <h1>This page is not on campus.</h1>
        <p>
          The route you followed does not exist. Head back to the landing page or
          open your dashboard.
        </p>
        <div className='hero__actions'>
          <Link className='btn btn--primary' to='/'>
            Back to landing
            <Icon name='arrow-left' size={17} />
          </Link>
          <Link className='btn btn--ghost' to='/dashboard'>
            Open dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
