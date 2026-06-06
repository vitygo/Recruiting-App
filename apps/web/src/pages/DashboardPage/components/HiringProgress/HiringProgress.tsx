import styles from './HiringProgress.module.css'

interface HiringProgressProps {
  totalCandidates: number
  interviewsThisWeek: number
  activeJobs: number
}

export function HiringProgress({ totalCandidates, interviewsThisWeek, activeJobs }: HiringProgressProps) {
  return (
    <div className={styles.progressCard}>
      <div className={styles.sectionHeader}>
        <h4 className={styles.sectionTitle}>Hiring Progress</h4>
      </div>
      <div className={styles.progressGrid}>
        <div className={styles.progressMetric}>
          <span>Candidates</span>
          <strong>{totalCandidates}</strong>
        </div>
        <div className={styles.progressMetric} style={{ borderColor: 'var(--c-orange)' }}>
          <span>Interviews</span>
          <strong style={{ color: 'var(--c-orange)' }}>{interviewsThisWeek}</strong>
        </div>
        <div className={styles.progressMetric}>
          <span>Open jobs</span>
          <strong>{activeJobs}</strong>
        </div>
      </div>
      <div className={styles.combChart}>
        {Array.from({ length: 30 }).map((_, i) => {
          let barColor = 'var(--c-hairline)'
          if (i >= 10 && i <= 18) barColor = 'var(--c-orange)'
          if (i > 18 && i <= 24) barColor = 'var(--c-ink)'
          return <div key={i} className={styles.combTooth} style={{ backgroundColor: barColor }} />
        })}
      </div>
    </div>
  )
}
