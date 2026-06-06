import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCenter, useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AppLayout } from '../components/layout/AppLayout'
import { Select } from '../components/ui/Select'
import { FormInput } from '../components/ui/FormInput'
import {
  MagnifyingGlass, Plus, X, VideoCamera, Phone, Buildings,
  CalendarBlank, Clock, Users, DotsSixVertical, GoogleLogo, Trash,
} from '@phosphor-icons/react'
import { interviewsApi } from '../api/interviews'
import { candidatesApi } from '../api/candidates'
import { jobsApi } from '../api/jobs'
import type { Interview } from '../types'
import styles from './InterviewsPage.module.css'

const CALENDAR_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

const TYPE_OPTIONS = [
  { value: 'VIDEO', label: 'Video' },
  { value: 'PHONE', label: 'Phone' },
  { value: 'ONSITE', label: 'Onsite' },
]

const STATUS_OPTIONS = [
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
}

function formatTime(scheduledAt: string) {
  return new Date(scheduledAt).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

function formatDayLabel(scheduledAt: string) {
  const d = new Date(scheduledAt)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

function groupByDay(interviews: Interview[]) {
  const groups: Record<string, Interview[]> = {}
  const sorted = [...interviews].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  )
  sorted.forEach(iv => {
    const key = new Date(iv.scheduledAt).toDateString()
    if (!groups[key]) groups[key] = []
    groups[key].push(iv)
  })
  return groups
}

function openGoogleCalendar(interview: Interview) {
  const start = new Date(interview.scheduledAt)
  const end = new Date(start.getTime() + (interview.duration || 60) * 60000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const name = `${interview.candidate?.firstName} ${interview.candidate?.lastName}`
  const url = new URL('https://calendar.google.com/calendar/render')
  url.searchParams.set('action', 'TEMPLATE')
  url.searchParams.set('text', `Interview: ${name}`)
  url.searchParams.set('dates', `${fmt(start)}/${fmt(end)}`)
  url.searchParams.set('details', `${interview.type} interview · ${interview.notes || ''}`)
  if (interview.meetLink) url.searchParams.set('location', interview.meetLink)
  window.open(url.toString(), '_blank')
}

function InterviewCard({ interview, onClick }: { interview: Interview; onClick: () => void }) {
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

function InterviewCardContent({
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

function DayGroup({ dayKey, interviews, onCardClick }: {
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

function InterviewModal({ interview, onClose, onSave, onDelete }: {
  interview: Interview
  onClose: () => void
  onSave: (data: Partial<Interview>) => void
  onDelete: (id: string) => void
}) {
  const d = new Date(interview.scheduledAt)
  const [form, setForm] = useState({
    date: d.toISOString().split('T')[0],
    time: d.toTimeString().slice(0, 5),
    duration: String(interview.duration || 60),
    type: interview.type || 'VIDEO',
    status: interview.status || 'SCHEDULED',
    notes: interview.notes || '',
    meetLink: interview.meetLink || '',
  })

  const handleSave = () => {
    const scheduledAt = new Date(`${form.date}T${form.time}`).toISOString()
    onSave({
      scheduledAt,
      duration: Number(form.duration),
      type: form.type as Interview['type'],
      status: form.status as Interview['status'],
      notes: form.notes,
      meetLink: form.meetLink || undefined,
    })
    onClose()
  }

  const initials = getInitials(interview.candidate?.firstName, interview.candidate?.lastName)

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div className={styles.modalAvatar}>{initials}</div>
          <div>
            <div className={styles.modalName}>
              {interview.candidate?.firstName} {interview.candidate?.lastName}
            </div>
            <div className={styles.modalRole}>{interview.candidate?.email}</div>
          </div>
          <div className={styles.modalActions}>
            <button className={styles.gcalActionBtn} onClick={() => openGoogleCalendar(interview)}>
              <GoogleLogo size={14} weight="fill" />
              Add to Google Calendar
            </button>
            <button className={styles.modalCloseBtn} onClick={onClose}>
              <X size={16} weight="bold" />
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.twoCol}>
            <FormInput label="Date" type="date" value={form.date} onChange={v => setForm(p => ({ ...p, date: v }))} />
            <FormInput label="Time" type="time" value={form.time} onChange={v => setForm(p => ({ ...p, time: v }))} />
          </div>

          <div className={styles.twoCol}>
            <FormInput label="Duration (min)" type="number" value={form.duration} onChange={v => setForm(p => ({ ...p, duration: v }))} placeholder="60" />
            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>Type</div>
              <Select fullWidth value={form.type} onChange={v => setForm(p => ({ ...p, type: v }))} options={TYPE_OPTIONS} />
            </div>
          </div>

          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Status</div>
            <Select fullWidth value={form.status} onChange={v => setForm(p => ({ ...p, status: v }))} options={STATUS_OPTIONS} />
          </div>

          <FormInput label="Meet link" value={form.meetLink} onChange={v => setForm(p => ({ ...p, meetLink: v }))} placeholder="https://meet.google.com/..." />
          <FormInput label="Notes" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} placeholder="Add notes about this interview..." />
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.deleteBtn} onClick={() => { onDelete(interview.id); onClose() }}>
            <Trash size={14} weight="fill" />
            Delete
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave}>Save changes</button>
        </div>
      </div>
    </div>
  )
}

function ScheduleModal({ onClose, onSave, candidates, jobs }: {
  onClose: () => void
  onSave: (data: Partial<Interview>) => void
  candidates: { id: string; firstName?: string; lastName?: string }[]
  jobs: { id: string; title: string }[]
}) {
  const today = new Date()
  const [form, setForm] = useState({
    candidateId: '',
    jobId: '',
    date: today.toISOString().split('T')[0],
    time: '10:00',
    duration: '60',
    type: 'VIDEO',
    meetLink: '',
    notes: '',
  })

  const handleSave = () => {
    if (!form.candidateId || !form.jobId) return
    const scheduledAt = new Date(`${form.date}T${form.time}`).toISOString()
    onSave({
      candidateId: form.candidateId,
      jobId: form.jobId,
      scheduledAt,
      duration: Number(form.duration),
      type: form.type as Interview['type'],
      status: 'SCHEDULED',
      meetLink: form.meetLink || undefined,
      notes: form.notes || undefined,
    })
    onClose()
  }

  const candidateOptions = candidates.map(c => ({
    value: c.id,
    label: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.id,
  }))

  const jobOptions = jobs.map(j => ({ value: j.id, label: j.title }))

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalName}>Schedule interview</div>
            <div className={styles.modalRole}>Set up a new interview</div>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Candidate *</div>
            <Select
              fullWidth
              value={form.candidateId}
              onChange={v => setForm(p => ({ ...p, candidateId: v }))}
              options={[{ value: '', label: 'Select candidate...' }, ...candidateOptions]}
            />
          </div>

          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Job position *</div>
            <Select
              fullWidth
              value={form.jobId}
              onChange={v => setForm(p => ({ ...p, jobId: v }))}
              options={[{ value: '', label: 'Select job...' }, ...jobOptions]}
            />
          </div>

          <div className={styles.twoCol}>
            <FormInput label="Date" type="date" value={form.date} onChange={v => setForm(p => ({ ...p, date: v }))} />
            <FormInput label="Time" type="time" value={form.time} onChange={v => setForm(p => ({ ...p, time: v }))} />
          </div>

          <div className={styles.twoCol}>
            <FormInput label="Duration (min)" type="number" value={form.duration} onChange={v => setForm(p => ({ ...p, duration: v }))} placeholder="60" />
            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>Type</div>
              <Select fullWidth value={form.type} onChange={v => setForm(p => ({ ...p, type: v }))} options={TYPE_OPTIONS} />
            </div>
          </div>

          <FormInput label="Meet link (optional)" value={form.meetLink} onChange={v => setForm(p => ({ ...p, meetLink: v }))} placeholder="https://meet.google.com/..." />
          <FormInput label="Notes (optional)" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} placeholder="Add notes..." />
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave}>Schedule</button>
        </div>
      </div>
    </div>
  )
}

