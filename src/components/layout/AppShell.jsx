import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

const TITLES = {
  '/dashboard':     'Dashboard',
  '/interviews':    'Interviews',
  '/courses':       'Learning center',
  '/ai/hypothesis': 'Hypothesis AI',
  '/ai/analysis':   'Interview analysis',
  '/teams':         'Teams',
  '/settings':      'Settings',
}

export function AppShell() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? 'icompass Platform'

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
