import styles from './UpcomingInterviews.module.css'

interface Interview {
  id: string
  scheduledAt: string
  type: string
  candidate?: {
    firstName?: string
    lastName?: string
  }
}

interface UpcomingInterviewsProps {
  interviews: Interview[]
  onSeeAll?: () => void
}

function formatInterviewTime(scheduledAt: string): string {
  const d = new Date(scheduledAt)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const isToday = d.toDateString() === today.toDateString()
  const isTomorrow = d.toDateString() === tomorrow.toDateString()
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  if (isToday) return `Today ${time}`
  if (isTomorrow) return `Tomorrow ${time}`
  return d.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' + time
}

export function UpcomingInterviews({ interviews, onSeeAll }: UpcomingInterviewsProps) {
  return (
    <div className={styles.connectCard}>
      <div className={styles.sectionHeader}>
        <h4 className={styles.sectionTitle}>Upcoming Interviews</h4>
        <span className={styles.seeAllLink} onClick={onSeeAll} style={{ cursor: onSeeAll ? 'pointer' : undefined }}>See all</span>
      </div>
      <div className={styles.connectList}>
        {interviews.length === 0 ? (
          <p className={styles.cardSubtitle}>No upcoming interviews</p>
        ) : (
          interviews.map(iv => (
            <div key={iv.id} className={styles.connectItem}>
              <div className={styles.avatar}>
                {iv.candidate?.firstName?.[0]}{iv.candidate?.lastName?.[0]}
              </div>
              <div className={styles.connectInfo}>
                <h6>{iv.candidate?.firstName} {iv.candidate?.lastName}</h6>
                <p>{formatInterviewTime(iv.scheduledAt)}</p>
              </div>
              <span className={styles.levelLabel}>{iv.type}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
