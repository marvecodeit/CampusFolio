import type { ReactNode } from 'react'

export function Avatar({
  initials,
  tint,
  small = false,
}: {
  initials: string
  tint: string
  small?: boolean
}) {
  return (
    <span
      aria-hidden='true'
      className={`avatar avatar--${tint}${small ? ' avatar--sm' : ''}`}
    >
      {initials}
    </span>
  )
}

export function AvatarButton({
  initials,
  tint,
  label,
  onClick,
  children,
}: {
  initials: string
  tint: string
  label: string
  onClick: () => void
  children?: ReactNode
}) {
  return (
    <button
      aria-label={label}
      className='profile-button'
      onClick={onClick}
      type='button'
    >
      <Avatar initials={initials} small tint={tint} />
      {children}
    </button>
  )
}
