import type { ReactNode } from 'react'

export type IconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'badge-check'
  | 'bell'
  | 'book'
  | 'bookmark'
  | 'calendar'
  | 'check'
  | 'chevron-down'
  | 'clock'
  | 'code'
  | 'compass'
  | 'grid'
  | 'home'
  | 'map-pin'
  | 'message'
  | 'music'
  | 'package'
  | 'palette'
  | 'pen'
  | 'plus'
  | 'search'
  | 'shield'
  | 'sliders'
  | 'star'
  | 'user'
  | 'x'

const paths: Record<IconName, ReactNode> = {
  'arrow-right': (
    <>
      <path d='M4.5 12h15' />
      <path d='m13.5 6 6 6-6 6' />
    </>
  ),
  'arrow-up-right': (
    <>
      <path d='M7 17 17 7' />
      <path d='M8 7h9v9' />
    </>
  ),
  'badge-check': (
    <>
      <path d='m12 3 2.1 2.1 3-.5.5 3L20 9.7 18.7 12l1.3 2.3-2.4 2.1-.5 3-3-.5L12 21l-2.1-2.1-3 .5-.5-3L4 14.3 5.3 12 4 9.7l2.4-2.1.5-3 3 .5L12 3Z' />
      <path d='m9 12 2 2 4-4' />
    </>
  ),
  bell: (
    <>
      <path d='M18.5 9.5a6.5 6.5 0 1 0-13 0c0 5-2 6.5-2 6.5h17s-2-1.5-2-6.5Z' />
      <path d='M10.2 19a2 2 0 0 0 3.6 0' />
    </>
  ),
  book: (
    <>
      <path d='M4.5 5.5A2.5 2.5 0 0 1 7 3h12.5v15.5H7a2.5 2.5 0 0 0-2.5 2.5V5.5Z' />
      <path d='M4.5 18.5A2.5 2.5 0 0 1 7 16h12.5' />
      <path d='M8.5 7.5h7' />
    </>
  ),
  bookmark: <path d='M6.5 4.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1V21l-5.5-4L6.5 21V4.5Z' />,
  calendar: (
    <>
      <rect x='3.5' y='5' width='17' height='15.5' rx='2.5' />
      <path d='M8 3v4M16 3v4M3.5 10h17' />
    </>
  ),
  check: <path d='m5 12.5 4.5 4.5L19 6.5' />,
  'chevron-down': <path d='m6 9.5 6 6 6-6' />,
  clock: (
    <>
      <circle cx='12' cy='12' r='8.5' />
      <path d='M12 7.5V12l3 2' />
    </>
  ),
  code: (
    <>
      <path d='m8 8.5-4 3.5 4 3.5' />
      <path d='m16 8.5 4 3.5-4 3.5' />
      <path d='m13.5 5-3 14' />
    </>
  ),
  compass: (
    <>
      <circle cx='12' cy='12' r='8.5' />
      <path d='m15.5 8.5-2 5-5 2 2-5 5-2Z' />
    </>
  ),
  grid: (
    <>
      <rect x='3.5' y='3.5' width='7' height='7' rx='2' />
      <rect x='13.5' y='3.5' width='7' height='7' rx='2' />
      <rect x='3.5' y='13.5' width='7' height='7' rx='2' />
      <rect x='13.5' y='13.5' width='7' height='7' rx='2' />
    </>
  ),
  home: (
    <>
      <path d='m4 10.5 8-7 8 7V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-9.5Z' />
    </>
  ),
  'map-pin': (
    <>
      <path d='M19 10c0 5.5-7 11-7 11S5 15.5 5 10a7 7 0 1 1 14 0Z' />
      <circle cx='12' cy='10' r='2.5' />
    </>
  ),
  message: <path d='M20.5 11.5a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1.4-4.7A8.5 8.5 0 1 1 20.5 11.5Z' />,
  music: (
    <>
      <path d='M9 18V5.5l10-2V16' />
      <circle cx='6.5' cy='18' r='2.5' />
      <circle cx='16.5' cy='16' r='2.5' />
    </>
  ),
  package: (
    <>
      <path d='m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z' />
      <path d='m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9' />
    </>
  ),
  palette: (
    <>
      <path d='M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 2-.8 2-1.8 0-1.4-1.2-1.9-1.2-3 0-1 .8-1.7 1.9-1.7h2.1a3.7 3.7 0 0 0 3.7-3.7C20.5 6.2 16.7 3.5 12 3.5Z' />
      <circle cx='8' cy='9' r='.9' fill='currentColor' stroke='none' />
      <circle cx='12' cy='7' r='.9' fill='currentColor' stroke='none' />
      <circle cx='7' cy='13.5' r='.9' fill='currentColor' stroke='none' />
    </>
  ),
  pen: (
    <>
      <path d='M14.5 4.5 19.5 9.5 8 21H3.5v-4.5l11-12Z' />
      <path d='m12.5 6.5 5 5' />
    </>
  ),
  plus: <path d='M12 4.5v15M4.5 12h15' />,
  search: (
    <>
      <circle cx='10.5' cy='10.5' r='6.5' />
      <path d='m15.5 15.5 5 5' />
    </>
  ),
  shield: (
    <>
      <path d='M12 3 5 6v5c0 4.6 3 8.1 7 10 4-1.9 7-5.4 7-10V6l-7-3Z' />
      <path d='m9 12 2 2 4-4' />
    </>
  ),
  sliders: (
    <>
      <path d='M4 7h9M17 7h3M4 17h3M11 17h9' />
      <circle cx='15' cy='7' r='2' />
      <circle cx='9' cy='17' r='2' />
    </>
  ),
  star: <path d='m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L3.6 9.8l6.5-.9L12 3Z' fill='currentColor' stroke='none' />,
  user: (
    <>
      <circle cx='12' cy='8' r='4' />
      <path d='M4.5 21a7.5 7.5 0 0 1 15 0' />
    </>
  ),
  x: <path d='m6 6 12 12M18 6 6 18' />,
}

interface IconProps {
  name: IconName
  size?: number
  strokeWidth?: number
  className?: string
}

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.7,
  className,
}: IconProps) {
  const filled = name === 'star'

  return (
    <svg
      aria-hidden='true'
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      height={size}
      stroke={filled ? 'none' : 'currentColor'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
      viewBox='0 0 24 24'
      width={size}
    >
      {paths[name]}
    </svg>
  )
}
