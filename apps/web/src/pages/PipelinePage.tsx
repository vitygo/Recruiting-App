import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import { MagnifyingGlass, Plus, X, Envelope, CalendarBlank, Sparkle, DotsSixVertical } from '@phosphor-icons/react'
import { pipelineApi } from '../api/pipeline'
import { jobsApi } from '../api/jobs'
import { candidatesApi } from '../api/candidates'
import type { CandidateJob, PipelineStage } from '../types'
import styles from './PipelinePage.module.css'
import { Select } from '../components/ui/Select'
import { FormInput } from '../components/ui/FormInput'


const STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'APPLIED', label: 'Applied', color: '#9ca3af' },
  { id: 'SCREENING', label: 'Screening', color: 'var(--c-accent)' },
  { id: 'INTERVIEW', label: 'Interview', color: 'var(--c-orange)' },
  { id: 'OFFER', label: 'Offer', color: '#f97316' },
  { id: 'HIRED', label: 'Hired', color: 'var(--c-success)' },
]

const SOURCE_COLORS: Record<string, { bg: string; color: string }> = {
  LINKEDIN: { bg: 'rgba(0,119,181,0.12)', color: '#0077b5' },
  INDEED: { bg: 'rgba(255,122,61,0.12)', color: '#ff7a3d' },
  REFERRAL: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  MANUAL: { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
  OTHER: { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
}

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
}

function Column({ stage, items, onCardClick }: {
  stage: typeof STAGES[0]
  items: CandidateJob[]
  onCardClick: (item: CandidateJob) => void
}) {
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
        <button className={styles.addCardBtn}>
          <Plus size={13} weight="bold" />
          Add candidate
        </button>
      </div>
    </div>
  )
}

function SortableCard({ item, onClick }: { item: CandidateJob; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: { stage: item.stage },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardContent item={item} onClick={onClick} />
    </div>
  )
}

function CardContent({ item, onClick, isDragging = false }: {
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
          <div className={styles.cardName}>
            {item.candidate?.firstName} {item.candidate?.lastName}
          </div>
          <div className={styles.cardRole}>{item.candidate?.email}</div>
        </div>
      </div>
      <div className={styles.cardBottom}>
        <div className={styles.scoreWrap}>
          <div className={styles.scoreBar}>
            <div
              className={styles.scoreFill}
              style={{ width: `${item.aiScore || 0}%`, background: 'var(--c-accent)' }}
            />
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

function CandidateModal({ item, onClose, onStageChange }: {
  item: CandidateJob
  onClose: () => void
  onStageChange: (stage: PipelineStage) => void
}) {
  const currentStageIdx = STAGES.findIndex(s => s.id === item.stage)
  const initials = getInitials(item.candidate?.firstName, item.candidate?.lastName)

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div className={styles.modalAvatar}>{initials}</div>
          <div>
            <div className={styles.modalName}>
              {item.candidate?.firstName} {item.candidate?.lastName}
            </div>
            <div className={styles.modalRole}>
              {item.candidate?.location || 'No location'} · {item.candidate?.source}
            </div>
          </div>
          <div className={styles.modalActions}>
            <button className={styles.modalActionBtn}><Envelope size={16} weight="fill" /></button>
            <button className={styles.modalActionBtn}><CalendarBlank size={16} weight="fill" /></button>
            <button className={styles.modalCloseBtn} onClick={onClose}><X size={16} weight="bold" /></button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Pipeline stage</div>
            <div className={styles.stagePills}>
              {STAGES.map((stage, idx) => (
                <button
                  key={stage.id}
                  className={`${styles.stagePill} ${stage.id === item.stage ? styles.stagePillActive : ''} ${idx < currentStageIdx ? styles.stagePillDone : ''}`}
                  onClick={() => onStageChange(stage.id)}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.twoCol}>
            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>Contact</div>
              <div className={styles.infoRow}>
                <Envelope size={14} weight="fill" className={styles.infoIcon} />
                {item.candidate?.email || '—'}
              </div>
              {item.candidate?.phone && (
                <div className={styles.infoRow}>
                  <Sparkle size={14} weight="fill" className={styles.infoIcon} />
                  {item.candidate.phone}
                </div>
              )}
            </div>

            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>AI Score</div>
              <div className={styles.aiScoreBox}>
                <div className={styles.aiScoreTop}>
                  <div>
                    <div className={styles.aiScoreVal}>{item.aiScore ? `${item.aiScore}%` : '—'}</div>
                    <div className={styles.aiScoreLabel}>match score</div>
                  </div>
                  <Sparkle size={20} weight="fill" color="var(--c-orange)" />
                </div>
                <div className={styles.aiBarWrap}>
                  <div className={styles.aiBar} style={{ width: `${item.aiScore || 0}%` }} />
                </div>
                {item.aiReason && (
                  <div className={styles.aiTags}>
                    <span className={styles.aiTag}>{item.aiReason}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddCandidateModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    location: string
    source: string
  }) => void
}) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    source: 'MANUAL',
  })

  const handleSubmit = () => {
    if (!form.firstName || !form.email) return
    onAdd(form)
    onClose()
  }

  const sourceOptions = [
    { value: 'MANUAL', label: 'Manual' },
    { value: 'LINKEDIN', label: 'LinkedIn' },
    { value: 'INDEED', label: 'Indeed' },
    { value: 'REFERRAL', label: 'Referral' },
    { value: 'CAREERS_PAGE', label: 'Careers Page' },
    { value: 'OTHER', label: 'Other' },
  ]

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalName}>Add candidate</div>
            <div className={styles.modalRole}>Fill in the candidate details</div>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.twoCol}>
            <FormInput
              label="First name"
              required
              value={form.firstName}
              onChange={v => setForm(p => ({ ...p, firstName: v }))}
              placeholder="Alex"
            />
            <FormInput
              label="Last name"
              value={form.lastName}
              onChange={v => setForm(p => ({ ...p, lastName: v }))}
              placeholder="Johnson"
            />
          </div>

          <FormInput
            label="Email"
            required
            type="email"
            value={form.email}
            onChange={v => setForm(p => ({ ...p, email: v }))}
            placeholder="alex@email.com"
          />

          <div className={styles.twoCol}>
            <FormInput
              label="Phone"
              value={form.phone}
              onChange={v => setForm(p => ({ ...p, phone: v }))}
              placeholder="+380 50 123 4567"
            />
            <FormInput
              label="Location"
              value={form.location}
              onChange={v => setForm(p => ({ ...p, location: v }))}
              placeholder="Kyiv, Ukraine"
            />
          </div>

          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Source</div>
            <Select
              value={form.source}
              onChange={v => setForm(p => ({ ...p, source: v }))}
              options={sourceOptions}
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSubmit}>Add candidate</button>
        </div>
      </div>
    </div>
  )
}

