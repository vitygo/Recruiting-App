import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Briefcase, Buildings, Users, Clock } from '@phosphor-icons/react'
import { AppLayout } from '../../components/layout/AppLayout'
import { jobsApi } from '../../api/jobs'
import { useDebounce } from '../../hooks/useDebounce'
import { JobStats } from './components/JobStats/JobStats'
import { JobToolbar } from './components/JobToolbar/JobToolbar'
import { JobGrid } from './components/JobGrid/JobGrid'
import { AddJobModal } from './components/AddJobModal/AddJobModal'
import type { AddJobData } from './components/AddJobModal/AddJobModal'
import styles from './index.module.css'

export default function JobsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', statusFilter],
    queryFn: () => jobsApi.getAll({
      status: statusFilter !== 'All' ? statusFilter : undefined,
    }),
  })

  const addJobMutation = useMutation({
    mutationFn: (data: Parameters<typeof jobsApi.create>[0]) => jobsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  const jobs = data?.jobs || []

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      const matchSearch = debouncedSearch === '' ||
        j.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        j.department?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        j.location?.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchType = typeFilter === 'All' || j.type === typeFilter
      return matchSearch && matchType
    })
  }, [jobs, debouncedSearch, typeFilter])

  const stats = useMemo(() => ({
    total: jobs.length,
    open: jobs.filter(j => j.status === 'OPEN').length,
    applicants: jobs.reduce((acc, j) => acc + (j._count?.candidates || 0), 0),
  }), [jobs])

  const STATS = [
    { label: 'Total jobs', value: stats.total.toString(), icon: Briefcase, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)' },
    { label: 'Open positions', value: stats.open.toString(), icon: Buildings, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)' },
    { label: 'Total applicants', value: stats.applicants.toString(), icon: Users, iconBg: 'rgba(0,153,255,0.1)', iconColor: 'var(--c-accent)' },
    { label: 'Avg time to fill', value: '18d', icon: Clock, iconBg: 'rgba(0,153,255,0.1)', iconColor: 'var(--c-accent)' },
  ]

  return (
    <AppLayout title="Jobs">
      <div className={styles.page}>
        <JobStats stats={STATS} isLoading={isLoading} />

        <JobToolbar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          onAddClick={() => setShowAddModal(true)}
        />

        <JobGrid jobs={filtered} isLoading={isLoading} />
      </div>

      {showAddModal && (
        <AddJobModal
          onClose={() => setShowAddModal(false)}
          onAdd={(data: AddJobData) => addJobMutation.mutate(data)}
        />
      )}
    </AppLayout>
  )
}
