import { MapPin, BriefcaseIcon, Trash } from '@phosphor-icons/react'
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
