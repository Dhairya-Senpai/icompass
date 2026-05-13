import { NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { ROLE_NAV, ROLE_META } from '@/config/roles'
import { FEATURES } from '@/config/env'
import { APP_CONFIG } from '@/config/env'
import { cn } from '@/utils/cn'

export function Sidebar() {
  const role = useStore(s => s.role)
  const clearRole = useStore(s => s.clearRole)
  const unread = useStore(s => s.getUnreadCount())
  const navigate = useNavigate()

  const meta = ROLE_META[role]
  const navItems = (ROLE_NAV[role] ?? []).filter(item => {
    if (!item.featureFlag) return true
    return FEATURES[item.featureFlag] !== false
  })

  const handleSwitchRole = () => {
    clearRole()
    navigate('/')
  }

  return (
    <aside className="w-[220px] min-w-[220px] bg-[#0a1628] flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 border-b border-white/[0.07]">
        <h1 className="font-serif text-xl text-white leading-tight">{APP_CONFIG.name}</h1>
        <span className="text-[11px] text-white/40 tracking-widest uppercase mt-1 block">{APP_CONFIG.tagline}</span>
      </div>

      {/* Role switcher */}
      <button
        onClick={handleSwitchRole}
        className="mx-3 mt-3 mb-1 flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-white/10 transition-colors text-left"
      >
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta?.color }} />
        <div className="min-w-0">
          <div className="text-xs font-medium text-white/85 truncate">{meta?.label}</div>
          <div className="text-[10px] text-white/40 mt-0.5">Switch role</div>
        </div>
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pt-2 pb-4">
        <p className="text-[10px] text-white/30 tracking-widest uppercase px-2 pt-3 pb-1.5">Navigation</p>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all mb-0.5',
              isActive
                ? 'bg-blue-600 text-white font-medium'
                : 'text-white/55 hover:text-white/85 hover:bg-white/[0.07]',
            )}
          >
            <i className={cn('ti', item.icon, 'text-base flex-shrink-0')} aria-hidden="true" />
            <span className="flex-1">{item.label}</span>
            {item.path === '/dashboard' && unread > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                {unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
