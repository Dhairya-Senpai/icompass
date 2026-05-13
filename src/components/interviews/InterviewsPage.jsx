import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { ROLES } from '@/config/roles'
import { Card, Button, Badge, Modal, FormGroup, Input, Textarea, EmptyState } from '@/components/ui'
import { fmtDate } from '@/utils/format'

const STATUS_VARIANT = { analyzed: 'green', pending: 'amber', transcribed: 'blue' }

const BLANK = { contact: '', role: '', org: '', date: new Date().toISOString().slice(0, 10), notes: '' }

export function InterviewsPage() {
  const navigate   = useNavigate()
  const role       = useStore(s => s.role)
  const myTeamId   = useStore(s => s.myTeamId)
  const teams      = useStore(s => s.teams)
  const interviews = useStore(s => s.interviews)
  const addInterview = useStore(s => s.addInterview)

  const visible = role === ROLES.PARTICIPANT
    ? interviews.filter(i => i.teamId === myTeamId)
    : interviews

  const [open, setOpen]       = useState(false)
  const [form, setForm]       = useState(BLANK)
  const [errors, setErrors]   = useState({})

  const teamName = (id) => teams.find(t => t.id === id)?.name ?? `Team ${id}`

  const validate = () => {
    const e = {}
    if (!form.contact.trim()) e.contact = 'Required'
    if (!form.org.trim())     e.org     = 'Required'
    if (!form.date)           e.date    = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = () => {
    if (!validate()) return
    addInterview({ ...form, teamId: myTeamId })
    setForm(BLANK)
    setOpen(false)
  }

  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-gray-900">Interviews</h1>
          <p className="text-sm text-gray-500 mt-0.5">{visible.length} logged</p>
        </div>
        {role === ROLES.PARTICIPANT && (
          <Button variant="primary" onClick={() => setOpen(true)}>
            <i className="ti ti-plus" aria-hidden="true" /> Log interview
          </Button>
        )}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-[1fr_130px_90px_110px_auto] gap-3 px-5 py-2.5 border-b border-gray-50 text-xs font-medium text-gray-400 uppercase tracking-wider">
          <span>Contact</span>
          <span>Organization</span>
          <span>Date</span>
          <span>Status</span>
          <span />
        </div>

        {visible.length === 0 && (
          <EmptyState
            icon="ti-clipboard-list"
            title="No interviews yet"
            description="Start logging customer discovery interviews to track your progress."
            action={role === ROLES.PARTICIPANT && <Button variant="primary" size="sm" onClick={() => setOpen(true)}>Log first interview</Button>}
          />
        )}

        <div className="divide-y divide-gray-50">
          {visible.map(iv => (
            <div key={iv.id} className="grid grid-cols-[1fr_130px_90px_110px_auto] gap-3 px-5 py-3 items-center text-sm hover:bg-gray-50/60">
              <div>
                <p className="font-medium text-gray-800">{iv.contact}</p>
                <p className="text-xs text-gray-400">{iv.role}{role !== ROLES.PARTICIPANT && ` · ${teamName(iv.teamId)}`}</p>
              </div>
              <span className="text-gray-600 truncate">{iv.org}</span>
              <span className="text-gray-400">{fmtDate(iv.date)}</span>
              <Badge variant={STATUS_VARIANT[iv.status] ?? 'gray'}>{iv.status}</Badge>
              <Button size="sm" onClick={() => navigate('/ai/analysis', { state: { interviewId: iv.id } })}>
                <i className="ti ti-brain" aria-hidden="true" /> Analyze
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Log interview" subtitle="Record a new customer discovery interview">
        <div className="space-y-0">
          <FormGroup label="Contact name" htmlFor="contact" error={errors.contact}>
            <Input id="contact" value={form.contact} onChange={f('contact')} placeholder="Dr. Jane Smith" />
          </FormGroup>
          <div className="grid grid-cols-2 gap-3">
            <FormGroup label="Role / title" htmlFor="iv-role">
              <Input id="iv-role" value={form.role} onChange={f('role')} placeholder="CTO" />
            </FormGroup>
            <FormGroup label="Organization" htmlFor="org" error={errors.org}>
              <Input id="org" value={form.org} onChange={f('org')} placeholder="Acme Corp" />
            </FormGroup>
          </div>
          <FormGroup label="Date" htmlFor="date" error={errors.date}>
            <Input id="date" type="date" value={form.date} onChange={f('date')} />
          </FormGroup>
          <FormGroup label="Notes / transcript" htmlFor="notes">
            <Textarea id="notes" value={form.notes} onChange={f('notes')} placeholder="Paste the transcript or key notes from the interview…" />
          </FormGroup>
          <div className="flex gap-2 justify-end pt-2">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={submit}>
              <i className="ti ti-check" aria-hidden="true" /> Save interview
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
