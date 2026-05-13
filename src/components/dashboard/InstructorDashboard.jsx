import { useStore } from '@/store'
import { StatCard, ProgressBar, Card, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'

export function InstructorDashboard() {
  const navigate   = useNavigate()
  const cohort     = useStore(s => s.cohort)
  const teams      = useStore(s => s.teams)
  const interviews = useStore(s => s.interviews)
  const notifs     = useStore(s => s.notifications)
  const goal       = cohort.interviewGoal

  const onTrack = teams.filter(t => interviews.filter(i => i.teamId === t.id).length >= goal * 0.6).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-gray-900">Cohort overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">{cohort.name}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Teams" value={teams.length} />
        <StatCard label="Total interviews" value={interviews.length} />
        <StatCard label="On track" value={onTrack} sub={`of ${teams.length} teams`} />
        <StatCard label="Alerts" value={notifs.filter(n => !n.read).length} />
      </div>

      <Card>
        <CardHeader><CardTitle>Team progress</CardTitle><Badge variant="blue">{cohort.name}</Badge></CardHeader>
        <div className="divide-y divide-gray-50">
          {teams.map(team => {
            const count = interviews.filter(i => i.teamId === team.id).length
            const pct = Math.round((count / goal) * 100)
            const status = pct >= 80 ? 'green' : pct >= 40 ? 'amber' : 'red'
            const statusLabel = pct >= 80 ? 'On track' : pct >= 40 ? 'Watch' : 'At risk'
            return (
              <div key={team.id} className="py-3 grid grid-cols-[1fr_160px_90px_auto] items-center gap-4">
                <div>
                  <p className="text-sm font-medium">{team.name}</p>
                  <p className="text-xs text-gray-400">{team.members.join(', ')}</p>
                </div>
                <ProgressBar value={count} max={goal} color={status === 'red' ? 'red' : 'blue'} />
                <Badge variant={status}>{statusLabel}</Badge>
                <Button size="sm" onClick={() => navigate('/teams')}>View</Button>
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Alerts</CardTitle></CardHeader>
        <div className="divide-y divide-gray-50">
          {notifs.map(n => (
            <div key={n.id} className="flex items-start gap-3 py-2.5">
              <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
              <div>
                <p className="text-sm text-gray-700">{n.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
