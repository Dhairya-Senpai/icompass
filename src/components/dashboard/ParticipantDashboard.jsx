import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { StatCard, ProgressBar, Card, CardHeader, CardTitle, Button, Badge } from '@/components/ui'

export function ParticipantDashboard() {
  const navigate = useNavigate()
  const myTeamId  = useStore(s => s.myTeamId)
  const teams     = useStore(s => s.teams)
  const interviews = useStore(s => s.interviews)
  const courses   = useStore(s => s.courses)
  const goal      = useStore(s => s.cohort.interviewGoal)

  const team = teams.find(t => t.id === myTeamId)
  const myInterviews = interviews.filter(i => i.teamId === myTeamId)
  const analyzed     = myInterviews.filter(i => i.status === 'analyzed').length
  const validated    = myInterviews.filter(i => i.hypothesisValidated === true).length
  const totalModules = courses.reduce((a, c) => a + c.modules.length, 0)
  const doneModules  = courses.reduce((a, c) => a + (c.completedBy[myTeamId]?.length ?? 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-0.5">{team?.name} · {useStore(s => s.cohort.name)}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Interviews logged"  value={myInterviews.length} />
        <StatCard label="Remaining to goal"  value={Math.max(0, goal - myInterviews.length)} />
        <StatCard label="AI-analyzed"         value={analyzed} />
        <StatCard label="Support rate" value={myInterviews.length ? `${Math.round((validated / myInterviews.length) * 100)}%` : '—'} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Interview progress</CardTitle>
            <Badge variant={myInterviews.length >= goal ? 'green' : 'amber'}>
              {Math.max(0, goal - myInterviews.length)} to go
            </Badge>
          </CardHeader>
          <ProgressBar value={myInterviews.length} max={goal} />
          <div className="mt-4 divide-y divide-gray-50">
            {myInterviews.slice(0, 4).map(iv => (
              <div key={iv.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">{iv.contact}</p>
                  <p className="text-xs text-gray-400">{iv.org}</p>
                </div>
                <Badge variant={iv.status === 'analyzed' ? 'green' : 'amber'}>{iv.status}</Badge>
              </div>
            ))}
          </div>
          <Button size="sm" variant="primary" className="mt-4" onClick={() => navigate('/interviews')}>
            <i className="ti ti-plus" aria-hidden="true" /> Log interview
          </Button>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Current hypothesis</CardTitle></CardHeader>
            <blockquote className="text-sm text-gray-600 italic leading-relaxed bg-gray-50 rounded-lg p-3 border-l-2 border-blue-300">
              "{team?.hypothesis}"
            </blockquote>
            <Button size="sm" className="mt-3" onClick={() => navigate('/ai/hypothesis')}>
              <i className="ti ti-brain" aria-hidden="true" /> Refine with AI
            </Button>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course progress</CardTitle>
              <Badge variant="blue">{doneModules}/{totalModules} modules</Badge>
            </CardHeader>
            <ProgressBar value={doneModules} max={totalModules} color="teal" />
            <Button size="sm" className="mt-3" onClick={() => navigate('/courses')}>
              <i className="ti ti-book" aria-hidden="true" /> Continue learning
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
