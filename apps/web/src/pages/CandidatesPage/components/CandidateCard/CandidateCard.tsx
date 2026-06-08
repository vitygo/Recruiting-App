import { MapPin, BriefcaseIcon, Trash, CalendarBlank } from '@phosphor-icons/react'
import type { Candidate } from '../../../../types'
import { STAGES } from '../../../PipelinePage/constants'
import { SOURCE_COLORS, STAGE_COLORS } from '../../constants'
import { getInitials } from '../../utils'
import styles from './CandidateCard.module.css'

interface CandidateCardProps {
  candidate: Candidate
  onClick: (candidate: Candidate) => void
  onDelete?: (id: string) => void
}

function formatAppliedAt(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    // Pre-formatted string like "Applied 18 days ago" — strip the prefix we re-add
    return dateStr.replace(/^Applied\s+/i, '')
  }
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function CandidateCard({ candidate, onClick, onDelete }: CandidateCardProps) {
  const src = SOURCE_COLORS[candidate.source || 'MANUAL'] || SOURCE_COLORS.MANUAL
  const latestCJ = candidate.candidateJobs?.[0]
  const latestStage = latestCJ?.stage
  const stg = STAGE_COLORS[latestStage || ''] || STAGE_COLORS.APPLIED
  const stageLabel = latestStage
    ? (STAGES.find(s => s.id === latestStage)?.label ?? latestStage)
    : null
  const jobTitle = latestCJ?.job?.title
  const initials = getInitials(candidate.firstName, candidate.lastName)
  const score = latestCJ?.aiScore
  const appliedLabel = latestCJ?.appliedAt ? formatAppliedAt(latestCJ.appliedAt) : null

  return (
    <div className={styles.card} onClick={() => onClick(candidate)}>
      <div className={styles.cardTop}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.cardIdentity}>
          <div className={styles.cardName}>{candidate.firstName} {candidate.lastName}</div>
          <div className={styles.cardRole}>{candidate.email}</div>
        </div>
        {onDelete && (
          <button
            className={styles.deleteBtn}
            onClick={e => { e.stopPropagation(); onDelete(candidate.id) }}
            aria-label={`Remove ${candidate.firstName} ${candidate.lastName}`}
            title="Remove candidate"
          >
            <Trash size={14} weight="bold" />
          </button>
        )}
      </div>

      <div className={styles.cardMeta}>
        {candidate.location && (
          <span className={styles.metaItem}>
            <MapPin size={12} weight="fill" />
            {candidate.location}
          </span>
        )}
        {jobTitle ? (
          <span className={styles.metaItem}>
            <BriefcaseIcon size={12} weight="fill" />
            {jobTitle}
          </span>
        ) : (
          <span className={styles.generalPoolBadge}>General Pool</span>
        )}
      </div>

      {appliedLabel && (
        <div className={styles.appliedRow}>
          <CalendarBlank size={11} weight="regular" />
          <span>Applied {appliedLabel}</span>
        </div>
      )}

      <div className={styles.cardFooter}>
        <div className={styles.scoreWrap}>
          <div className={styles.scoreBar}>
            <div className={styles.scoreFill} style={{ width: `${score ?? 0}%` }} />
          </div>
          <span className={styles.scoreVal}>{score ? `${score}%` : '—'}</span>
        </div>
        <div className={styles.badges}>
          <span className={styles.sourceBadge} style={{ background: src.bg, color: src.color }}>
            {candidate.source || 'Manual'}
          </span>
          {stageLabel && (
            <span className={styles.stageBadge} style={{ background: stg.bg, color: stg.color }}>
              {stageLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
