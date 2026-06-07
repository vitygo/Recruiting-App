import type { Interview } from '../../../../types'
import { CALENDAR_DAYS } from '../../constants'
import styles from './Calendar.module.css'

export function Calendar({ currentMonth, onMonthChange, interviews, selectedDate, onDateSelect }: {
  currentMonth: Date
  onMonthChange: (d: Date) => void
  interviews: Interview[]
  selectedDate: string | null
  onDateSelect: (date: string) => void
}) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDow = (firstDay.getDay() + 6) % 7
  const today = new Date().toDateString()

  const eventDays = new Set(interviews.map(iv => new Date(iv.scheduledAt).toDateString()))

  const days: (number | null)[] = []
  for (let i = 0; i < startDow; i++) days.push(null)
  for (let i = 1; i <= lastDay.getDate(); i++) days.push(i)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className={styles.calendarHeader}>
        <button className={styles.calNavBtn} onClick={() => onMonthChange(new Date(year, month - 1, 1))}>‹</button>
        <div className={styles.calTitle}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <button className={styles.calNavBtn} onClick={() => onMonthChange(new Date(year, month + 1, 1))}>›</button>
      </div>

      <div className={styles.calendarGrid}>
        {CALENDAR_DAYS.map(d => (
          <div key={d} className={styles.calendarDayHeader}>{d}</div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />
          const dateStr = new Date(year, month, day).toDateString()
          const isToday = dateStr === today
          const hasEvent = eventDays.has(dateStr)
          const isSelected = selectedDate === dateStr

          return (
            <div
              key={day}
              className={[
                styles.calendarDay,
                isToday ? styles.calendarDayActive : '',
                isSelected && !isToday ? styles.calendarDaySelected : '',
                hasEvent && !isToday ? styles.calendarDayHasEvent : '',
              ].join(' ')}
              onClick={() => onDateSelect(isSelected ? '' : dateStr)}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}
