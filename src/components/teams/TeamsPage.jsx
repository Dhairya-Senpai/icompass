import { useStore } from '@/store'
import { Card, CardHeader, CardTitle, Badge, ProgressBar } from '@/components/ui'

export function TeamsPage() {
  const cohort     = useStore(s => s.cohort)
  const teams      = useStore(s => s.teams)
  const interviews = useStore(s => s.interviews)
  const goal       = cohort.interviewGoal

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-gray-900">Teams</h1>
        <p className="text-sm text-gray-500 mt-0.5">{cohort.name}</p>
      </div>

      {teams.map(team => {
        const teamInterviews = interviews.filter(i => i.teamId === team.id)
        const validated      = teamInterviews.filter(i => i.hypothesisValidated === true).length
        const pct            = Math.round((teamInterviews.length / goal) * 100)
        const status         = pct >= 80 ? 'green' : pct >= 40 ? 'amber' : 'red'

        return (
          <Card key={team.id}>
            <CardHeader>
              <div>
                <CardTitle className="text-base">{team.name}</CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">{team.members.join(' · ')} · {team.segment}</p>
              </div>
              <Badge variant={status}>
                {teamInterviews.length}/{goal} interviews
              </Badge>
            </CardHeader>

            <blockquote className="text-sm italic text-gray-600 bg-gray-50 rounded-lg px-3 py-2.5 border-l-2 border-blue-300 mb-4">
              "{team.hypothesis}"
            </blockquote>

            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              {[
                { label: 'Interviews', value: teamInterviews.length },
                { label: 'Validated', value: validated },
                { label: 'Support rate', value: teamInterviews.length ? `${Math.round((validated / teamInterviews.length) * 100)}%` : '—' },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-lg py-3">
                  <p className="text-xl font-semibold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <ProgressBar value={teamInterviews.length} max={goal} color={status === 'red' ? 'red' : 'blue'} />
          </Card>
        )
      })}
    </div>
  )
}
