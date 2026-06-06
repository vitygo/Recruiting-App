import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AppLayout } from '../components/layout/AppLayout'
import { Select } from '../components/ui/Select'
import { FormInput } from '../components/ui/FormInput'
import {
  MagnifyingGlass, Plus, MapPin, Briefcase,
  Users, Clock, CurrencyDollar, Buildings, X,
} from '@phosphor-icons/react'
import { jobsApi } from '../api/jobs'
import { useDebounce } from '../hooks/useDebounce'
import styles from './JobsPage.module.css'

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  REMOTE: 'Remote',
}

function AddJobModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (data: {
    title: string
    department: string
    location: string
    type: string
    salaryMin: number
    salaryMax: number
    description: string
  }) => void
}) {
  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'FULL_TIME',
    salaryMin: '',
    salaryMax: '',
    description: '',
  })

  const handleSubmit = () => {
    if (!form.title || !form.department) return
    onAdd({
      ...form,
      salaryMin: Number(form.salaryMin) || 0,
      salaryMax: Number(form.salaryMax) || 0,
    })
    onClose()
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalName}>Post a job</div>
            <div className={styles.modalRole}>Fill in the job details</div>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className={styles.modalBody}>
          <FormInput
            label="Job title"
            required
            value={form.title}
            onChange={v => setForm(p => ({ ...p, title: v }))}
            placeholder="Senior Full-Stack Engineer"
          />

          <div className={styles.twoCol}>
            <FormInput
              label="Department"
              required
              value={form.department}
              onChange={v => setForm(p => ({ ...p, department: v }))}
              placeholder="Engineering"
            />
            <FormInput
              label="Location"
              value={form.location}
              onChange={v => setForm(p => ({ ...p, location: v }))}
              placeholder="Kyiv, Ukraine"
            />
          </div>

          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Type</div>
            <Select
              fullWidth
              value={form.type}
              onChange={v => setForm(p => ({ ...p, type: v }))}
              options={[
                { value: 'FULL_TIME', label: 'Full-time' },
                { value: 'PART_TIME', label: 'Part-time' },
                { value: 'CONTRACT', label: 'Contract' },
                { value: 'REMOTE', label: 'Remote' },
              ]}
            />
          </div>

          <div className={styles.twoCol}>
            <FormInput
              label="Salary min ($)"
              value={form.salaryMin}
              onChange={v => setForm(p => ({ ...p, salaryMin: v }))}
              placeholder="3000"
              type="number"
            />
            <FormInput
              label="Salary max ($)"
              value={form.salaryMax}
              onChange={v => setForm(p => ({ ...p, salaryMax: v }))}
              placeholder="6000"
              type="number"
            />
          </div>

          <div className={styles.modalSection}>
            <div className={styles.modalSectionLabel}>Description</div>
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Describe the role, responsibilities and requirements..."
              rows={4}
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSubmit}>Post job</button>
        </div>
      </div>
    </div>
  )
}

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
        <div className={styles.statsRow}>
          {STATS.map((stat, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: stat.iconBg, color: stat.iconColor }}>
                <stat.icon size={20} weight="fill" />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{isLoading ? '—' : stat.value}</div>
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
              placeholder="Search jobs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'All', label: 'All statuses' },
              { value: 'OPEN', label: 'Open' },
              { value: 'PAUSED', label: 'Paused' },
              { value: 'CLOSED', label: 'Closed' },
            ]}
          />

          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: 'All', label: 'All types' },
              { value: 'FULL_TIME', label: 'Full-time' },
              { value: 'PART_TIME', label: 'Part-time' },
              { value: 'CONTRACT', label: 'Contract' },
              { value: 'REMOTE', label: 'Remote' },
            ]}
          />

          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            <Plus size={14} weight="bold" />
            Post a job
          </button>
        </div>

        <div className={styles.grid}>
          {isLoading ? (
            <div className={styles.empty}>
              <div className={styles.emptyTitle}>Loading...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <Briefcase size={40} weight="thin" />
              <div className={styles.emptyTitle}>No jobs found</div>
              <div className={styles.emptyDesc}>Try adjusting your search or filters</div>
            </div>
          ) : (
            filtered.map(job => (
              <div key={job.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.jobIcon}>
                    <Briefcase size={22} weight="fill" />
                  </div>
                  <div className={styles.cardTitleWrap}>
                    <div className={styles.cardTitle}>{job.title}</div>
                    <div className={styles.cardDept}>{job.department}</div>
                  </div>
                  <span className={`${styles.statusBadge} ${
                    job.status === 'OPEN' ? styles.statusOpen :
                    job.status === 'PAUSED' ? styles.statusPaused :
                    styles.statusClosed
                  }`}>
                    {job.status ? job.status.charAt(0) + job.status.slice(1).toLowerCase() : '—'}
                  </span>
                </div>

                <div className={styles.cardMeta}>
                  {job.location && (
                    <span className={styles.metaItem}>
                      <MapPin size={13} weight="fill" />
                      {job.location}
                    </span>
                  )}
                  {job.salaryMin && job.salaryMax && (
                    <span className={styles.metaItem}>
                      <CurrencyDollar size={13} weight="fill" />
                      ${job.salaryMin.toLocaleString()} — ${job.salaryMax.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.candidatesWrap}>
                    <Users size={14} weight="fill" color="var(--c-ink-muted)" />
                    <span className={styles.candidatesCount}>{job._count?.candidates || 0}</span>
                    <span className={styles.candidatesLabel}>candidates</span>
                  </div>
                  {job.type && (
                    <span className={styles.typeBadge}>{TYPE_LABELS[job.type] || job.type}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddModal && (
        <AddJobModal
          onClose={() => setShowAddModal(false)}
          onAdd={data => addJobMutation.mutate(data)}
        />
      )}
    </AppLayout>
  )
}