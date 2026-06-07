import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, Sparkle, GraduationCap, UserCheck } from '@phosphor-icons/react'
import { AppLayout } from '../../components/layout/AppLayout'
import { candidatesApi } from '../../api/candidates'
import { useDebounce } from '../../hooks/useDebounce'
import type { Candidate } from '../../types'
import { loadDemoPipeline, deleteCandidateFromDemo } from '../../lib/demoStorage'
import { CandidateStats } from './components/CandidateStats/CandidateStats'
import { CandidateToolbar } from './components/CandidateToolbar/CandidateToolbar'
import { CandidateGrid } from './components/CandidateGrid/CandidateGrid'
import { CandidateFormModal } from './components/CandidateFormModal/CandidateFormModal'
import styles from './index.module.css'

function buildDemoCandidates(): Candidate[] {
  const pipeline = loadDemoPipeline()
  const seen = new Set<string>()
  const result: Candidate[] = []
  for (const cj of pipeline) {
    if (!cj.candidate || seen.has(cj.candidate.id)) continue
    seen.add(cj.candidate.id)
    result.push({
      ...cj.candidate,
      candidateJobs: pipeline.filter(x => x.candidateId === cj.candidate!.id),
    })
  }
  return result
}

export default function CandidatesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [stageFilter, setStageFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [demoCandidates, setDemoCandidates] = useState<Candidate[]>(() => buildDemoCandidates())
  const [toast, setToast] = useState<string | null>(null)

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useQuery({
    queryKey: ['candidates', debouncedSearch, sourceFilter, stageFilter],
    queryFn: () => candidatesApi.getAll({
      search: debouncedSearch || undefined,
      source: sourceFilter !== 'All' ? sourceFilter : undefined,
      limit: 200,
    }),
  })

  const addCandidateMutation = useMutation({
    mutationFn: (data: Partial<Candidate>) => candidatesApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['candidates'] }),
  })

  const updateCandidateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Candidate> }) =>
      candidatesApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['candidates'] }),
  })

  const apiCandidates = data?.candidates ?? []
  const isDemoMode = !isLoading && apiCandidates.length === 0

  const candidates = isDemoMode ? demoCandidates : apiCandidates
  const total = isDemoMode ? demoCandidates.length : (data?.total ?? 0)

  const filtered = useMemo(() => {
    let list = candidates
    if (isDemoMode) {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase()
        list = list.filter(c =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q),
        )
      }
      if (sourceFilter !== 'All') {
        list = list.filter(c => c.source === sourceFilter)
      }
    }
    if (stageFilter !== 'All') {
      list = list.filter(c => c.candidateJobs?.some(cj => cj.stage === stageFilter))
    }
    return list
  }, [candidates, isDemoMode, debouncedSearch, sourceFilter, stageFilter])

  const stats = useMemo(() => ({
    hired: candidates.filter(c => c.candidateJobs?.some(cj => cj.stage === 'HIRED')).length,
    inPipeline: candidates.filter(c =>
      c.candidateJobs?.some(cj => !['HIRED', 'REJECTED'].includes(cj.stage)),
    ).length,
  }), [candidates])

  const STATS = [
    { label: 'Total candidates', icon: Users, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)', value: total.toString() },
    { label: 'This week', icon: Sparkle, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)', value: '+' + Math.max(0, Math.floor(total * 0.1)) },
    { label: 'In pipeline', icon: GraduationCap, iconBg: 'rgba(0,153,255,0.1)', iconColor: 'var(--c-accent)', value: stats.inPipeline.toString() },
    { label: 'Hired this month', icon: UserCheck, iconBg: 'rgba(0,153,255,0.1)', iconColor: 'var(--c-accent)', value: stats.hired.toString() },
  ]

  const handleDeleteCandidate = (id: string) => {
    const c = demoCandidates.find(x => x.id === id)
    setDemoCandidates(prev => prev.filter(x => x.id !== id))
    deleteCandidateFromDemo(id)
    const name = c ? `${c.firstName} ${c.lastName}` : 'Candidate'
    setToast(`${name} removed`)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <AppLayout title="Candidates">
      <div className={styles.page}>
        <CandidateStats stats={STATS} isLoading={isLoading} />

        <CandidateToolbar
          search={search}
          onSearchChange={setSearch}
          sourceFilter={sourceFilter}
          onSourceFilterChange={setSourceFilter}
          stageFilter={stageFilter}
          onStageFilterChange={setStageFilter}
          onAddClick={() => setShowAddModal(true)}
        />

        <CandidateGrid
          candidates={filtered}
          isLoading={isLoading}
          onCandidateClick={setSelectedCandidate}
          onDelete={isDemoMode ? handleDeleteCandidate : undefined}
        />
      </div>

      {toast && (
        <div className={styles.toast} role="status" aria-live="polite">
          {toast}
        </div>
      )}

      {showAddModal && (
        <CandidateFormModal
          title="Add candidate"
          submitLabel="Add candidate"
          onClose={() => setShowAddModal(false)}
          onSave={data => addCandidateMutation.mutate(data)}
        />
      )}

      {selectedCandidate && (
        <CandidateFormModal
          title="Edit candidate"
          submitLabel="Save changes"
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onSave={data => updateCandidateMutation.mutate({ id: selectedCandidate.id, data })}
        />
      )}
    </AppLayout>
  )
}
