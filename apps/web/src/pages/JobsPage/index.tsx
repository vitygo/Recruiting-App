import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Briefcase, Buildings, Users, Clock } from '@phosphor-icons/react'
import { AppLayout } from '../../components/layout/AppLayout'
import { jobsApi } from '../../api/jobs'
import { pipelineApi } from '../../api/pipeline'
import { useDebounce } from '../../hooks/useDebounce'
import { ACTIVE_STATUSES } from './constants'
import { JobStats } from './components/JobStats/JobStats'
import { JobToolbar } from './components/JobToolbar/JobToolbar'
import { JobGrid } from './components/JobGrid/JobGrid'
import { AddJobModal } from './components/AddJobModal/AddJobModal'
import { EditJobModal } from './components/EditJobModal/EditJobModal'
import type { AddJobData } from './components/AddJobModal/AddJobModal'
import type { EditJobData } from './components/EditJobModal/EditJobModal'
import type { Job } from '../../types'
import styles from './index.module.css'

export default function JobsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.getAll(),
  })

  const { data: pipelineData } = useQuery({
    queryKey: ['pipeline'],
    queryFn: () => pipelineApi.getAll(),
  })

  const addJobMutation = useMutation({
    mutationFn: (data: Parameters<typeof jobsApi.create>[0]) => jobsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  const editJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditJobData }) => jobsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      setEditingJob(null)
    },
  })

  const jobs = data?.jobs ?? []
  const pipeline = pipelineData?.pipeline ?? []

  const tabFiltered = useMemo(() => {
    return jobs.filter(j =>
      activeTab === 'active'
        ? ACTIVE_STATUSES.has(j.status)
        : !ACTIVE_STATUSES.has(j.status)
    )
  }, [jobs, activeTab])

  const filtered = useMemo(() => {
    return tabFiltered.filter(j => {
      const matchSearch = debouncedSearch === '' ||
        j.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        j.department?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        j.location?.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchType = typeFilter === 'All' || j.type === typeFilter
      return matchSearch && matchType
    })
  }, [tabFiltered, debouncedSearch, typeFilter])

  const STATS = [
    { label: 'Total jobs',       value: jobs.length.toString(),                                             icon: Briefcase, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)' },
    { label: 'Active positions', value: jobs.filter(j => ACTIVE_STATUSES.has(j.status)).length.toString(), icon: Buildings, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)' },
    { label: 'Total applicants', value: pipeline.length.toString(),                                         icon: Users,     iconBg: 'rgba(0,153,255,0.1)',  iconColor: 'var(--c-accent)' },
    { label: 'Avg time to fill', value: '18d',                                                              icon: Clock,     iconBg: 'rgba(0,153,255,0.1)',  iconColor: 'var(--c-accent)' },
  ]

  return (
    <AppLayout title="Jobs">
      <div className={styles.page}>
        <JobStats stats={STATS} isLoading={isLoading} />

        <div className={styles.tabRow}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'active' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Vacancies
            <span className={styles.tabCount}>{jobs.filter(j => ACTIVE_STATUSES.has(j.status)).length}</span>
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'archived' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('archived')}
          >
            Archived History
            <span className={styles.tabCount}>{jobs.filter(j => !ACTIVE_STATUSES.has(j.status)).length}</span>
          </button>
        </div>

        <JobToolbar
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          onAddClick={() => setShowAddModal(true)}
        />

        <JobGrid
          jobs={filtered}
          pipeline={pipeline}
          isLoading={isLoading}
          onViewPipeline={(jobId) => navigate(`/pipeline?job=${jobId}`)}
          onEditJob={setEditingJob}
        />
      </div>

      {showAddModal && (
        <AddJobModal
          onClose={() => setShowAddModal(false)}
          onAdd={(data: AddJobData) => addJobMutation.mutate(data as Partial<Job>)}
        />
      )}

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={(data: EditJobData) => editJobMutation.mutate({ id: editingJob.id, data })}
        />
      )}
    </AppLayout>
  )
}
