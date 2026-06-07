import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { VideoCamera, Phone, Buildings, DotsSixVertical, GoogleLogo } from '@phosphor-icons/react'
import type { Interview } from '../../../../types'
import { getInitials } from '../../utils/avatar'
import { formatTime, formatDayLabel } from '../../utils/date'
import { openGoogleCalendar } from '../../utils/calendar'
import styles from './InterviewCard.module.css'

export function InterviewCardContent({
  interview, onClick, isDragging = false, dragHandleProps = {},
}: {
  interview: Interview
  onClick: () => void
  isDragging?: boolean
  dragHandleProps?: object
}) {
  const accentColor = interview.type === 'VIDEO' ? 'var(--c-accent)' : 'var(--c-orange)'
  const initials = getInitials(interview.candidate?.firstName, interview.candidate?.lastName)

  return (
    <div
      className={`${styles.cItem} ${isDragging ? styles.cItemDragging : ''}`}
      onClick={onClick}
    >
      <div className={styles.cAccent} style={{ background: accentColor }} />
      <div className={styles.cInner}>
        <div className={styles.dragHandle} {...dragHandleProps} onClick={e => e.stopPropagation()}>
          <DotsSixVertical size={14} weight="bold" />
        </div>
        <div className={styles.cTime}>
          <span className={styles.cDay}>{formatDayLabel(interview.scheduledAt)}</span>
          <span className={styles.cHour}>{formatTime(interview.scheduledAt)}</span>
        </div>
        <div className={styles.cAvatar}>{initials}</div>
        <div className={styles.cInfo}>
          <div className={styles.cName}>
            {interview.candidate?.firstName} {interview.candidate?.lastName}
          </div>
          <div className={styles.cSub}>
            {interview.notes || 'No notes'} · {interview.duration || 60}min
          </div>
        </div>
        <div className={styles.cRight}>
          <span className={`${styles.cBadge} ${
            interview.type === 'VIDEO' ? styles.badgeVideo :
            interview.type === 'PHONE' ? styles.badgePhone : styles.badgeOnsite
          }`}>
            {interview.type === 'VIDEO' ? <VideoCamera size={10} weight="fill" /> :
             interview.type === 'PHONE' ? <Phone size={10} weight="fill" /> :
             <Buildings size={10} weight="fill" />}
            {' '}{interview.type?.charAt(0) + interview.type?.slice(1).toLowerCase()}
          </span>
          <span className={`${styles.cBadge} ${
            interview.status === 'SCHEDULED' ? styles.statusScheduled :
            interview.status === 'COMPLETED' ? styles.statusCompleted :
            styles.statusCancelled
          }`}>
            {interview.status?.charAt(0) + interview.status?.slice(1).toLowerCase()}
          </span>
          <button
            className={styles.gcalBtn}
            onClick={e => { e.stopPropagation(); openGoogleCalendar(interview) }}
          >
            <GoogleLogo size={11} weight="fill" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export function InterviewCard({ interview, onClick }: { interview: Interview; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: interview.id,
    data: { day: new Date(interview.scheduledAt).toDateString() },
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0 : 1 }}
    >
      <InterviewCardContent
        interview={interview}
        onClick={onClick}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}
