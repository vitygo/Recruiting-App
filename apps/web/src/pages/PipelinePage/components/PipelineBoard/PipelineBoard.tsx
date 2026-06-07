import { PipelineColumn } from '../PipelineColumn/PipelineColumn'
import { STAGES } from '../../constants'
import type { CandidateJob } from '../../../../types'
import styles from './PipelineBoard.module.css'

interface PipelineBoardProps {
  getByStage: (stageId: string) => CandidateJob[]
  onCardClick: (item: CandidateJob) => void
  onDeleteItem?: (itemId: string) => void
  onAddClick: () => void
}

export function PipelineBoard({ getByStage, onCardClick, onDeleteItem, onAddClick }: PipelineBoardProps) {
  return (
    <div className={styles.board}>
      {STAGES.map(stage => (
        <PipelineColumn
          key={stage.id}
          stage={stage}
          items={getByStage(stage.id)}
          onCardClick={onCardClick}
          onDeleteItem={onDeleteItem}
          onAddClick={onAddClick}
        />
      ))}
    </div>
  )
}
