import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
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
import { loadDemoPipeline, saveDemoPipeline, loadDemoJobs } from '../../lib/demoStorage'
import { PipelineToolbar } from './components/PipelineToolbar/PipelineToolbar'
import { PipelineBoard } from './components/PipelineBoard/PipelineBoard'
import { CardContent } from './components/PipelineCard/PipelineCard'
import { CandidateModal } from './components/CandidateModal/CandidateModal'
import { AddCandidateModal } from './components/AddCandidateModal/AddCandidateModal'
import type { AddCandidateFormData } from './components/AddCandidateModal/AddCandidateModal'
import type { Candidate, CandidateJob, PipelineStage } from '../../types'
import styles from './PipelinePage.module.css'

export default function PipelinePage() {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<CandidateJob | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [search, setSearch] = useState('')
  const [jobFilter, setJobFilter] = useState(searchParams.get('job') ?? 'all')
  const [demoState, setDemoState] = useState<CandidateJob[] | null>(null)
  const [demoJobs, setDemoJobs] = useState(() => loadDemoJobs())

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } })
  )

  const { data: pipelineData, isSuccess: plSuccess } = useQuery({
    queryKey: ['pipeline', jobFilter],
    queryFn: () => pipelineApi.getAll(jobFilter !== 'all' ? { jobId: jobFilter } : {}),
  })

  const { data: jobsData, isSuccess: jbSuccess } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.getAll(),
  })

  useEffect(() => {
    if (
      plSuccess && jbSuccess &&
      (pipelineData?.pipeline?.length ?? 0) === 0 &&
      (jobsData?.jobs?.length ?? 0) === 0 &&
      demoState === null
    ) {
      setDemoState(loadDemoPipeline())
      setDemoJobs(loadDemoJobs())
    }
  }, [plSuccess, jbSuccess, pipelineData, jobsData, demoState])

  const isDemo = demoState !== null
  const effectiveJobs = isDemo ? demoJobs : (jobsData?.jobs ?? [])

  const realItems = pipelineData?.pipeline ?? []
  const demoFiltered = demoState
    ? demoState.filter(i => jobFilter === 'all' || i.jobId === jobFilter)
    : []
  const items = isDemo ? demoFiltered : realItems

  // Unfiltered pool used for DnD stage lookups
  const allItems = isDemo ? (demoState ?? []) : realItems

  const getByStage = useCallback(
    (stageId: string) => items.filter(item =>
      item.stage === stageId &&
      (search === '' ||
        `${item.candidate?.firstName} ${item.candidate?.lastName}`
          .toLowerCase().includes(search.toLowerCase()))
    ),
    [items, search]
  )

  const activeItem = allItems.find(i => i.id === activeId)

  const findStage = (id: string): PipelineStage | undefined => {
    if (STAGES.find(s => s.id === id)) return id as PipelineStage
    return allItems.find(i => i.id === id)?.stage
  }

  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: PipelineStage }) =>
      pipelineApi.updateStage(id, stage),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pipeline'] }),
  })

  const addCandidateMutation = useMutation({
    mutationFn: async (data: AddCandidateFormData) => {
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
    if (isDemo) {
      setDemoState(prev => prev!.map(i => i.id === active.id ? { ...i, stage: to } : i))
    } else {
      queryClient.setQueryData(
        ['pipeline', jobFilter],
        (old: { pipeline: CandidateJob[] } | undefined) => {
          if (!old) return old
          return { ...old, pipeline: old.pipeline.map(i => i.id === active.id ? { ...i, stage: to } : i) }
        }
      )
    }
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
      if (isDemo) {
        setDemoState(prev => {
          const next = prev!.map(i => i.id === active.id ? { ...i, stage: to } : i)
          saveDemoPipeline(next)
          return next
        })
      } else {
        updateStageMutation.mutate({ id: active.id as string, stage: to })
      }
      return
    }
    if (from && to && from === to) {
      if (isDemo) {
        setDemoState(prev => {
          if (!prev) return prev
          const inStage = prev.filter(i => i.stage === from)
          const rest = prev.filter(i => i.stage !== from)
          const oldIdx = inStage.findIndex(i => i.id === active.id)
          const newIdx = inStage.findIndex(i => i.id === over.id)
          const next = [...rest, ...arrayMove(inStage, oldIdx, newIdx)]
          saveDemoPipeline(next)
          return next
        })
      } else {
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
  }

  const handleStageChange = (stage: PipelineStage) => {
    if (!selectedItem) return
    if (isDemo) {
      setDemoState(prev => {
        const next = prev!.map(i => i.id === selectedItem.id ? { ...i, stage } : i)
        saveDemoPipeline(next)
        return next
      })
    } else {
      updateStageMutation.mutate({ id: selectedItem.id, stage })
    }
    setSelectedItem(prev => prev ? { ...prev, stage } : null)
  }

  const handleDeleteItem = (itemId: string) => {
    if (isDemo) {
      setDemoState(prev => {
        const next = (prev ?? []).filter(i => i.id !== itemId)
        saveDemoPipeline(next)
        return next
      })
    }
    setSelectedItem(null)
  }

  const handleAddCandidate = (data: AddCandidateFormData) => {
    if (isDemo) {
      const now = new Date().toISOString()
      const candidateId = `demo-c-${Date.now()}`
      const newItem: CandidateJob = {
        id: `demo-cj-${Date.now()}`,
        candidateId,
        jobId: data.jobId,
        stage: data.stage as PipelineStage,
        createdAt: now,
        updatedAt: now,
        candidate: {
          id: candidateId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          location: data.location,
          source: data.source as Candidate['source'],
          createdAt: now,
          userId: 'demo',
        },
        job: effectiveJobs.find(j => j.id === data.jobId),
      }
      setDemoState(prev => {
        const next = [...(prev ?? []), newItem]
        saveDemoPipeline(next)
        return next
      })
    } else {
      addCandidateMutation.mutate(data)
    }
  }

  return (
    <AppLayout title="Pipeline">
      <div className={styles.page}>
        <PipelineToolbar
          search={search}
          onSearchChange={setSearch}
          jobFilter={jobFilter}
          onJobFilterChange={setJobFilter}
          jobs={effectiveJobs}
          onAddClick={() => setShowAddModal(true)}
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
            onDeleteItem={isDemo ? handleDeleteItem : undefined}
            onAddClick={() => setShowAddModal(true)}
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
          onDelete={isDemo ? handleDeleteItem : undefined}
        />
      )}

      {showAddModal && (
        <AddCandidateModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCandidate}
          defaultStage="APPLIED"
          jobs={effectiveJobs}
          selectedJobId={jobFilter}
        />
      )}
    </AppLayout>
  )
}
