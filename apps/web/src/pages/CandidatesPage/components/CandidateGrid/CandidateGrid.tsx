import { Users } from '@phosphor-icons/react'
import type { Candidate } from '../../../../types'
import { CandidateCard } from '../CandidateCard/CandidateCard'
import styles from './CandidateGrid.module.css'

interface CandidateGridProps {
  candidates: Candidate[]
  isLoading: boolean
  onCandidateClick: (candidate: Candidate) => void
}

export function CandidateGrid({ candidates, isLoading, onCandidateClick }: CandidateGridProps) {
  return (
    <div className={styles.grid}>
      {isLoading ? (
        <div className={styles.empty}>
          <div className={styles.emptyTitle}>Loading...</div>
        </div>
      ) : candidates.length === 0 ? (
        <div className={styles.empty}>
          <Users size={40} weight="thin" />
          <div className={styles.emptyTitle}>No candidates found</div>
          <div className={styles.emptyDesc}>Try adjusting your search or filters</div>
        </div>
      ) : (
        candidates.map(candidate => (
          <CandidateCard key={candidate.id} candidate={candidate} onClick={onCandidateClick} />
        ))
      )}
    </div>
  )
}
