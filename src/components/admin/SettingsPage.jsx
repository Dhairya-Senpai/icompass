import { useState } from 'react'
import { useStore } from '@/store'
import { FEATURES } from '@/config/env'
import { OLLAMA_CONFIG } from '@/config/env'
import { Card, CardHeader, CardTitle, Button, FormGroup, Input } from '@/components/ui'
import { exportInterviewsCSV, exportFullJSON } from '@/services/export'

export function SettingsPage() {
  const cohort      = useStore(s => s.cohort)
  const teams       = useStore(s => s.teams)
  const interviews  = useStore(s => s.interviews)
  const courses     = useStore(s => s.courses)
  const notifs      = useStore(s => s.notifications)
  const updateCohortSettings = useStore(s => s.updateCohortSettings)

  const [name, setName] = useState(cohort.name)
  const [goal, setGoal] = useState(String(cohort.interviewGoal))
  const [saved, setSaved] = useState(false)

  const save = () => {
    updateCohortSettings({ name, interviewGoal: parseInt(goal, 10) || 15 })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-serif text-2xl text-gray-900">Platform settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Cohort and system configuration</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Cohort configuration</CardTitle></CardHeader>
        <FormGroup label="Cohort name" htmlFor="cohort-name">
          <Input id="cohort-name" value={name} onChange={e => setName(e.target.value)} />
        </FormGroup>
        <FormGroup label="Interview goal per team" htmlFor="goal">
          <Input id="goal" type="number" min={1} max={100} value={goal} onChange={e => setGoal(e.target.value)} className="w-32" />
        </FormGroup>
        <Button variant="primary" onClick={save}>
          {saved
            ? <><i className="ti ti-check" aria-hidden="true" /> Saved</>
            : <><i className="ti ti-device-floppy" aria-hidden="true" /> Save settings</>
          }
        </Button>
      </Card>

      <Card>
        <CardHeader><CardTitle>Ollama connection</CardTitle></CardHeader>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between py-1.5 border-b border-gray-50">
            <span className="text-gray-500">Endpoint</span>
            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{OLLAMA_CONFIG.baseUrl}</code>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-50">
            <span className="text-gray-500">Model</span>
            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{OLLAMA_CONFIG.model}</code>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-gray-500">Timeout</span>
            <span>{OLLAMA_CONFIG.timeout / 1000}s</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">To change these, update environment variables in <code>.env.local</code> or GitHub Actions variables.</p>
      </Card>

      <Card>
        <CardHeader><CardTitle>Feature flags</CardTitle></CardHeader>
        <div className="space-y-1 text-sm">
          {Object.entries(FEATURES).map(([key, val]) => (
            <div key={key} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-gray-600">{key}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${val ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {val ? 'enabled' : 'disabled'}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">Feature flags are set via environment variables.</p>
      </Card>

      {FEATURES.export && (
        <Card>
          <CardHeader><CardTitle>Data export</CardTitle></CardHeader>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => exportInterviewsCSV(interviews, teams)}>
              <i className="ti ti-download" aria-hidden="true" /> Interviews CSV
            </Button>
            <Button onClick={() => exportFullJSON({ cohort, teams, interviews, courses, notifications: notifs })}>
              <i className="ti ti-download" aria-hidden="true" /> Full export JSON
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
