import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Interview } from '../../../../types'
import { formatDayLabel } from '../../utils/date'
import { InterviewCard } from '../InterviewCard/InterviewCard'
import styles from './DayGroup.module.css'

export function DayGroup({ dayKey, interviews, onCardClick }: {
  dayKey: string
  interviews: Interview[]
  onCardClick: (iv: Interview) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: dayKey })
  const label = formatDayLabel(interviews[0]?.scheduledAt || dayKey)
  const isToday = new Date().toDateString() === dayKey

  return (
    <div className={styles.dayGroup}>
      <div className={styles.dayHeader}>
        <span className={`${styles.dayLabel} ${isToday ? styles.dayLabelToday : ''}`}>
          {label}
        </span>
        <span className={styles.dayCount}>
          {interviews.length} interview{interviews.length !== 1 ? 's' : ''}
        </span>
        <div className={styles.dayDivider} />
      </div>
      <div
        ref={setNodeRef}
        className={`${styles.dayItems} ${isOver ? styles.dayItemsOver : ''}`}
      >
        <SortableContext items={interviews.map(iv => iv.id)} strategy={verticalListSortingStrategy}>
          {interviews.map(iv => (
            <InterviewCard key={iv.id} interview={iv} onClick={() => onCardClick(iv)} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
