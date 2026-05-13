import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function fmtDate(iso) {
  if (!iso) return '—'
  try { return format(parseISO(iso), 'MMM d, yyyy') } catch { return iso }
}

export function fmtRelative(iso) {
  if (!iso) return ''
  try { return formatDistanceToNow(parseISO(iso), { addSuffix: true }) } catch { return iso }
}

export function fmtPct(value, total) {
  if (!total) return '0%'
  return `${Math.round((value / total) * 100)}%`
}
