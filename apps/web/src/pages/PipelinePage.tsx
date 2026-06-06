import { useState, useCallback } from 'react'
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
import { MagnifyingGlass, Plus, X, Envelope, CalendarBlank, Sparkle } from '@phosphor-icons/react'
import styles from './PipelinePage.module.css'

const STAGES = [
  { id: 'APPLIED', label: 'Applied', color: '#9ca3af' },
  { id: 'SCREENING', label: 'Screening', color: '#6b7280' },
  { id: 'INTERVIEW', label: 'Interview', color: '#fb923c' },
  { id: 'OFFER', label: 'Offer', color: '#f97316' },
  { id: 'HIRED', label: 'Hired', color: '#22c55e' },
]

const SOURCE_COLORS: Record<string, { bg: string; color: string }> = {
  LinkedIn: { bg: 'rgba(0,119,181,0.12)', color: '#0077b5' },
  Indeed: { bg: 'rgba(255,122,61,0.12)', color: '#ff7a3d' },
  Referral: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  Manual: { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
}

interface Candidate {
  id: string
  name: string
  role: string
  initials: string
  color: string
  score: number
  source: string
  email: string
  location: string
  stage: string
  notes: string
}

const INITIAL_CANDIDATES: Candidate[] = [
  { id: '1', name: 'Alex Johnson', role: 'Senior Engineer', initials: 'AJ', color: '#6a4cf5', score: 92, source: 'LinkedIn', email: 'alex@email.com', location: 'Kyiv, Ukraine', stage: 'APPLIED', notes: 'Strong system design skills. 5+ years experience.' },
  { id: '2', name: 'Maria Kim', role: 'Product Designer', initials: 'MK', color: '#d44df0', score: 87, source: 'Referral', email: 'maria@email.com', location: 'Warsaw, Poland', stage: 'APPLIED', notes: 'Great portfolio. Worked at top agencies.' },
  { id: '3', name: 'Ryan Smith', role: 'Frontend Dev', initials: 'RS', color: '#0099ff', score: 78, source: 'Indeed', email: 'ryan@email.com', location: 'Remote', stage: 'SCREENING', notes: 'Solid React skills. Needs assessment.' },
  { id: '4', name: 'Priya Lal', role: 'Data Scientist', initials: 'PL', color: '#22c55e', score: 94, source: 'LinkedIn', email: 'priya@email.com', location: 'Berlin, Germany', stage: 'SCREENING', notes: 'PhD in ML. Excellent match.' },
  { id: '5', name: 'Tom Walker', role: 'Backend Dev', initials: 'TW', color: '#fb923c', score: 81, source: 'Manual', email: 'tom@email.com', location: 'Lviv, Ukraine', stage: 'INTERVIEW', notes: 'Good Go/Rust skills. Culture fit TBD.' },
  { id: '6', name: 'Sarah Chen', role: 'UX Researcher', initials: 'SC', color: '#f472b6', score: 89, source: 'LinkedIn', email: 'sarah@email.com', location: 'Remote', stage: 'OFFER', notes: 'Exceptional research skills. Top pick.' },
]

function Column({ stage, candidates, onCardClick }: {
  stage: typeof STAGES[0]
  candidates: Candidate[]
  onCardClick: (c: Candidate) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <div className={styles.columnDot} style={{ background: stage.color }} />
        <span className={styles.columnTitle}>{stage.label}</span>
        <span className={styles.columnCount}>{candidates.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`${styles.columnCards} ${isOver ? styles.columnDropzoneActive : ''}`}
        style={{ minHeight: 80 }}
      >
        <SortableContext
          items={candidates.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {candidates.map(candidate => (
            <SortableCard
              key={candidate.id}
              candidate={candidate}
              onClick={() => onCardClick(candidate)}
            />
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

function SortableCard({ candidate, onClick }: { candidate: Candidate; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: candidate.id,
    data: { stage: candidate.stage },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardContent candidate={candidate} onClick={onClick} />
    </div>
  )
}

function CardContent({ candidate, onClick, isDragging = false }: {
  candidate: Candidate
  onClick: () => void
  isDragging?: boolean
}) {
  const src = SOURCE_COLORS[candidate.source] || SOURCE_COLORS.Manual

  return (
    <div
      className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}
      onClick={onClick}
    >
      <div className={styles.cardTop}>
        <div className={styles.cardAvatar} style={{ background: candidate.color }}>
          {candidate.initials}
        </div>
        <div>
          <div className={styles.cardName}>{candidate.name}</div>
          <div className={styles.cardRole}>{candidate.role}</div>
        </div>
      </div>
      <div className={styles.cardBottom}>
        <div className={styles.scoreWrap}>
          <div className={styles.scoreBar}>
            <div
              className={styles.scoreFill}
              style={{ width: `${candidate.score}%`, background: candidate.color }}
            />
          </div>
          <span className={styles.scoreVal}>{candidate.score}%</span>
        </div>
        <span className={styles.sourceTag} style={{ background: src.bg, color: src.color }}>
          {candidate.source}
        </span>
      </div>
    </div>
  )
}

function CandidateModal({ candidate, onClose, onStageChange }: {
  candidate: Candidate
  onClose: () => void
  onStageChange: (stage: string) => void
}) {
  const currentStageIdx = STAGES.findIndex(s => s.id === candidate.stage)

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div className={styles.modalAvatar} style={{ background: candidate.color }}>
            {candidate.initials}
          </div>
          <div>
            <div className={styles.modalName}>{candidate.name}</div>
            <div className={styles.modalRole}>{candidate.role} · {candidate.location}</div>
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
                  className={`${styles.stagePill} ${stage.id === candidate.stage ? styles.stagePillActive : ''} ${idx < currentStageIdx ? styles.stagePillDone : ''}`}
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
                {candidate.email}
              </div>
              <div className={styles.infoRow}>
                <Sparkle size={14} weight="fill" className={styles.infoIcon} />
                {candidate.source}
              </div>
            </div>

            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>AI Score</div>
              <div className={styles.aiScoreBox}>
                <div className={styles.aiScoreTop}>
                  <div>
                    <div className={styles.aiScoreVal}>{candidate.score}%</div>
                    <div className={styles.aiScoreLabel}>match score</div>
                  </div>
                  <Sparkle size={20} weight="fill" color="var(--c-orange)" />
                </div>
                <div className={styles.aiBarWrap}>
                  <div className={styles.aiBar} style={{ width: `${candidate.score}%` }} />
                </div>
                <div className={styles.aiTags}>
                  <span className={styles.aiTag}>Skills match</span>
                  <span className={styles.aiTag}>Senior fit</span>
                  <span className={styles.aiTag}>Salary ok</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Notes</div>
            <textarea className={styles.notesArea} defaultValue={candidate.notes} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PipelinePage() {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [search, setSearch] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } })
  )

  const activeCandidate = candidates.find(c => c.id === activeId)

  const getByStage = useCallback(
    (stageId: string) => candidates.filter(c =>
      c.stage === stageId &&
      (search === '' ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase()))
    ),
    [candidates, search]
  )

  const findStage = (id: string) => {
    if (STAGES.find(s => s.id === id)) return id
    return candidates.find(c => c.id === id)?.stage
  }

  const handleDragStart = ({ active }: { active: { id: string | number } }) => {
    setActiveId(active.id as string)
  }

  const handleDragOver = ({ active, over }: { active: { id: string | number }; over: { id: string | number } | null }) => {
    if (!over) return
    const from = findStage(active.id as string)
    const to = findStage(over.id as string)
    if (!from || !to || from === to) return
    setCandidates(prev =>
      prev.map(c => c.id === active.id ? { ...c, stage: to } : c)
    )
  }

  const handleDragEnd = ({ active, over }: { active: { id: string | number }; over: { id: string | number } | null }) => {
    setActiveId(null)
    if (!over || active.id === over.id) return
    const from = findStage(active.id as string)
    const to = findStage(over.id as string)
    if (!from || !to || from !== to) return
    setCandidates(prev => {
      const inStage = prev.filter(c => c.stage === from)
      const rest = prev.filter(c => c.stage !== from)
      const oldIdx = inStage.findIndex(c => c.id === active.id)
      const newIdx = inStage.findIndex(c => c.id === over.id)
      return [...rest, ...arrayMove(inStage, oldIdx, newIdx)]
    })
  }

  const handleStageChange = (stage: string) => {
    if (!selectedCandidate) return
    setCandidates(prev => prev.map(c => c.id === selectedCandidate.id ? { ...c, stage } : c))
    setSelectedCandidate(prev => prev ? { ...prev, stage } : null)
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

          <select className={styles.filterSelect}>
            <option>All jobs</option>
            <option>Senior Full-Stack Engineer</option>
            <option>Product Designer</option>
            <option>DevOps Engineer</option>
          </select>

          <button className={styles.addBtn}>
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
                candidates={getByStage(stage.id)}
                onCardClick={setSelectedCandidate}
              />
            ))}
          </div>

          <DragOverlay>
            {activeCandidate && (
              <CardContent candidate={activeCandidate} onClick={() => {}} isDragging />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onStageChange={handleStageChange}
        />
      )}
    </AppLayout>
  )
}