import { useStore } from '@/store'
import { ROLES } from '@/config/roles'
import { ParticipantDashboard } from './ParticipantDashboard'
import { InstructorDashboard } from './InstructorDashboard'
import { AdminDashboard } from './AdminDashboard'

export function Dashboard() {
  const role = useStore(s => s.role)
  if (role === ROLES.PARTICIPANT) return <ParticipantDashboard />
  if (role === ROLES.INSTRUCTOR) return <InstructorDashboard />
  return <AdminDashboard />
}