export default function PipelinePage() {
  const queryClient = useQueryClient()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<CandidateJob | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [search, setSearch] = useState('')
  const [jobFilter, setJobFilter] = useState('all')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } })
  )

  const { data: pipelineData } = useQuery({
    queryKey: ['pipeline', jobFilter],
    queryFn: () => pipelineApi.getAll(jobFilter !== 'all' ? { jobId: jobFilter } : {}),
  })

  const { data: jobsData } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.getAll(),
  })

  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: PipelineStage }) =>
      pipelineApi.updateStage(id, stage),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pipeline'] }),
  })

  const addCandidateMutation = useMutation({
    mutationFn: async (data: {
      firstName: string
      lastName: string
      email: string
      phone: string
      location: string
      source: string
    }) => {
      const res = await candidatesApi.create(data)
      if (jobFilter !== 'all') {
        await pipelineApi.addCandidate({
          candidateId: res.candidate.id,
          jobId: jobFilter,
          stage: 'APPLIED',
        })
      }
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline'] })
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
    },
  })

  const items = pipelineData?.pipeline || []

  const getByStage = useCallback(
    (stageId: string) => items.filter(item =>
      item.stage === stageId &&
      (search === '' ||
        `${item.candidate?.firstName} ${item.candidate?.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()))
    ),
    [items, search]
  )

  const activeItem = items.find(i => i.id === activeId)

  const findStage = (id: string) => {
    if (STAGES.find(s => s.id === id)) return id as PipelineStage
    return items.find(i => i.id === id)?.stage
  }

  const handleDragStart = ({ active }: { active: { id: string | number } }) => {
    setActiveId(active.id as string)
  }

  const handleDragOver = ({ active, over }: {
    active: { id: string | number }
    over: { id: string | number } | null
  }) => {
    if (!over) return
    const from = findStage(active.id as string)
    const to = findStage(over.id as string)
    if (!from || !to || from === to) return
    queryClient.setQueryData(
      ['pipeline', jobFilter],
      (old: { pipeline: CandidateJob[] } | undefined) => {
        if (!old) return old
        return {
          ...old,
          pipeline: old.pipeline.map(i =>
            i.id === active.id ? { ...i, stage: to } : i
          ),
        }
      }
    )
  }

  const handleDragEnd = ({ active, over }: {
    active: { id: string | number }
    over: { id: string | number } | null
  }) => {
    setActiveId(null)
    if (!over || active.id === over.id) return

    const from = findStage(active.id as string)
    const to = findStage(over.id as string)

    if (from && to && from !== to) {
      updateStageMutation.mutate({ id: active.id as string, stage: to })
      return
    }

    if (from && to && from === to) {
      queryClient.setQueryData(
        ['pipeline', jobFilter],
        (old: { pipeline: CandidateJob[] } | undefined) => {
          if (!old) return old
          const inStage = old.pipeline.filter(i => i.stage === from)
          const rest = old.pipeline.filter(i => i.stage !== from)
          const oldIdx = inStage.findIndex(i => i.id === active.id)
          const newIdx = inStage.findIndex(i => i.id === over.id)
          return { ...old, pipeline: [...rest, ...arrayMove(inStage, oldIdx, newIdx)] }
        }
      )
    }
  }

  const handleStageChange = (stage: PipelineStage) => {
    if (!selectedItem) return
    updateStageMutation.mutate({ id: selectedItem.id, stage })
    setSelectedItem(prev => prev ? { ...prev, stage } : null)
  }

  return (
    <AppLayout title="Pipeline">
      <div className={styles.page}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <MagnifyingGlass size={14} weight="bold" color="var(--c-ink-muted)" />
            <input
              className={styles.searchInput}
              placeholder="Search candidates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={jobFilter}
            onChange={setJobFilter}
            options={[
        { value: 'all', label: 'All jobs' },
        ...(jobsData?.jobs.map(job => ({ value: job.id, label: job.title })) || []),
                    ]}
/>

          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            <Plus size={14} weight="bold" />
            Add candidate
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className={styles.board}>
            {STAGES.map(stage => (
              <Column
                key={stage.id}
                stage={stage}
                items={getByStage(stage.id)}
                onCardClick={setSelectedItem}
              />
            ))}
          </div>

          <DragOverlay>
            {activeItem && (
              <CardContent item={activeItem} onClick={() => {}} isDragging />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {selectedItem && (
        <CandidateModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onStageChange={handleStageChange}
        />
      )}

      {showAddModal && (
        <AddCandidateModal
          onClose={() => setShowAddModal(false)}
          onAdd={data => addCandidateMutation.mutate(data)}
        />
      )}
    </AppLayout>
  )
}