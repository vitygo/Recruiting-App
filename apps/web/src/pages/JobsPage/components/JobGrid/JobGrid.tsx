import { Briefcase } from '@phosphor-icons/react'
import type { Job } from '../../../../types'
import { JobCard } from '../JobCard/JobCard'
import styles from './JobGrid.module.css'

type Props = {
  jobs: Job[]
  isLoading: boolean
}

export function JobGrid({ jobs, isLoading }: Props) {
  return (
    <div className={styles.grid}>
      {isLoading ? (
        <div className={styles.empty}>
          <div className={styles.emptyTitle}>Loading...</div>
        </div>
      ) : jobs.length === 0 ? (
        <div className={styles.empty}>
          <Briefcase size={40} weight="thin" />
          <div className={styles.emptyTitle}>No jobs found</div>
          <div className={styles.emptyDesc}>Try adjusting your search or filters</div>
        </div>
      ) : (
        jobs.map(job => <JobCard key={job.id} job={job} />)
      )}
    </div>
  )
}
