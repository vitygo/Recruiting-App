import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { AppLayout } from '../../components/layout/AppLayout'
import { pipelineApi } from '../../api/pipeline'
import { jobsApi } from '../../api/jobs'
import { candidatesApi } from '../../api/candidates'
import { STAGES } from './constants'
import { PipelineToolbar } from './components/PipelineToolbar/PipelineToolbar'
import { PipelineBoard } from './components/PipelineBoard/PipelineBoard'
import { CardContent } from './components/PipelineCard/PipelineCard'
import { CandidateModal } from './components/CandidateModal/CandidateModal'
import { AddCandidateModal } from './components/AddCandidateModal/AddCandidateModal'
import type { CandidateJob, PipelineStage } from '../../types'
import styles from './PipelinePage.module.css'

export default function PipelinePage() {
  const queryClient = useQueryClient()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<CandidateJob | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addModalStage, setAddModalStage] = useState('APPLIED')
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
      firstName: string; lastName: string; email: string
      phone: string; location: string; source: string
      stage: string; jobId: string
    }) => {
      const res = await candidatesApi.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        location: data.location,
        source: data.source,
      })
      if (data.jobId) {
        await pipelineApi.addCandidate({
          candidateId: res.candidate.id,
          jobId: data.jobId,
          stage: data.stage as PipelineStage,
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
          .toLowerCase().includes(search.toLowerCase()))
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

  const handleDragOver = ({ active, over }: { active: { id: string | number }; over: { id: string | number } | null }) => {
    if (!over) return
    const from = findStage(active.id as string)
    const to = findStage(over.id as string)
    if (!from || !to || from === to) return
    queryClient.setQueryData(['pipeline', jobFilter], (old: { pipeline: CandidateJob[] } | undefined) => {
      if (!old) return old
      return { ...old, pipeline: old.pipeline.map(i => i.id === active.id ? { ...i, stage: to } : i) }
    })
  }

  const handleDragEnd = ({ active, over }: { active: { id: string | number }; over: { id: string | number } | null }) => {
    setActiveId(null)
    if (!over || active.id === over.id) return
    const from = findStage(active.id as string)
    const to = findStage(over.id as string)
    if (from && to && from !== to) {
      updateStageMutation.mutate({ id: active.id as string, stage: to })
      return
    }
    if (from && to && from === to) {
      queryClient.setQueryData(['pipeline', jobFilter], (old: { pipeline: CandidateJob[] } | undefined) => {
        if (!old) return old
        const inStage = old.pipeline.filter(i => i.stage === from)
        const rest = old.pipeline.filter(i => i.stage !== from)
        const oldIdx = inStage.findIndex(i => i.id === active.id)
        const newIdx = inStage.findIndex(i => i.id === over.id)
        return { ...old, pipeline: [...rest, ...arrayMove(inStage, oldIdx, newIdx)] }
      })
    }
  }

  const handleStageChange = (stage: PipelineStage) => {
    if (!selectedItem) return
    updateStageMutation.mutate({ id: selectedItem.id, stage })
    setSelectedItem(prev => prev ? { ...prev, stage } : null)
  }

  const handleAddClick = (stage: string) => {
    setAddModalStage(stage)
    setShowAddModal(true)
  }

  return (
    <AppLayout title="Pipeline">
      <div className={styles.page}>
        <PipelineToolbar
          search={search}
          onSearchChange={setSearch}
          jobFilter={jobFilter}
          onJobFilterChange={setJobFilter}
          jobs={jobsData?.jobs || []}
          onAddClick={() => handleAddClick('APPLIED')}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <PipelineBoard
            getByStage={getByStage}
            onCardClick={setSelectedItem}
            onAddClick={handleAddClick}
          />

          <DragOverlay>
            {activeItem && <CardContent item={activeItem} onClick={() => {}} isDragging />}
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
          defaultStage={addModalStage}
          jobs={jobsData?.jobs || []}
          selectedJobId={jobFilter}
        />
      )}
    </AppLayout>
  )
}
