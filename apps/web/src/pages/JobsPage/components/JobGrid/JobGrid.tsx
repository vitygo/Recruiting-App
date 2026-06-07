import { useMemo } from 'react'
import { Briefcase } from '@phosphor-icons/react'
import { LoadingSpinner } from '../../../../components/LoadingSpinner'
import type { Job, CandidateJob } from '../../../../types'
import { JobCard } from '../JobCard/JobCard'
import styles from './JobGrid.module.css'

type Props = {
  jobs: Job[]
  pipeline: CandidateJob[]
  isLoading: boolean
  onViewPipeline: (jobId: string) => void
  onEditJob?: (job: Job) => void
}

export function JobGrid({ jobs, pipeline, isLoading, onViewPipeline, onEditJob }: Props) {
  const metricsMap = useMemo(() => {
    const map: Record<string, { total: number; active: number; hired: number }> = {}
    for (const cj of pipeline) {
      if (!map[cj.jobId]) map[cj.jobId] = { total: 0, active: 0, hired: 0 }
      map[cj.jobId].total++
      if (cj.stage !== 'REJECTED' && cj.stage !== 'OFFER') map[cj.jobId].active++
      if (cj.stage === 'OFFER' || cj.stage === 'HIRED') map[cj.jobId].hired++
    }
    return map
  }, [pipeline])

  const candidatesByJob = useMemo(() => {
    const map: Record<string, CandidateJob[]> = {}
    for (const cj of pipeline) {
      if (!map[cj.jobId]) map[cj.jobId] = []
      map[cj.jobId].push(cj)
    }
    return map
  }, [pipeline])

  return (
    <div className={styles.grid}>
      {isLoading ? (
        <div className={styles.empty}>
          <LoadingSpinner size={44} />
        </div>
      ) : jobs.length === 0 ? (
        <div className={styles.empty}>
          <Briefcase size={40} weight="thin" aria-hidden="true" />
          <div className={styles.emptyTitle}>No jobs found</div>
          <div className={styles.emptyDesc}>Try adjusting your filters</div>
        </div>
      ) : (
        jobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            metrics={metricsMap[job.id] ?? { total: 0, active: 0, hired: 0 }}
            candidatesForJob={candidatesByJob[job.id] ?? []}
            onViewPipeline={() => onViewPipeline(job.id)}
            onEdit={onEditJob ? () => onEditJob(job) : undefined}
          />
        ))
      )}
    </div>
  )
}
