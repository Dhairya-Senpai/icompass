import { cn } from '@/utils/cn'

const VARIANTS = {
  green:  'bg-green-100 text-green-800',
  amber:  'bg-amber-100 text-amber-800',
  red:    'bg-red-100 text-red-800',
  blue:   'bg-blue-100 text-blue-800',
  gray:   'bg-gray-100 text-gray-600',
  teal:   'bg-teal-100 text-teal-800',
  purple: 'bg-purple-100 text-purple-800',
}

export function Badge({ variant = 'gray', children, className }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', VARIANTS[variant], className)}>
      {children}
    </span>
  )
}
