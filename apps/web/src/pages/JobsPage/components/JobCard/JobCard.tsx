import { useState, useMemo } from 'react'
import { Briefcase, MapPin, CurrencyDollar, ArrowRight, PencilSimple, CaretDown } from '@phosphor-icons/react'
import type { Job, CandidateJob } from '../../../../types'
import { AvatarStack } from '../../../../components/AvatarStack'
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
  candidatesForJob?: CandidateJob[]
}

export function JobCard({ job, metrics, onViewPipeline, onEdit, candidatesForJob = [] }: Props) {
  const [descExpanded, setDescExpanded] = useState(false)

  const statusClass =
    job.status === 'OPEN'      ? styles.statusOpen :
    job.status === 'ACTIVE'    ? styles.statusActive :
    job.status === 'REVIEWING' ? styles.statusReviewing :
    job.status === 'ENDED'     ? styles.statusEnded :
    job.status === 'PAUSED'    ? styles.statusPaused :
    styles.statusClosed

  const avatarItems = useMemo(() =>
    candidatesForJob
      .filter(cj => cj.candidate)
      .map(cj => ({
        name:      `${cj.candidate!.firstName} ${cj.candidate!.lastName}`,
        avatarUrl: cj.candidate!.avatarUrl,
      })),
    [candidatesForJob],
  )

  const hasTech = job.technologies && job.technologies.length > 0

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.jobIcon} aria-hidden="true">
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
              type="button"
              className={styles.editBtn}
              onClick={e => { e.stopPropagation(); onEdit() }}
              aria-label="Edit job"
              title="Edit job"
            >
              <PencilSimple size={13} weight="bold" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className={styles.cardMeta}>
        {job.location && (
          <span className={styles.metaItem}>
            <MapPin size={13} weight="fill" aria-hidden="true" />
            {job.location}
          </span>
        )}
        {job.salaryMin && job.salaryMax && (
          <span className={styles.metaItem}>
            <CurrencyDollar size={13} weight="fill" aria-hidden="true" />
            ${job.salaryMin.toLocaleString()} — ${job.salaryMax.toLocaleString()}
          </span>
        )}
      </div>

      {avatarItems.length > 0 && (
        <div className={styles.avatarRow}>
          <AvatarStack items={avatarItems} max={4} size={26} />
          <span className={styles.avatarLabel}>
            {candidatesForJob.length} applicant{candidatesForJob.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {hasTech && (
        <div className={styles.techRow}>
          {job.technologies!.slice(0, 6).map(tech => (
            <span key={tech} className={styles.techBadge}>{tech}</span>
          ))}
          {job.technologies!.length > 6 && (
            <span className={styles.techMore}>+{job.technologies!.length - 6}</span>
          )}
        </div>
      )}

      {job.description && (
        <div className={styles.descSection}>
          <button
            type="button"
            className={styles.descToggle}
            onClick={e => { e.stopPropagation(); setDescExpanded(v => !v) }}
            aria-expanded={descExpanded}
          >
            <span>Description</span>
            <CaretDown
              size={12}
              weight="bold"
              className={descExpanded ? styles.caretOpen : styles.caretClosed}
              aria-hidden="true"
            />
          </button>
          {descExpanded && (
            <div>
              <p className={styles.descText}>{job.description}</p>
              {hasTech && (
                <div className={styles.techRow} style={{ marginTop: '0.5rem' }}>
                  {job.technologies!.map(tech => (
                    <span key={tech} className={styles.techBadge}>{tech}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
          type="button"
          className={styles.viewBtn}
          onClick={e => { e.stopPropagation(); onViewPipeline() }}
        >
          View Pipeline
          <ArrowRight size={12} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
