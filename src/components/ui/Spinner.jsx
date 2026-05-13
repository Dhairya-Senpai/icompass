import { cn } from '@/utils/cn'

export function Spinner({ className }) {
  return <i className={cn('ti ti-loader-2 animate-spin text-gray-400', className)} aria-hidden="true" />
}