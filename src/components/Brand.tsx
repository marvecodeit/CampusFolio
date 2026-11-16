import { Link } from 'react-router-dom'

export function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand-mark${small ? ' brand-mark--small' : ''}`}>
      <svg aria-hidden='true' viewBox='0 0 24 24'>
        <path
          d='M6 4.75A1.75 1.75 0 0 1 7.75 3H19v14.5H7.75A1.75 1.75 0 0 0 6 19.25V4.75Z'
          fill='currentColor'
        />
        <path
          d='M8.75 7.25h6.5M8.75 10.25h4.25'
          stroke='#5a2058'
          strokeLinecap='round'
          strokeWidth='1.5'
        />
        <circle cx='18.75' cy='19.25' r='2.25' fill='#1b93d0' />
      </svg>
    </span>
  )
}

export function Brand({
  to = '/',
  subtitle = 'Anchor University · Lagos',
}: {
  to?: string
  subtitle?: string
}) {
  return (
    <Link aria-label='Campus Folio home' className='brand' to={to}>
      <BrandMark />
      <span className='brand-word'>
        <strong>Campus Folio</strong>
        <small>{subtitle}</small>
      </span>
    </Link>
  )
}