function Calendar({ currentMonth, onMonthChange, interviews, selectedDate, onDateSelect }: {
  currentMonth: Date
  onMonthChange: (d: Date) => void
  interviews: Interview[]
  selectedDate: string | null
  onDateSelect: (date: string) => void
}) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDow = (firstDay.getDay() + 6) % 7
  const today = new Date().toDateString()

  const eventDays = new Set(interviews.map(iv => new Date(iv.scheduledAt).toDateString()))

  const days: (number | null)[] = []
  for (let i = 0; i < startDow; i++) days.push(null)
  for (let i = 1; i <= lastDay.getDate(); i++) days.push(i)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className={styles.calendarHeader}>
        <button className={styles.calNavBtn} onClick={() => onMonthChange(new Date(year, month - 1, 1))}>‹</button>
        <div className={styles.sideTitle}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <button className={styles.calNavBtn} onClick={() => onMonthChange(new Date(year, month + 1, 1))}>›</button>
      </div>

      <div className={styles.calendarGrid}>
        {CALENDAR_DAYS.map(d => (
          <div key={d} className={styles.calendarDayHeader}>{d}</div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />
          const dateStr = new Date(year, month, day).toDateString()
          const isToday = dateStr === today
          const hasEvent = eventDays.has(dateStr)
          const isSelected = selectedDate === dateStr

          return (
            <div
              key={day}
              className={[
                styles.calendarDay,
                isToday ? styles.calendarDayActive : '',
                isSelected && !isToday ? styles.calendarDaySelected : '',
                hasEvent && !isToday ? styles.calendarDayHasEvent : '',
              ].join(' ')}
              onClick={() => onDateSelect(isSelected ? '' : dateStr)}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function InterviewsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const { data: interviewsData } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => interviewsApi.getAll(),
  })

  const { data: candidatesData } = useQuery({
    queryKey: ['candidates-all'],
    queryFn: () => candidatesApi.getAll({ limit: 500 }),
  })

  const { data: jobsData } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: Partial<Interview>) => interviewsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interviews'] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Interview> }) =>
      interviewsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => interviewsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interviews'] }),
  })

  const allInterviews = interviewsData?.interviews || []

  const filtered = useMemo(() => allInterviews.filter(iv => {
    const matchSearch = search === '' ||
      `${iv.candidate?.firstName} ${iv.candidate?.lastName}`.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || iv.type === typeFilter
    const matchStatus = statusFilter === 'All' || iv.status === statusFilter
    const matchDate = !selectedDate || new Date(iv.scheduledAt).toDateString() === selectedDate
    return matchSearch && matchType && matchStatus && matchDate
  }), [allInterviews, search, typeFilter, statusFilter, selectedDate])

  const grouped = useMemo(() => groupByDay(filtered), [filtered])

  const stats = useMemo(() => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)
    return {
      thisWeek: allInterviews.filter(iv => { const d = new Date(iv.scheduledAt); return d >= weekStart && d <= weekEnd }).length,
      scheduled: allInterviews.filter(iv => iv.status === 'SCHEDULED').length,
      completed: allInterviews.filter(iv => iv.status === 'COMPLETED').length,
      avgDuration: allInterviews.length
        ? Math.round(allInterviews.reduce((acc, iv) => acc + (iv.duration || 60), 0) / allInterviews.length)
        : 0,
    }
  }, [allInterviews])

  const STATS = [
    { label: 'This week', value: String(stats.thisWeek), icon: CalendarBlank, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)' },
    { label: 'Scheduled', value: String(stats.scheduled), icon: Clock, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)' },
    { label: 'Completed', value: String(stats.completed), icon: Users, iconBg: 'rgba(0,153,255,0.1)', iconColor: 'var(--c-accent)' },
    { label: 'Avg duration', value: `${stats.avgDuration}m`, icon: Clock, iconBg: 'rgba(0,153,255,0.1)', iconColor: 'var(--c-accent)' },
  ]

  const upcoming = useMemo(() =>
    allInterviews
      .filter(iv => iv.status === 'SCHEDULED' && new Date(iv.scheduledAt) >= new Date())
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
      .slice(0, 5),
    [allInterviews]
  )

  const activeInterview = allInterviews.find(iv => iv.id === activeId)

  const findDay = (id: string) => {
    if (Object.keys(grouped).includes(id)) return id
    const iv = allInterviews.find(iv => iv.id === id)
    return iv ? new Date(iv.scheduledAt).toDateString() : undefined
  }

  const handleDragStart = ({ active }: { active: { id: string | number } }) => {
    setActiveId(active.id as string)
  }

  const handleDragOver = ({ active, over }: { active: { id: string | number }; over: { id: string | number } | null }) => {
    if (!over) return
    const fromIv = allInterviews.find(iv => iv.id === active.id)
    if (!fromIv) return
    const toDay = findDay(over.id as string)
    if (!toDay) return
    const fromDay = new Date(fromIv.scheduledAt).toDateString()
    if (fromDay === toDay) return
    const newDate = new Date(fromIv.scheduledAt)
    const toDate = new Date(toDay)
    newDate.setFullYear(toDate.getFullYear(), toDate.getMonth(), toDate.getDate())
    queryClient.setQueryData(['interviews'], (old: { interviews: Interview[] } | undefined) => {
      if (!old) return old
      return { ...old, interviews: old.interviews.map(iv => iv.id === active.id ? { ...iv, scheduledAt: newDate.toISOString() } : iv) }
    })
  }

  const handleDragEnd = ({ active, over }: { active: { id: string | number }; over: { id: string | number } | null }) => {
    setActiveId(null)
    if (!over || active.id === over.id) return
    const fromIv = allInterviews.find(iv => iv.id === active.id)
    if (!fromIv) return
    const toDay = findDay(over.id as string)
    const fromDay = new Date(fromIv.scheduledAt).toDateString()
    if (toDay && fromDay !== toDay) {
      const newDate = new Date(fromIv.scheduledAt)
      const toDate = new Date(toDay)
      newDate.setFullYear(toDate.getFullYear(), toDate.getMonth(), toDate.getDate())
      updateMutation.mutate({ id: active.id as string, data: { scheduledAt: newDate.toISOString() } })
      return
    }
    if (fromDay === toDay) {
      queryClient.setQueryData(['interviews'], (old: { interviews: Interview[] } | undefined) => {
        if (!old) return old
        const inDay = old.interviews.filter(iv => new Date(iv.scheduledAt).toDateString() === fromDay)
        const rest = old.interviews.filter(iv => new Date(iv.scheduledAt).toDateString() !== fromDay)
        const oldIdx = inDay.findIndex(iv => iv.id === active.id)
        const newIdx = inDay.findIndex(iv => iv.id === over.id)
        return { ...old, interviews: [...rest, ...arrayMove(inDay, oldIdx, newIdx)] }
      })
    }
  }

  const sideListInterviews = selectedDate
    ? allInterviews.filter(iv => new Date(iv.scheduledAt).toDateString() === selectedDate)
    : upcoming

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

          <Select value={typeFilter} onChange={setTypeFilter} options={[{ value: 'All', label: 'All types' }, ...TYPE_OPTIONS]} />
          <Select value={statusFilter} onChange={setStatusFilter} options={[{ value: 'All', label: 'All statuses' }, ...STATUS_OPTIONS]} />

          {selectedDate && (
            <button className={styles.cancelBtn} onClick={() => setSelectedDate('')} style={{ marginLeft: 0 }}>
              Clear filter
            </button>
          )}

          <button className={styles.addBtn} onClick={() => setShowScheduleModal(true)}>
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
              {Object.keys(grouped).length === 0 ? (
                <div className={styles.empty}>
                  <CalendarBlank size={40} weight="thin" />
                  <div className={styles.emptyTitle}>
                    {selectedDate ? 'No interviews on this day' : 'No interviews found'}
                  </div>
                </div>
              ) : (
                Object.entries(grouped).map(([dayKey, ivs]) => (
                  <DayGroup key={dayKey} dayKey={dayKey} interviews={ivs} onCardClick={setSelectedInterview} />
                ))
              )}
            </div>

            <DragOverlay>
              {activeInterview && (
                <InterviewCardContent interview={activeInterview} onClick={() => {}} isDragging />
              )}
            </DragOverlay>
          </DndContext>

          <div className={styles.sideCard}>
            <Calendar
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              interviews={allInterviews}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />

            <div>
              <div className={styles.sideTitle} style={{ marginBottom: 10 }}>
                {selectedDate
                  ? `${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : 'Upcoming'}
              </div>
              <div className={styles.upcomingList}>
                {sideListInterviews.length === 0 ? (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--c-ink-muted)', textAlign: 'center', padding: '12px 0' }}>
                    No interviews
                  </div>
                ) : (
                  sideListInterviews.map(iv => (
                    <div key={iv.id} className={styles.upcomingItem} onClick={() => setSelectedInterview(iv)}>
                      <div className={styles.upcomingDot} style={{ background: iv.type === 'VIDEO' ? 'var(--c-accent)' : 'var(--c-orange)' }} />
                      <div className={styles.upcomingName}>
                        {iv.candidate?.firstName} {iv.candidate?.lastName}
                      </div>
                      <div className={styles.upcomingTime}>{formatTime(iv.scheduledAt)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedInterview && (
        <InterviewModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
          onSave={data => updateMutation.mutate({ id: selectedInterview.id, data })}
          onDelete={id => deleteMutation.mutate(id)}
        />
      )}

      {showScheduleModal && (
        <ScheduleModal
          onClose={() => setShowScheduleModal(false)}
          onSave={data => createMutation.mutate(data)}
          candidates={candidatesData?.candidates || []}
          jobs={jobsData?.jobs || []}
        />
      )}
    </AppLayout>
  )
}