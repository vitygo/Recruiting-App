import { MapPin, GraduationCap } from '@phosphor-icons/react'
import type { Candidate } from '../../../../types'
import { SOURCE_COLORS, STAGE_COLORS } from '../../constants'
import { getInitials } from '../../utils'
import styles from './CandidateCard.module.css'

interface CandidateCardProps {
  candidate: Candidate
  onClick: (candidate: Candidate) => void
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  const src = SOURCE_COLORS[candidate.source || 'MANUAL'] || SOURCE_COLORS.MANUAL
  const latestStage = candidate.candidateJobs?.[0]?.stage
  const stg = STAGE_COLORS[latestStage || ''] || STAGE_COLORS.APPLIED
  const initials = getInitials(candidate.firstName, candidate.lastName)
  const score = candidate.candidateJobs?.[0]?.aiScore

  return (
    <div className={styles.card} onClick={() => onClick(candidate)}>
      <div className={styles.cardTop}>
        <div className={styles.avatar}>{initials}</div>
        <div>
          <div className={styles.cardName}>{candidate.firstName} {candidate.lastName}</div>
          <div className={styles.cardRole}>{candidate.email}</div>
        </div>
      </div>

      <div className={styles.cardMeta}>
        {candidate.location && (
          <span className={styles.metaItem}>
            <MapPin size={12} weight="fill" />
            {candidate.location}
          </span>
        )}
        {candidate.source && (
          <span className={styles.metaItem}>
            <GraduationCap size={12} weight="fill" />
            {candidate.source}
          </span>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.scoreWrap}>
          <div className={styles.scoreBar}>
            <div className={styles.scoreFill} style={{ width: `${score || 0}%` }} />
          </div>
          <span className={styles.scoreVal}>{score ? `${score}%` : '—'}</span>
        </div>
        <div className={styles.badges}>
          <span className={styles.sourceBadge} style={{ background: src.bg, color: src.color }}>
            {candidate.source || 'Manual'}
          </span>
          {latestStage && (
            <span className={styles.stageBadge} style={{ background: stg.bg, color: stg.color }}>
              {latestStage.charAt(0) + latestStage.slice(1).toLowerCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
