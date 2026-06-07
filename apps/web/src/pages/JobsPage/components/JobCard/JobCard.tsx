import { Briefcase, MapPin, Users, CurrencyDollar } from '@phosphor-icons/react'
import type { Job } from '../../../../types'
import { TYPE_LABELS } from '../../constants'
import styles from './JobCard.module.css'

type Props = {
  job: Job
}

export function JobCard({ job }: Props) {
  const statusClass =
    job.status === 'OPEN' ? styles.statusOpen :
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
        <span className={`${styles.statusBadge} ${statusClass}`}>
          {job.status ? job.status.charAt(0) + job.status.slice(1).toLowerCase() : '—'}
        </span>
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

      <div className={styles.cardFooter}>
        <div className={styles.candidatesWrap}>
          <Users size={14} weight="fill" color="var(--c-ink-muted)" />
          <span className={styles.candidatesCount}>{job._count?.candidates || 0}</span>
          <span className={styles.candidatesLabel}>candidates</span>
        </div>
        {job.type && (
          <span className={styles.typeBadge}>{TYPE_LABELS[job.type] || job.type}</span>
        )}
      </div>
    </div>
  )
}
