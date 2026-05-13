import { useLocation } from 'react-router-dom'
import { useStore } from '@/store'
import { AIChatPage } from './AIChatPage'
import { fmtDate } from '@/utils/format'

export function AnalysisPage() {
  const location   = useLocation()
  const interviews = useStore(s => s.interviews)
  const teams      = useStore(s => s.teams)

  // Accept interview pre-selected via navigation state or fall back to first
  const interviewId = location.state?.interviewId
  const interview   = (interviewId ? interviews.find(i => i.id === interviewId) : null) ?? interviews[0]
  const team        = teams.find(t => t.id === interview?.teamId)

  const systemPrompt = interview ? `You are an icompass customer discovery analyst.

Interview details:
- Contact: ${interview.contact}, ${interview.role} at ${interview.org}
- Date: ${fmtDate(interview.date)}
- Team: ${team?.name ?? 'Unknown'}
- Team hypothesis: "${team?.hypothesis ?? 'Not set'}"

Interview notes:
${interview.notes || '(No notes provided — ask the user to paste the transcript or describe the conversation.)'}

Existing insights: ${interview.insights || '(None yet)'}

Your tasks:
1. Extract and categorize key signals (pain, behavior, budget, competition, referrals)
2. Identify whether the interview supports, contradicts, or is neutral on the hypothesis
3. Surface quotes or moments that indicate strong pain vs. polite interest
4. Suggest 3-5 follow-up questions for the next interview
5. Recommend any updates to the team hypothesis based on this data

Be concise and evidence-based. Format outputs clearly.`
  : 'No interview selected. Ask the user to describe an interview they would like to analyze.'

  const subtitle = interview
    ? `${interview.contact} · ${interview.org} · ${fmtDate(interview.date)}`
    : 'Select an interview to analyze'

  return (
    <AIChatPage
      title="Interview analysis"
      subtitle={subtitle}
      systemPrompt={systemPrompt}
    />
  )
}
