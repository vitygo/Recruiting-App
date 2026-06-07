import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Briefcase, Buildings, Users, Clock } from '@phosphor-icons/react'
import { AppLayout } from '../../components/layout/AppLayout'
import { jobsApi } from '../../api/jobs'
import { useDebounce } from '../../hooks/useDebounce'
import { DEMO_PIPELINE } from '../PipelinePage/constants'
import { loadDemoPipeline, loadDemoJobs, saveDemoJobs } from '../../lib/demoStorage'
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
  const [demoJobs, setDemoJobs] = useState<Job[] | null>(null)

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.getAll(),
  })

  const addJobMutation = useMutation({
    mutationFn: (data: Parameters<typeof jobsApi.create>[0]) => jobsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  const apiJobs = data?.jobs ?? []
  const isDemo = isSuccess && apiJobs.length === 0

  const jobs = useMemo(() => {
    if (!isDemo) return apiJobs
    if (demoJobs) return demoJobs
    return loadDemoJobs()
  }, [isDemo, apiJobs, demoJobs])

  const effectivePipeline = isDemo ? loadDemoPipeline() : []

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

  const stats = useMemo(() => ({
    total: jobs.length,
    active: jobs.filter(j => ACTIVE_STATUSES.has(j.status)).length,
    applicants: isDemo
      ? effectivePipeline.length
      : jobs.reduce((acc, j) => acc + (j._count?.candidates || 0), 0),
  }), [jobs, isDemo, effectivePipeline])

  const STATS = [
    { label: 'Total jobs',       value: stats.total.toString(),       icon: Briefcase, iconBg: 'rgba(255,122,61,0.1)',  iconColor: 'var(--c-orange)' },
    { label: 'Active positions', value: stats.active.toString(),      icon: Buildings, iconBg: 'rgba(255,122,61,0.1)',  iconColor: 'var(--c-orange)' },
    { label: 'Total applicants', value: stats.applicants.toString(),  icon: Users,     iconBg: 'rgba(0,153,255,0.1)',   iconColor: 'var(--c-accent)' },
    { label: 'Avg time to fill', value: '18d',                        icon: Clock,     iconBg: 'rgba(0,153,255,0.1)',   iconColor: 'var(--c-accent)' },
  ]

  const handleViewPipeline = (jobId: string) => {
    navigate(`/pipeline?job=${jobId}`)
  }

  const handleEditJob = (data: EditJobData) => {
    if (!editingJob) return
    if (isDemo) {
      setDemoJobs(prev => {
        const base = prev ?? loadDemoJobs()
        const next = base.map(j => j.id === editingJob.id ? { ...j, ...data } : j)
        saveDemoJobs(next)
        return next
      })
    }
  }

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
          pipeline={effectivePipeline}
          isLoading={isLoading}
          onViewPipeline={handleViewPipeline}
          onEditJob={isDemo ? setEditingJob : undefined}
        />
      </div>

      {showAddModal && (
        <AddJobModal
          onClose={() => setShowAddModal(false)}
          onAdd={(data: AddJobData) => addJobMutation.mutate(data)}
        />
      )}

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={handleEditJob}
        />
      )}
    </AppLayout>
  )
}
