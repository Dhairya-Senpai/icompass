import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { ROLES, ROLE_META } from '@/config/roles'
import { APP_CONFIG } from '@/config/env'

export function RolePicker() {
  const setRole  = useStore(s => s.setRole)
  const navigate = useNavigate()

  const select = (role) => {
    setRole(role)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-white mb-2">{APP_CONFIG.name}</h1>
          <p className="text-sm text-white/40">{APP_CONFIG.tagline}</p>
        </div>

        <div className="space-y-2.5">
          {Object.values(ROLES).map(role => {
            const meta = ROLE_META[role]
            return (
              <button
                key={role}
                onClick={() => select(role)}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 hover:border-white/20 hover:translate-x-1 transition-all text-left"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: meta.colorBg }}
                >
                  <i className={`ti ${meta.icon} text-xl`} style={{ color: meta.color }} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{meta.label}</p>
                  <p className="text-xs text-white/40 mt-0.5">{meta.description}</p>
                </div>
                <i className="ti ti-arrow-right text-white/25 text-base flex-shrink-0" aria-hidden="true" />
              </button>
            )
          })}
        </div>

        <p className="text-center text-xs text-white/20 mt-8">
          Data stored locally in your browser · No backend required
        </p>
      </div>
    </div>
  )
}
