import { useState } from 'react'
import { useStore } from '@/store'
import { ROLES } from '@/config/roles'
import { Card, CardHeader, CardTitle, ProgressBar, Badge } from '@/components/ui'
import { cn } from '@/utils/cn'

export function CoursesPage() {
  const role         = useStore(s => s.role)
  const myTeamId     = useStore(s => s.myTeamId)
  const teams        = useStore(s => s.teams)
  const courses      = useStore(s => s.courses)
  const toggleModule = useStore(s => s.toggleModule)

  const [activeIdx, setActiveIdx] = useState(0)
  const course = courses[activeIdx]

  const myCompleted = course.completedBy[myTeamId] ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-gray-900">Learning center</h1>
        <p className="text-sm text-gray-500 mt-0.5">Customer discovery curriculum</p>
      </div>

      {/* Course tabs */}
      <div className="flex gap-1 border-b border-gray-100">
        {courses.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setActiveIdx(i)}
            className={cn(
              'px-4 py-2 text-sm border-b-2 -mb-px transition-colors',
              activeIdx === i
                ? 'border-blue-500 text-blue-600 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            )}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Module checklist */}
        <Card>
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
            {role === ROLES.PARTICIPANT && (
              <Badge variant="blue">{myCompleted.length}/{course.modules.length} done</Badge>
            )}
          </CardHeader>
          <p className="text-sm text-gray-500 mb-4">{course.description}</p>
          {role === ROLES.PARTICIPANT && (
            <ProgressBar value={myCompleted.length} max={course.modules.length} color="teal" className="mb-4" />
          )}
          <ul className="divide-y divide-gray-50">
            {course.modules.map((mod, idx) => {
              const done = role === ROLES.PARTICIPANT ? myCompleted.includes(idx) : false
              return (
                <li key={idx} className="flex items-center gap-3 py-2.5">
                  <button
                    disabled={role !== ROLES.PARTICIPANT}
                    onClick={() => toggleModule(course.id, myTeamId, idx)}
                    className={cn(
                      'w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors',
                      done
                        ? 'bg-teal-500 border-teal-500 text-white'
                        : 'border-gray-300 hover:border-teal-400',
                      role !== ROLES.PARTICIPANT && 'cursor-default',
                    )}
                    aria-label={done ? `Mark ${mod} incomplete` : `Mark ${mod} complete`}
                  >
                    {done && <i className="ti ti-check text-[10px]" aria-hidden="true" />}
                  </button>
                  <span className={cn('text-sm', done && 'line-through text-gray-400')}>{mod}</span>
                  {done && <Badge variant="green" className="ml-auto">Done</Badge>}
                </li>
              )
            })}
          </ul>
        </Card>

        {/* Team progress */}
        <Card>
          <CardHeader><CardTitle>All team progress</CardTitle></CardHeader>
          <div className="divide-y divide-gray-50">
            {teams.map(team => {
              const done = (course.completedBy[team.id] ?? []).length
              return (
                <div key={team.id} className="py-3">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{team.name}</span>
                    <span className="text-xs text-gray-400">{done}/{course.modules.length}</span>
                  </div>
                  <ProgressBar value={done} max={course.modules.length} showLabel={false} />
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
