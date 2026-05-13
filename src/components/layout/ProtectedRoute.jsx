import { Navigate, useLocation } from 'react-router-dom'
import { useStore } from '@/store'
import { canAccess } from '@/config/roles'

/**
 * Redirects unauthenticated users to the role picker,
 * and blocks paths the user's role cannot access.
 */
export function ProtectedRoute({ children }) {
  const role = useStore(s => s.role)
  const { pathname } = useLocation()

  if (!role) return <Navigate to="/" replace />
  if (!canAccess(role, pathname)) return <Navigate to="/dashboard" replace />

  return children
}
