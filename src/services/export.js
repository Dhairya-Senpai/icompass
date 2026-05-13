/**
 * Data export utilities.
 * All download logic is here — components just call these functions.
 */

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Export interviews as CSV.
 * @param {Array} interviews
 * @param {Array} teams  - for team name lookup
 */
export function exportInterviewsCSV(interviews, teams) {
  const teamMap = Object.fromEntries(teams.map(t => [t.id, t.name]))
  const headers = ['ID', 'Team', 'Contact', 'Role', 'Organization', 'Date', 'Status', 'Hypothesis Validated', 'Insights']
  const rows = interviews.map(iv => [
    iv.id,
    teamMap[iv.teamId] ?? iv.teamId,
    iv.contact,
    iv.role,
    iv.org,
    iv.date,
    iv.status,
    iv.hypothesisValidated === null ? 'pending' : iv.hypothesisValidated ? 'yes' : 'no',
    (iv.insights ?? '').replace(/"/g, '""'),
  ].map(v => `"${v}"`).join(','))

  const csv = [headers.join(','), ...rows].join('\n')
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), 'icompass-interviews.csv')
}

/**
 * Export full platform data as JSON (for backup / import).
 */
export function exportFullJSON(storeSnapshot) {
  const json = JSON.stringify(storeSnapshot, null, 2)
  downloadBlob(new Blob([json], { type: 'application/json' }), 'icompass-export.json')
}
