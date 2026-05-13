import { useStore } from '@/store'
import { cn } from '@/utils/cn'

export function TopBar({ title }) {
  const unread = useStore(s => s.getUnreadCount())
  const markAllRead = useStore(s => s.markAllRead)

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6 gap-4 flex-shrink-0">
      <h2 className="text-sm font-medium text-gray-800 flex-1">{title}</h2>

      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 h-8 w-48">
        <i className="ti ti-search text-gray-400 text-sm" aria-hidden="true" />
        <input placeholder="Search…" className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none flex-1" />
      </div>

      <button
        onClick={markAllRead}
        className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
      >
        <i className="ti ti-bell text-gray-500 text-base" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-white" aria-hidden="true" />
        )}
      </button>

      <button
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="User profile"
      >
        <i className="ti ti-user text-gray-500 text-base" aria-hidden="true" />
      </button>
    </header>
  )
}
