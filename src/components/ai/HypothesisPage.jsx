import { useStore } from '@/store'
import { AIChatPage } from './AIChatPage'

export function HypothesisPage() {
  const myTeamId   = useStore(s => s.myTeamId)
  const teams      = useStore(s => s.teams)
  const interviews = useStore(s => s.interviews)

  const team = teams.find(t => t.id === myTeamId)
  const myInterviews = interviews.filter(i => i.teamId === myTeamId)
  const insightLines = myInterviews
    .filter(i => i.insights)
    .map(i => `- ${i.contact} (${i.org}): ${i.insights}`)
    .join('\n') || 'No analyzed interviews yet.'

  const systemPrompt = `You are an expert I-Corps mentor helping early-stage research teams with customer discovery.

Team: ${team?.name ?? 'Unknown'}
Customer segment: ${team?.segment ?? 'Unknown'}
Current hypothesis: "${team?.hypothesis ?? 'Not set'}"
Interviews completed: ${myInterviews.length}

Interview insights so far:
${insightLines}

Your role:
- Help refine and pressure-test the hypothesis using Jobs-to-be-Done and Lean Startup frameworks
- Identify untested assumptions and suggest how to test them
- Ask probing questions to surface gaps in evidence
- Suggest revised hypothesis wording when evidence supports it
- Flag when the team should consider pivoting
- Reference NSF I-Corps program expectations where relevant

Be direct, evidence-based, and practical. Keep responses concise.`

  return (
    <AIChatPage
      title="Hypothesis AI"
      subtitle={`Refining: ${team?.name ?? ''} · ${myInterviews.length} interviews`}
      systemPrompt={systemPrompt}
    />
  )
}
