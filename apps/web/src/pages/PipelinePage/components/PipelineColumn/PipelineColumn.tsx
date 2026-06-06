import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from '@phosphor-icons/react'
import { SortableCard } from '../PipelineCard/PipelineCard'
import type { CandidateJob, PipelineStage } from '../../../../types'
import type { STAGES } from '../../constants'
import styles from './PipelineColumn.module.css'

interface PipelineColumnProps {
  stage: typeof STAGES[0]
  items: CandidateJob[]
  onCardClick: (item: CandidateJob) => void
  onAddClick: (stage: PipelineStage) => void
}

export function PipelineColumn({ stage, items, onCardClick, onAddClick }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <div className={styles.columnDot} style={{ background: stage.color }} />
        <span className={styles.columnTitle}>{stage.label}</span>
        <span className={styles.columnCount}>{items.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`${styles.columnCards} ${isOver ? styles.columnDropzoneActive : ''}`}
        style={{ minHeight: 80 }}
      >
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {items.map(item => (
            <SortableCard key={item.id} item={item} onClick={() => onCardClick(item)} />
          ))}
        </SortableContext>
        <button className={styles.addCardBtn} onClick={() => onAddClick(stage.id)}>
          <Plus size={13} weight="bold" />
          Add candidate
        </button>
      </div>
    </div>
  )
}
