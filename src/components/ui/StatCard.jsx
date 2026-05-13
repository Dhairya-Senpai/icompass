import { cn } from '@/utils/cn'

export function StatCard({ label, value, sub, className }) {
  return (
    <div className={cn('bg-gray-50 rounded-lg p-4', className)}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 leading-none">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}