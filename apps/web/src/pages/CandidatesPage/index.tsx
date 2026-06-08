import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { Users, Sparkle, GraduationCap, UserCheck } from '@phosphor-icons/react'
import { AppLayout } from '../../components/layout/AppLayout'
import { candidatesApi } from '../../api/candidates'
import { useDebounce } from '../../hooks/useDebounce'
import type { Candidate } from '../../types'
import { CandidateStats } from './components/CandidateStats/CandidateStats'
import { CandidateToolbar } from './components/CandidateToolbar/CandidateToolbar'
import { CandidateGrid } from './components/CandidateGrid/CandidateGrid'
import { CandidateFormModal } from './components/CandidateFormModal/CandidateFormModal'
import styles from './index.module.css'

export default function CandidatesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [stageFilter, setStageFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useQuery({
    queryKey: ['candidates', debouncedSearch, sourceFilter],
    queryFn: () => candidatesApi.getAll({
      search: debouncedSearch || undefined,
      source: sourceFilter !== 'All' ? sourceFilter : undefined,
      limit: 200,
    }),
  })

  const addCandidateMutation = useMutation({
    mutationFn: (data: Partial<Candidate>) => candidatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      setShowAddModal(false)
      toast.success('Candidate created successfully!')
    },
    onError: (err) => {
      const msg = isAxiosError(err) ? err.response?.data?.error ?? err.message : 'Unexpected error'
      toast.error(`Failed to save: ${msg}`)
    },
  })

  const updateCandidateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Candidate> }) =>
      candidatesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      setSelectedCandidate(null)
      toast.success('Candidate updated successfully!')
    },
    onError: (err) => {
      const msg = isAxiosError(err) ? err.response?.data?.error ?? err.message : 'Unexpected error'
      toast.error(`Failed to save: ${msg}`)
    },
  })

  const deleteCandidateMutation = useMutation({
    mutationFn: (id: string) => candidatesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      toast.success('Candidate removed')
    },
    onError: (err) => {
      const msg = isAxiosError(err) ? err.response?.data?.error ?? err.message : 'Unexpected error'
      toast.error(`Failed to delete: ${msg}`)
    },
  })

  const candidates = data?.candidates ?? []
  const total = data?.total ?? 0

  const filtered = useMemo(() => {
    let list = candidates
    if (stageFilter !== 'All') {
      list = list.filter(c => c.candidateJobs?.some(cj => cj.stage === stageFilter))
    }
    return list
  }, [candidates, stageFilter])

  const stats = useMemo(() => ({
    hired: candidates.filter(c => c.candidateJobs?.some(cj => cj.stage === 'HIRED')).length,
    inPipeline: candidates.filter(c =>
      c.candidateJobs?.some(cj => !['HIRED', 'REJECTED'].includes(cj.stage)),
    ).length,
  }), [candidates])

  const STATS = [
    { label: 'Total candidates', icon: Users,       iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)', value: total.toString() },
    { label: 'This week',        icon: Sparkle,     iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)', value: '+' + Math.max(0, Math.floor(total * 0.1)) },
    { label: 'In pipeline',      icon: GraduationCap, iconBg: 'rgba(0,153,255,0.1)', iconColor: 'var(--c-accent)', value: stats.inPipeline.toString() },
    { label: 'Hired this month', icon: UserCheck,   iconBg: 'rgba(0,153,255,0.1)', iconColor: 'var(--c-accent)', value: stats.hired.toString() },
  ]

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
          onDelete={(id) => deleteCandidateMutation.mutate(id)}
        />
      </div>

      {showAddModal && (
        <CandidateFormModal
          title="Add candidate"
          submitLabel="Add candidate"
          onClose={() => setShowAddModal(false)}
          onSave={data => addCandidateMutation.mutate(data)}
          isSubmitting={addCandidateMutation.isPending}
        />
      )}

      {selectedCandidate && (
        <CandidateFormModal
          title="Edit candidate"
          submitLabel="Save changes"
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onSave={data => updateCandidateMutation.mutate({ id: selectedCandidate.id, data })}
          isSubmitting={updateCandidateMutation.isPending}
        />
      )}
    </AppLayout>
  )
}
