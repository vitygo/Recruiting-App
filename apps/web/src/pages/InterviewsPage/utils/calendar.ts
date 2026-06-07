import type { Interview } from '../../../types'

export function openGoogleCalendar(interview: Interview) {
  const start = new Date(interview.scheduledAt)
  const end = new Date(start.getTime() + (interview.duration || 60) * 60000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const name = `${interview.candidate?.firstName} ${interview.candidate?.lastName}`
  const url = new URL('https://calendar.google.com/calendar/render')
  url.searchParams.set('action', 'TEMPLATE')
  url.searchParams.set('text', `Interview: ${name}`)
  url.searchParams.set('dates', `${fmt(start)}/${fmt(end)}`)
  url.searchParams.set('details', `${interview.type} interview · ${interview.notes || ''}`)
  if (interview.meetLink) url.searchParams.set('location', interview.meetLink)
  window.open(url.toString(), '_blank')
}
