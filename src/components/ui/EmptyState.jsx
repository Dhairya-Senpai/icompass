import { cn } from '@/utils/cn'

export function EmptyState({ icon = 'ti-inbox', title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <i className={cn('ti', icon, 'text-3xl text-gray-300 mb-3')} aria-hidden="true" />
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {description && <p className="text-xs text-gray-400 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}