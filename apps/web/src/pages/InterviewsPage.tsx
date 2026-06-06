import { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AppLayout } from '../components/layout/AppLayout'
import {
  MagnifyingGlass,
  Plus,
  CalendarBlank,
  VideoCamera,
  Phone,
  Buildings,
  Clock,
  Users,
  X,
  DotsSixVertical,
} from '@phosphor-icons/react'
import styles from './InterviewsPage.module.css'
import { Select } from '../components/ui/Select'


interface Interview {
  id: string
  candidateName: string
  candidateRole: string
  candidateInitials: string
  jobTitle: string
  timeLabel: string
  dayLabel: string
  duration: number
  type: 'VIDEO' | 'PHONE' | 'ONSITE'
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
}

const INITIAL_INTERVIEWS: Interview[] = [
  { id: '1', candidateName: 'Alex Johnson', candidateRole: 'Senior Engineer', candidateInitials: 'AJ', jobTitle: 'Senior Full-Stack Engineer', timeLabel: '2:00 PM', dayLabel: 'Today', duration: 60, type: 'VIDEO', status: 'SCHEDULED' },
  { id: '2', candidateName: 'Maria Kim', candidateRole: 'Product Designer', candidateInitials: 'MK', jobTitle: 'Product Designer', timeLabel: '4:30 PM', dayLabel: 'Today', duration: 45, type: 'PHONE', status: 'SCHEDULED' },
  { id: '3', candidateName: 'Ryan Smith', candidateRole: 'Frontend Dev', candidateInitials: 'RS', jobTitle: 'Senior Full-Stack Engineer', timeLabel: '11:00 AM', dayLabel: 'Tomorrow', duration: 60, type: 'VIDEO', status: 'SCHEDULED' },
  { id: '4', candidateName: 'Priya Lal', candidateRole: 'Data Scientist', candidateInitials: 'PL', jobTitle: 'Data Scientist', timeLabel: '3:00 PM', dayLabel: 'Tomorrow', duration: 90, type: 'ONSITE', status: 'SCHEDULED' },
  { id: '5', candidateName: 'Tom Walker', candidateRole: 'Backend Dev', candidateInitials: 'TW', jobTitle: 'DevOps Engineer', timeLabel: '10:00 AM', dayLabel: 'Thu', duration: 60, type: 'VIDEO', status: 'SCHEDULED' },
  { id: '6', candidateName: 'Sarah Chen', candidateRole: 'UX Researcher', candidateInitials: 'SC', jobTitle: 'Product Designer', timeLabel: '2:00 PM', dayLabel: 'Thu', duration: 45, type: 'PHONE', status: 'COMPLETED' },
  { id: '7', candidateName: 'Nina Patel', candidateRole: 'ML Engineer', candidateInitials: 'NP', jobTitle: 'Data Scientist', timeLabel: '1:00 PM', dayLabel: 'Fri', duration: 60, type: 'VIDEO', status: 'CANCELLED' },
]

const DAYS = ['Today', 'Tomorrow', 'Thu', 'Fri']

const STATS = [
  { label: 'This week', value: '12', icon: CalendarBlank, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)' },
  { label: 'Scheduled', value: '8', icon: Clock, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)' },
  { label: 'Completed', value: '3', icon: Users, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)' },
  { label: 'Avg duration', value: '58m', icon: Clock, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)' },
]

const CALENDAR_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const CALENDAR_DATES = [
  { day: 2, hasEvent: false }, { day: 3, hasEvent: false }, { day: 4, hasEvent: true },
  { day: 5, hasEvent: false }, { day: 6, hasEvent: true }, { day: 7, hasEvent: false },
  { day: 8, hasEvent: false }, { day: 9, hasEvent: false }, { day: 10, hasEvent: false },
  { day: 11, hasEvent: true }, { day: 12, hasEvent: true }, { day: 13, hasEvent: false },
  { day: 14, hasEvent: false }, { day: 15, hasEvent: false }, { day: 16, hasEvent: false },
  { day: 17, hasEvent: false }, { day: 18, hasEvent: true }, { day: 19, hasEvent: false },
  { day: 20, hasEvent: false }, { day: 21, hasEvent: false }, { day: 22, hasEvent: false },
  { day: 23, hasEvent: false }, { day: 24, hasEvent: true }, { day: 25, hasEvent: false },
  { day: 26, hasEvent: false }, { day: 27, hasEvent: false }, { day: 28, hasEvent: false },
  { day: 29, hasEvent: false }, { day: 30, hasEvent: false },
]

const TODAY = 4

