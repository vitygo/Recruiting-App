import type { Interview } from '../../../types'

export function formatTime(scheduledAt: string) {
  return new Date(scheduledAt).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

export function formatDayLabel(scheduledAt: string) {
  const d = new Date(scheduledAt)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

export function groupByDay(interviews: Interview[]) {
  const groups: Record<string, Interview[]> = {}
  const sorted = [...interviews].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  )
  sorted.forEach(iv => {
    const key = new Date(iv.scheduledAt).toDateString()
    if (!groups[key]) groups[key] = []
    groups[key].push(iv)
  })
  return groups
}
