import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Eye, Trash } from '@phosphor-icons/react'
import { SOURCE_COLORS } from '../../constants'
import { getInitials, getAvatarColor } from '../../utils'
import type { CandidateJob } from '../../../../types'
import styles from './PipelineCard.module.css'

export function CardContent({ item, onClick, isDragging = false, onDelete }: {
  item: CandidateJob
  onClick: () => void
  isDragging?: boolean
  onDelete?: (id: string) => void
}) {
  const src = SOURCE_COLORS[item.candidate?.source || 'MANUAL'] || SOURCE_COLORS.MANUAL
  const initials = getInitials(item.candidate?.firstName, item.candidate?.lastName)
  const avatarColor = getAvatarColor(item.candidateId)

  return (
    <div
      className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.candidate?.firstName} ${item.candidate?.lastName}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
    >
      <div className={styles.cardActions}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={e => { e.stopPropagation(); onClick() }}
          aria-label="View candidate"
          title="View candidate"
        >
          <Eye size={13} weight="bold" />
        </button>
        {onDelete && (
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
            onClick={e => { e.stopPropagation(); onDelete(item.id) }}
            aria-label="Remove from pipeline"
            title="Remove from pipeline"
          >
            <Trash size={13} weight="bold" />
          </button>
        )}
      </div>

      <div className={styles.cardTop}>
        <div className={styles.cardAvatar} style={{ background: avatarColor }}>{initials}</div>
        <div>
          <div className={styles.cardName}>{item.candidate?.firstName} {item.candidate?.lastName}</div>
          <div className={styles.cardRole}>{item.job?.title || item.candidate?.email}</div>
        </div>
      </div>
      {item.appliedAt && (
        <div className={styles.appliedAt}>{item.appliedAt}</div>
      )}

      <div className={styles.cardBottom}>
        <div className={styles.scoreWrap}>
          <div className={styles.scoreBar} aria-hidden="true">
            <div className={styles.scoreFill} style={{ width: `${item.aiScore || 0}%`, background: 'var(--c-accent)' }} />
          </div>
          <span className={styles.scoreVal} aria-label={`AI score ${item.aiScore ?? 0}%`}>
            {item.aiScore ? `${item.aiScore}%` : '—'}
          </span>
        </div>
        <span className={styles.sourceTag} style={{ background: src.bg, color: src.color }}>
          {item.candidate?.source || 'Manual'}
        </span>
      </div>
    </div>
  )
}

export function SortableCard({ item, onClick, onDelete }: {
  item: CandidateJob
  onClick: () => void
  onDelete?: (id: string) => void
}) {
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
      <CardContent item={item} onClick={onClick} onDelete={onDelete} />
    </div>
  )
}
