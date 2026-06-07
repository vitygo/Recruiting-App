import type { Interview } from '../../../../types'
import { formatTime } from '../../utils/date'
import { Calendar } from '../Calendar/Calendar'
import styles from './SidePanel.module.css'

export function SidePanel({
  currentMonth, onMonthChange, allInterviews, selectedDate, onDateSelect, onInterviewClick,
}: {
  currentMonth: Date
  onMonthChange: (d: Date) => void
  allInterviews: Interview[]
  selectedDate: string
  onDateSelect: (date: string) => void
  onInterviewClick: (iv: Interview) => void
}) {
  const upcoming = allInterviews
    .filter(iv => iv.status === 'SCHEDULED' && new Date(iv.scheduledAt) >= new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5)

  const sideListInterviews = selectedDate
    ? allInterviews.filter(iv => new Date(iv.scheduledAt).toDateString() === selectedDate)
    : upcoming

  return (
    <div className={styles.sideCard}>
      <Calendar
        currentMonth={currentMonth}
        onMonthChange={onMonthChange}
        interviews={allInterviews}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
      />

      <div>
        <div className={styles.sideTitle} style={{ marginBottom: 10 }}>
          {selectedDate
            ? `${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            : 'Upcoming'}
        </div>
        <div className={styles.upcomingList}>
          {sideListInterviews.length === 0 ? (
            <div style={{ fontSize: '0.8125rem', color: 'var(--c-ink-muted)', textAlign: 'center', padding: '12px 0' }}>
              No interviews
            </div>
          ) : (
            sideListInterviews.map(iv => (
              <div key={iv.id} className={styles.upcomingItem} onClick={() => onInterviewClick(iv)}>
                <div
                  className={styles.upcomingDot}
                  style={{ background: iv.type === 'VIDEO' ? 'var(--c-accent)' : 'var(--c-orange)' }}
                />
                <div className={styles.upcomingName}>
                  {iv.candidate?.firstName} {iv.candidate?.lastName}
                </div>
                <div className={styles.upcomingTime}>{formatTime(iv.scheduledAt)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