function InterviewCard({
  interview,
  onClick,
  isDragging = false,
}: {
  interview: Interview
  onClick: () => void
  isDragging?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortable } = useSortable({
    id: interview.id,
    data: { day: interview.dayLabel },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortable ? 0 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <InterviewCardContent
        interview={interview}
        onClick={onClick}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

function InterviewCardContent({
  interview,
  onClick,
  isDragging = false,
  dragHandleProps = {},
}: {
  interview: Interview
  onClick: () => void
  isDragging?: boolean
  dragHandleProps?: object
}) {
  const accentColor = interview.type === 'VIDEO' ? 'var(--c-accent)' : 'var(--c-orange)'

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
          <span className={styles.cDay}>{interview.dayLabel}</span>
          <span className={styles.cHour}>{interview.timeLabel}</span>
        </div>
        <div className={styles.cAvatar}>{interview.candidateInitials}</div>
        <div className={styles.cInfo}>
          <div className={styles.cName}>{interview.candidateName}</div>
          <div className={styles.cSub}>{interview.candidateRole} · {interview.jobTitle}</div>
        </div>
        <div className={styles.cRight}>
          <span className={`${styles.cBadge} ${
            interview.type === 'VIDEO' ? styles.badgeVideo :
            interview.type === 'PHONE' ? styles.badgePhone :
            styles.badgeOnsite
          }`}>
            {interview.type === 'VIDEO' ? <VideoCamera size={10} weight="fill" /> :
             interview.type === 'PHONE' ? <Phone size={10} weight="fill" /> :
             <Buildings size={10} weight="fill" />}
            {' '}{interview.type.charAt(0) + interview.type.slice(1).toLowerCase()}
          </span>
          <span className={`${styles.cBadge} ${
            interview.status === 'SCHEDULED' ? styles.statusScheduled :
            interview.status === 'COMPLETED' ? styles.statusCompleted :
            styles.statusCancelled
          }`}>
            {interview.status.charAt(0) + interview.status.slice(1).toLowerCase()}
          </span>
          <span className={styles.cDur}>{interview.duration} min</span>
        </div>
      </div>
    </div>
  )
}

function DayGroup({
  day,
  interviews,
  onCardClick,
}: {
  day: string
  interviews: Interview[]
  onCardClick: (iv: Interview) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: day })

  return (
    <div className={styles.dayGroup}>
      <div className={styles.dayHeader}>
        <span className={styles.dayLabel}>{day}</span>
        <span className={styles.dayCount}>{interviews.length} interviews</span>
        <div className={styles.dayDivider} />
      </div>

      <div
        ref={setNodeRef}
        className={`${styles.dayItems} ${isOver ? styles.dayItemsOver : ''}`}
        style={{ minHeight: 60 }}
      >
        <SortableContext
          items={interviews.map(iv => iv.id)}
          strategy={verticalListSortingStrategy}
        >
          {interviews.map(iv => (
            <InterviewCard
              key={iv.id}
              interview={iv}
              onClick={() => onCardClick(iv)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

function EditModal({
    interview,
    onClose,
    onSave,
  }: {
    interview: Interview
    onClose: () => void
    onSave: (updated: Interview) => void
  }) {
    const [form, setForm] = useState({ ...interview })
  
    const handleChange = (field: keyof Interview, value: string | number) => {
      setForm(prev => ({ ...prev, [field]: value }))
    }
  
    return (
      <div className={styles.modal}>
        <div className={styles.modalOverlay} onClick={onClose} />
        <div className={styles.modalBox}>
          <div className={styles.modalHeader}>
            <div className={styles.cAvatar}>{interview.candidateInitials}</div>
            <div>
              <div className={styles.modalName}>{interview.candidateName}</div>
              <div className={styles.modalRole}>{interview.candidateRole}</div>
            </div>
            <button className={styles.modalCloseBtn} onClick={onClose}>
              <X size={16} weight="bold" />
            </button>
          </div>
  
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Day</label>
              <Select
                value={form.dayLabel}
                onChange={v => handleChange('dayLabel', v)}
                options={DAYS.map(d => ({ value: d, label: d }))}
              />
            </div>
  
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Time</label>
              <input
                className={styles.formInput}
                value={form.timeLabel}
                onChange={e => handleChange('timeLabel', e.target.value)}
                placeholder="2:00 PM"
              />
            </div>
  
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Duration (min)</label>
              <input
                className={styles.formInput}
                type="number"
                value={form.duration}
                onChange={e => handleChange('duration', parseInt(e.target.value))}
              />
            </div>
  
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Type</label>
              <Select
                value={form.type}
                onChange={v => handleChange('type', v)}
                options={[
                  { value: 'VIDEO', label: 'Video' },
                  { value: 'PHONE', label: 'Phone' },
                  { value: 'ONSITE', label: 'Onsite' },
                ]}
              />
            </div>
  
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Status</label>
              <Select
                value={form.status}
                onChange={v => handleChange('status', v)}
                options={[
                  { value: 'SCHEDULED', label: 'Scheduled' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'CANCELLED', label: 'Cancelled' },
                ]}
              />
            </div>
  
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Job title</label>
              <input
                className={styles.formInput}
                value={form.jobTitle}
                onChange={e => handleChange('jobTitle', e.target.value)}
              />
            </div>
          </div>
  
          <div className={styles.modalFooter}>
            <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button className={styles.saveBtn} onClick={() => { onSave(form); onClose() }}>
              Save changes
            </button>
          </div>
        </div>
      </div>
    )
  }

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>(INITIAL_INTERVIEWS)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const activeInterview = interviews.find(iv => iv.id === activeId)

  const filtered = useMemo(() => {
    return interviews.filter(iv => {
      const matchSearch = search === '' ||
        iv.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        iv.jobTitle.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'All' || iv.type === typeFilter
      const matchStatus = statusFilter === 'All' || iv.status === statusFilter
      return matchSearch && matchType && matchStatus
    })
  }, [interviews, search, typeFilter, statusFilter])

  const getByDay = (day: string) => filtered.filter(iv => iv.dayLabel === day)

  const findDay = (id: string) => {
    if (DAYS.includes(id)) return id
    return interviews.find(iv => iv.id === id)?.dayLabel
  }

  const handleDragStart = ({ active }: { active: { id: string | number } }) => {
    setActiveId(active.id as string)
  }

  const handleDragOver = ({ active, over }: { active: { id: string | number }; over: { id: string | number } | null }) => {
    if (!over) return
    const from = findDay(active.id as string)
    const to = findDay(over.id as string)
    if (!from || !to || from === to) return
    setInterviews(prev =>
      prev.map(iv => iv.id === active.id ? { ...iv, dayLabel: to } : iv)
    )
  }

  const handleDragEnd = ({ active, over }: { active: { id: string | number }; over: { id: string | number } | null }) => {
    setActiveId(null)
    if (!over || active.id === over.id) return
    const from = findDay(active.id as string)
    const to = findDay(over.id as string)
    if (!from || !to || from !== to) return
    setInterviews(prev => {
      const inDay = prev.filter(iv => iv.dayLabel === from)
      const rest = prev.filter(iv => iv.dayLabel !== from)
      const oldIdx = inDay.findIndex(iv => iv.id === active.id)
      const newIdx = inDay.findIndex(iv => iv.id === over.id)
      return [...rest, ...arrayMove(inDay, oldIdx, newIdx)]
    })
  }

  const handleSave = (updated: Interview) => {
    setInterviews(prev => prev.map(iv => iv.id === updated.id ? updated : iv))
  }

  const upcoming = interviews.filter(iv => iv.status === 'SCHEDULED').slice(0, 4)

  return (
    <AppLayout title="Interviews">
      <div className={styles.page}>
        <div className={styles.statsRow}>
          {STATS.map((stat, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: stat.iconBg, color: stat.iconColor }}>
                <stat.icon size={20} weight="fill" />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <MagnifyingGlass size={14} weight="bold" color="var(--c-ink-muted)" />
            <input
              className={styles.searchInput}
              placeholder="Search interviews..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <Select
  value={typeFilter}
  onChange={setTypeFilter}
  options={[
    { value: 'All', label: 'All types' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'PHONE', label: 'Phone' },
    { value: 'ONSITE', label: 'Onsite' },
  ]}
/>

<Select
  value={statusFilter}
  onChange={setStatusFilter}
  options={[
    { value: 'All', label: 'All statuses' },
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ]}
/>

          <button className={styles.addBtn}>
            <Plus size={14} weight="bold" />
            Schedule interview
          </button>
        </div>

        <div className={styles.content}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className={styles.listCard}>
              {DAYS.map(day => (
                getByDay(day).length > 0 || true ? (
                  <DayGroup
                    key={day}
                    day={day}
                    interviews={getByDay(day)}
                    onCardClick={setSelectedInterview}
                  />
                ) : null
              ))}
            </div>

            <DragOverlay>
              {activeInterview && (
                <InterviewCardContent
                  interview={activeInterview}
                  onClick={() => {}}
                  isDragging
                />
              )}
            </DragOverlay>
          </DndContext>

          <div className={styles.sideCard}>
            <div className={styles.sideTitle}>June 2026</div>
            <div className={styles.calendarGrid}>
              {CALENDAR_DAYS.map(d => (
                <div key={d} className={styles.calendarDayHeader}>{d}</div>
              ))}
              {CALENDAR_DATES.map(({ day, hasEvent }) => (
                <div
                  key={day}
                  className={`${styles.calendarDay} ${day === TODAY ? styles.calendarDayActive : ''} ${hasEvent && day !== TODAY ? styles.calendarDayHasEvent : ''}`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div>
              <div className={styles.sideTitle} style={{ marginBottom: 12 }}>Upcoming</div>
              <div className={styles.upcomingList}>
                {upcoming.map(iv => (
                  <div key={iv.id} className={styles.upcomingItem}>
                    <div
                      className={styles.upcomingDot}
                      style={{ background: iv.type === 'VIDEO' ? 'var(--c-accent)' : 'var(--c-orange)' }}
                    />
                    <div className={styles.upcomingName}>{iv.candidateName}</div>
                    <div className={styles.upcomingTime}>{iv.timeLabel}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedInterview && (
        <EditModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
          onSave={handleSave}
        />
      )}
    </AppLayout>
  )
}