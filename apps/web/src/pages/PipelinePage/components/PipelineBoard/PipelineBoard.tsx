import { PipelineColumn } from '../PipelineColumn/PipelineColumn'
import { STAGES } from '../../constants'
import type { CandidateJob, PipelineStage } from '../../../../types'
import styles from './PipelineBoard.module.css'

interface PipelineBoardProps {
  getByStage: (stageId: string) => CandidateJob[]
  onCardClick: (item: CandidateJob) => void
  onAddClick: (stage: PipelineStage) => void
}

export function PipelineBoard({ getByStage, onCardClick, onAddClick }: PipelineBoardProps) {
  return (
    <div className={styles.board}>
      {STAGES.map(stage => (
        <PipelineColumn
          key={stage.id}
          stage={stage}
          items={getByStage(stage.id)}
          onCardClick={onCardClick}
          onAddClick={onAddClick}
        />
      ))}
    </div>
  )
}
