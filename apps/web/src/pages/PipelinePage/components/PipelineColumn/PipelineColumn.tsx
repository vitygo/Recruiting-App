import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from '@phosphor-icons/react'
import { SortableCard } from '../PipelineCard/PipelineCard'
import type { CandidateJob } from '../../../../types'
import type { STAGES } from '../../constants'
import styles from './PipelineColumn.module.css'

interface PipelineColumnProps {
  stage: typeof STAGES[0]
  items: CandidateJob[]
  onCardClick: (item: CandidateJob) => void
  onDeleteItem?: (itemId: string) => void
  onAddClick: () => void
}

export function PipelineColumn({ stage, items, onCardClick, onDeleteItem, onAddClick }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <div className={styles.columnDot} style={{ background: stage.color }} aria-hidden="true" />
        <span className={styles.columnTitle}>{stage.label}</span>
        <span className={styles.columnCount} aria-label={`${items.length} candidates`}>{items.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`${styles.columnCards} ${isOver ? styles.columnDropzoneActive : ''}`}
      >
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {items.map(item => (
            <SortableCard key={item.id} item={item} onClick={() => onCardClick(item)} onDelete={onDeleteItem} />
          ))}
        </SortableContext>
        <button
          type="button"
          className={styles.addCardBtn}
          onClick={onAddClick}
          aria-label={`Add candidate to ${stage.label}`}
        >
          <Plus size={13} weight="bold" aria-hidden="true" />
          Add candidate
        </button>
      </div>
    </div>
  )
}
