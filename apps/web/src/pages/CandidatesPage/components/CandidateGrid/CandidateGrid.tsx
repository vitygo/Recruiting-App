import { Users } from '@phosphor-icons/react'
import type { Candidate } from '../../../../types'
import { LoadingSpinner } from '../../../../components/LoadingSpinner'
import { CandidateCard } from '../CandidateCard/CandidateCard'
import styles from './CandidateGrid.module.css'

interface CandidateGridProps {
  candidates: Candidate[]
  isLoading: boolean
  onCandidateClick: (candidate: Candidate) => void
  onDelete?: (id: string) => void
}

export function CandidateGrid({ candidates, isLoading, onCandidateClick, onDelete }: CandidateGridProps) {
  return (
    <div className={styles.grid}>
      {isLoading ? (
        <div className={styles.empty}>
          <LoadingSpinner size={44} />
        </div>
      ) : candidates.length === 0 ? (
        <div className={styles.empty}>
          <Users size={40} weight="thin" aria-hidden="true" />
          <div className={styles.emptyTitle}>No candidates found</div>
          <div className={styles.emptyDesc}>Try adjusting your search or filters</div>
        </div>
      ) : (
        candidates.map(candidate => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onClick={onCandidateClick}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  )
}
