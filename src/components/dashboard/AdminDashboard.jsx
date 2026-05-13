import { useStore } from '@/store'
import { StatCard, Card, CardHeader, CardTitle } from '@/components/ui'

export function AdminDashboard() {
  const cohort     = useStore(s => s.cohort)
  const teams      = useStore(s => s.teams)
  const interviews = useStore(s => s.interviews)
  const courses    = useStore(s => s.courses)

  const totalParticipants = teams.reduce((a, t) => a + t.members.length, 0)
  const validated  = interviews.filter(i => i.hypothesisValidated === true).length
  const supportRate = interviews.length ? Math.round((validated / interviews.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-gray-900">Platform overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Administrator view</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Teams" value={teams.length} />
        <StatCard label="Participants" value={totalParticipants} />
        <StatCard label="Interviews" value={interviews.length} />
        <StatCard label="Hypothesis support rate" value={`${supportRate}%`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader><CardTitle>Interview status</CardTitle></CardHeader>
          {['analyzed', 'pending'].map(s => (
            <div key={s} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 text-sm">
              <span className="capitalize text-gray-700">{s}</span>
              <span className="font-medium">{interviews.filter(i => i.status === s).length}</span>
            </div>
          ))}
        </Card>

        <Card>
          <CardHeader><CardTitle>Course completion</CardTitle></CardHeader>
          {courses.map(c => {
            const total = teams.length * c.modules.length
            const done  = Object.values(c.completedBy).reduce((a, v) => a + v.length, 0)
            const pct   = total ? Math.round((done / total) * 100) : 0
            return (
              <div key={c.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 text-sm">
                <span className="text-gray-700 truncate max-w-[200px]">{c.title}</span>
                <span className="font-medium text-gray-500">{pct}%</span>
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}
