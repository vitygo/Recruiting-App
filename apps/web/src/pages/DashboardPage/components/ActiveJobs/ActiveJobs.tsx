import { Briefcase } from '@phosphor-icons/react/Briefcase'
import styles from './ActiveJobs.module.css'

interface Job {
  id: string
  title: string
  status: string
  _count?: { candidates: number }
}

interface ActiveJobsProps {
  jobs: Job[]
  onSeeAll?: () => void
}

export function ActiveJobs({ jobs, onSeeAll }: ActiveJobsProps) {
  return (
    <div className={styles.jobsCard}>
      <div className={styles.sectionHeader}>
        <h4 className={styles.sectionTitle}>Active Jobs</h4>
        <span className={styles.seeAllLink} onClick={onSeeAll} style={{ cursor: onSeeAll ? 'pointer' : undefined }}>See all jobs</span>
      </div>

      <div className={styles.jobsList}>
        {jobs.length === 0 ? (
          <p className={styles.cardSubtitle}>No jobs yet</p>
        ) : (
          jobs.map(job => (
            <div key={job.id} className={styles.jobItem}>
              <div className={styles.jobMainRow}>
                <div className={styles.jobIcon}>
                  <Briefcase size={20} weight="fill" />
                </div>
                <div className={styles.jobMeta}>
                  <div className={styles.jobTitleWrap}>
                    <h5>{job.title}</h5>
                    <span className={`${styles.badge} ${job.status === 'OPEN' ? styles.badgeSuccess : styles.badgeDraft}`}>
                      {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <p className={styles.jobSubText}>{job._count?.candidates || 0} candidates</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
