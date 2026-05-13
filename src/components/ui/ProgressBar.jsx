import { cn } from '@/utils/cn'

export function ProgressBar({ value, max, color = 'blue', showLabel = true, className }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const colorMap = { blue: 'bg-blue-500', teal: 'bg-teal-500', amber: 'bg-amber-500', red: 'bg-red-500', green: 'bg-green-500' }
  const barColor = pct >= 100 ? 'bg-teal-500' : (colorMap[color] ?? 'bg-blue-500')
  return (
    <div className={cn('', className)}>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-300', barColor)} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-400 mt-1">{value} / {max} ({pct}%)</p>
      )}
    </div>
  )
}

export function StatCard({ label, value, sub, className }) {
  return (
    <div className={cn('bg-gray-50 rounded-lg p-4', className)}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 leading-none">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

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

export function Spinner({ className }) {
  return <i className={cn('ti ti-loader-2 animate-spin text-gray-400', className)} aria-hidden="true" />
}
