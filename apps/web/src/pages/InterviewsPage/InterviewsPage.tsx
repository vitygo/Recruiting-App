import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { MagnifyingGlass, Plus, CalendarBlank, Clock, Users } from '@phosphor-icons/react'
import { AppLayout } from '../../components/layout/AppLayout'
import { Select } from '../../components/ui/Select'
import { interviewsApi } from '../../api/interviews'
import { candidatesApi } from '../../api/candidates'
import { jobsApi } from '../../api/jobs'
import type { Interview } from '../../types'
import { DayGroup } from './components/DayGroup/DayGroup'
import { InterviewCardContent } from './components/InterviewCard/InterviewCard'
import { InterviewModal } from './components/InterviewModal/InterviewModal'
import { ScheduleModal } from './components/ScheduleModal/ScheduleModal'
import { SidePanel } from './components/SidePanel/SidePanel'
import { TYPE_OPTIONS, STATUS_OPTIONS } from './constants'
import { groupByDay } from './utils/date'
import styles from './InterviewsPage.module.css'

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

  const { data: interviewsData, isLoading: interviewsLoading } = useQuery({
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      setShowScheduleModal(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Interview> }) =>
      interviewsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setSelectedInterview(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => interviewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      setSelectedInterview(null)
    },
  })

  const allInterviews = interviewsData?.interviews ?? []

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
      thisWeek: allInterviews.filter(iv => {
        const d = new Date(iv.scheduledAt)
        return d >= weekStart && d <= weekEnd
      }).length,
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

  const activeInterview = allInterviews.find(iv => iv.id === activeId)

  const findDay = (id: string) => {
    if (Object.keys(grouped).includes(id)) return id
    const iv = allInterviews.find(iv => iv.id === id)
    return iv ? new Date(iv.scheduledAt).toDateString() : undefined
  }

  const handleDragStart = ({ active }: { active: { id: string | number } }) => {
    setActiveId(active.id as string)
  }

  const handleDragOver = ({ active, over }: {
    active: { id: string | number }
    over: { id: string | number } | null
  }) => {
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
      return {
        ...old,
        interviews: old.interviews.map(iv =>
          iv.id === active.id ? { ...iv, scheduledAt: newDate.toISOString() } : iv
        ),
      }
    })
  }

  const handleDragEnd = ({ active, over }: {
    active: { id: string | number }
    over: { id: string | number } | null
  }) => {
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
        const rest  = old.interviews.filter(iv => new Date(iv.scheduledAt).toDateString() !== fromDay)
        const oldIdx = inDay.findIndex(iv => iv.id === active.id)
        const newIdx = inDay.findIndex(iv => iv.id === over.id)
        return { ...old, interviews: [...rest, ...arrayMove(inDay, oldIdx, newIdx)] }
      })
    }
  }

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
              aria-label="Search interviews"
            />
          </div>

          <Select value={typeFilter} onChange={setTypeFilter} options={[{ value: 'All', label: 'All types' }, ...TYPE_OPTIONS]} />
          <Select value={statusFilter} onChange={setStatusFilter} options={[{ value: 'All', label: 'All statuses' }, ...STATUS_OPTIONS]} />

          {selectedDate && (
            <button className={styles.clearBtn} onClick={() => setSelectedDate('')} style={{ marginLeft: 0 }}>
              Clear filter
            </button>
          )}

          <button
            className={styles.addBtn}
            onClick={() => setShowScheduleModal(true)}
            aria-label="Schedule a new interview"
          >
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
              {interviewsLoading ? null : Object.keys(grouped).length === 0 ? (
                <div className={styles.empty}>
                  <CalendarBlank size={40} weight="thin" />
                  <div className={styles.emptyTitle}>
                    {selectedDate ? 'No interviews on this day' : 'No interviews scheduled'}
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

          <SidePanel
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            allInterviews={allInterviews}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onInterviewClick={setSelectedInterview}
          />
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
