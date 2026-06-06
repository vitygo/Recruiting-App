import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DotsSixVertical } from '@phosphor-icons/react'
import { SOURCE_COLORS } from '../../constants'
import { getInitials } from '../../utils'
import type { CandidateJob } from '../../../../types'
import styles from './PipelineCard.module.css'

export function CardContent({ item, onClick, isDragging = false }: {
  item: CandidateJob
  onClick: () => void
  isDragging?: boolean
}) {
  const src = SOURCE_COLORS[item.candidate?.source || 'MANUAL'] || SOURCE_COLORS.MANUAL
  const initials = getInitials(item.candidate?.firstName, item.candidate?.lastName)

  return (
    <div className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`} onClick={onClick}>
      <div className={styles.dragHandle}>
        <DotsSixVertical size={14} weight="bold" />
      </div>
      <div className={styles.cardTop}>
        <div className={styles.cardAvatar}>{initials}</div>
        <div>
          <div className={styles.cardName}>{item.candidate?.firstName} {item.candidate?.lastName}</div>
          <div className={styles.cardRole}>{item.candidate?.email}</div>
        </div>
      </div>
      <div className={styles.cardBottom}>
        <div className={styles.scoreWrap}>
          <div className={styles.scoreBar}>
            <div className={styles.scoreFill} style={{ width: `${item.aiScore || 0}%`, background: 'var(--c-accent)' }} />
          </div>
          <span className={styles.scoreVal}>{item.aiScore ? `${item.aiScore}%` : '—'}</span>
        </div>
        <span className={styles.sourceTag} style={{ background: src.bg, color: src.color }}>
          {item.candidate?.source || 'Manual'}
        </span>
      </div>
    </div>
  )
}

export function SortableCard({ item, onClick }: { item: CandidateJob; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: { stage: item.stage },
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0 : 1 }}
      {...attributes}
      {...listeners}
    >
      <CardContent item={item} onClick={onClick} />
    </div>
  )
}
