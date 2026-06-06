import { useState, useMemo } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import {
  MagnifyingGlass,
  Plus,
  MapPin,
  Briefcase,
  Users,
  Clock,
  CurrencyDollar,
  Buildings,
} from '@phosphor-icons/react'
import styles from './JobsPage.module.css'

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'REMOTE'
  status: 'OPEN' | 'PAUSED' | 'CLOSED'
  candidates: number
  salaryMin: number
  salaryMax: number
  createdAt: string
}

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  REMOTE: 'Remote',
}

const JOBS: Job[] = [
  { id: '1', title: 'Senior Full-Stack Engineer', department: 'Engineering', location: 'Kyiv, Ukraine', type: 'REMOTE', status: 'OPEN', candidates: 42, salaryMin: 5000, salaryMax: 8000, createdAt: '2h ago' },
  { id: '2', title: 'Product Designer', department: 'Design', location: 'Warsaw, Poland', type: 'FULL_TIME', status: 'OPEN', candidates: 18, salaryMin: 3500, salaryMax: 5500, createdAt: '1d ago' },
  { id: '3', title: 'DevOps Engineer', department: 'Infrastructure', location: 'Remote', type: 'REMOTE', status: 'OPEN', candidates: 17, salaryMin: 4500, salaryMax: 7000, createdAt: '3d ago' },
  { id: '4', title: 'Data Scientist', department: 'Analytics', location: 'Berlin, Germany', type: 'FULL_TIME', status: 'PAUSED', candidates: 31, salaryMin: 6000, salaryMax: 9000, createdAt: '5d ago' },
  { id: '5', title: 'iOS Engineer', department: 'Mobile', location: 'Remote', type: 'REMOTE', status: 'OPEN', candidates: 12, salaryMin: 4000, salaryMax: 6500, createdAt: '1w ago' },
  { id: '6', title: 'UX Researcher', department: 'Design', location: 'Tallinn, Estonia', type: 'CONTRACT', status: 'CLOSED', candidates: 8, salaryMin: 2500, salaryMax: 4000, createdAt: '2w ago' },
]

const STATS = [
  { label: 'Total jobs', value: '7', iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)', icon: Briefcase },
  { label: 'Open positions', value: '5', iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)', icon: Buildings },
  { label: 'Total applicants', value: '128', iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)', icon: Users },
  { label: 'Avg time to fill', value: '18d', iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)', icon: Clock },
]

export default function JobsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

  const filtered = useMemo(() => {
    return JOBS.filter(j => {
      const matchSearch = search === '' ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.department.toLowerCase().includes(search.toLowerCase()) ||
        j.location.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'All' || j.status === statusFilter
      const matchType = typeFilter === 'All' || j.type === typeFilter
      return matchSearch && matchStatus && matchType
    })
  }, [search, statusFilter, typeFilter])

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
                <div className={styles.statValue}>{stat.value}</div>
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

          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="PAUSED">Paused</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            className={styles.filterSelect}
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="All">All types</option>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="REMOTE">Remote</option>
          </select>

          <button className={styles.addBtn}>
            <Plus size={14} weight="bold" />
            Post a job
          </button>
        </div>

        <div className={styles.grid}>
          {filtered.length === 0 ? (
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
                    {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                  </span>
                </div>

                <div className={styles.cardMeta}>
                  <span className={styles.metaItem}>
                    <MapPin size={13} weight="fill" />
                    {job.location}
                  </span>
                  <span className={styles.metaItem}>
                    <Clock size={13} weight="fill" />
                    Posted {job.createdAt}
                  </span>
                  <span className={styles.metaItem}>
                    <CurrencyDollar size={13} weight="fill" />
                    ${job.salaryMin.toLocaleString()} — ${job.salaryMax.toLocaleString()}
                  </span>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.candidatesWrap}>
                    <Users size={14} weight="fill" color="var(--c-ink-muted)" />
                    <span className={styles.candidatesCount}>{job.candidates}</span>
                    <span className={styles.candidatesLabel}>candidates</span>
                  </div>
                  <span className={styles.typeBadge}>{TYPE_LABELS[job.type]}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  )
}