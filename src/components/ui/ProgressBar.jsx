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