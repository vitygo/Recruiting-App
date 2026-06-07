import { Briefcase, MapPin, CurrencyDollar, ArrowRight, PencilSimple } from '@phosphor-icons/react'
import type { Job } from '../../../../types'
import { TYPE_LABELS } from '../../constants'
import styles from './JobCard.module.css'

type JobMetrics = {
  total: number
  active: number
  hired: number
}

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Open',
  ACTIVE: 'Active',
  REVIEWING: 'Reviewing',
  ENDED: 'Ended',
  PAUSED: 'Paused',
  CLOSED: 'Closed',
}

type Props = {
  job: Job
  metrics: JobMetrics
  onViewPipeline: () => void
  onEdit?: () => void
}

export function JobCard({ job, metrics, onViewPipeline, onEdit }: Props) {
  const statusClass =
    job.status === 'OPEN' ? styles.statusOpen :
    job.status === 'ACTIVE' ? styles.statusActive :
    job.status === 'REVIEWING' ? styles.statusReviewing :
    job.status === 'ENDED' ? styles.statusEnded :
    job.status === 'PAUSED' ? styles.statusPaused :
    styles.statusClosed

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.jobIcon}>
          <Briefcase size={22} weight="fill" />
        </div>
        <div className={styles.cardTitleWrap}>
          <div className={styles.cardTitle}>{job.title}</div>
          <div className={styles.cardDept}>{job.department}</div>
        </div>
        <div className={styles.cardTopRight}>
          <span className={`${styles.statusBadge} ${statusClass}`}>
            {STATUS_LABELS[job.status] ?? job.status}
          </span>
          {onEdit && (
            <button
              className={styles.editBtn}
              onClick={e => { e.stopPropagation(); onEdit() }}
              aria-label="Edit job"
              title="Edit job"
            >
              <PencilSimple size={13} weight="bold" />
            </button>
          )}
        </div>
      </div>

      <div className={styles.cardMeta}>
        {job.location && (
          <span className={styles.metaItem}>
            <MapPin size={13} weight="fill" />
            {job.location}
          </span>
        )}
        {job.salaryMin && job.salaryMax && (
          <span className={styles.metaItem}>
            <CurrencyDollar size={13} weight="fill" />
            ${job.salaryMin.toLocaleString()} — ${job.salaryMax.toLocaleString()}
          </span>
        )}
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metricChip}>
          <span className={styles.metricValue}>{metrics.total}</span>
          <span className={styles.metricLabel}>Total</span>
        </div>
        <div className={styles.metricDivider} />
        <div className={styles.metricChip}>
          <span className={`${styles.metricValue} ${styles.metricActive}`}>{metrics.active}</span>
          <span className={styles.metricLabel}>Active</span>
        </div>
        <div className={styles.metricDivider} />
        <div className={styles.metricChip}>
          <span className={`${styles.metricValue} ${styles.metricHired}`}>{metrics.hired}</span>
          <span className={styles.metricLabel}>Hired</span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        {job.type && (
          <span className={styles.typeBadge}>{TYPE_LABELS[job.type] || job.type}</span>
        )}
        <button
          className={styles.viewBtn}
          onClick={e => { e.stopPropagation(); onViewPipeline() }}
        >
          View Pipeline
          <ArrowRight size={12} weight="bold" />
        </button>
      </div>
    </div>
  )
}
