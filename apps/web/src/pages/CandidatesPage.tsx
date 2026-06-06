import { useState, useMemo } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { MagnifyingGlass, Plus, MapPin, Users, LinkedinLogo, GraduationCap, Sparkle } from '@phosphor-icons/react'
import styles from './CandidatesPage.module.css'

const SOURCE_COLORS: Record<string, { bg: string; color: string }> = {
  LinkedIn: { bg: 'rgba(0,119,181,0.12)', color: '#0077b5' },
  Indeed: { bg: 'rgba(255,122,61,0.12)', color: '#ff7a3d' },
  Referral: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  Manual: { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
}

const STAGE_COLORS: Record<string, { bg: string; color: string }> = {
  APPLIED: { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
  SCREENING: { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
  INTERVIEW: { bg: 'rgba(251,146,60,0.12)', color: '#fb923c' },
  OFFER: { bg: 'rgba(249,115,22,0.12)', color: '#f97316' },
  HIRED: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  REJECTED: { bg: 'rgba(255,85,119,0.12)', color: '#ff5577' },
}

interface Candidate {
  id: string
  name: string
  role: string
  initials: string
  color?: string
  score: number
  source: string
  location: string
  stage: string
  email: string
  experience: string
}

const CANDIDATES: Candidate[] = [
  { id: '1', name: 'Alex Johnson', role: 'Senior Engineer', initials: 'AJ', score: 92, source: 'LinkedIn', location: 'Kyiv, Ukraine', stage: 'SCREENING', email: 'alex@email.com', experience: '5 years' },
  { id: '2', name: 'Maria Kim', role: 'Product Designer', initials: 'MK', score: 87, source: 'Referral', location: 'Warsaw, Poland', stage: 'INTERVIEW', email: 'maria@email.com', experience: '4 years' },
  { id: '3', name: 'Ryan Smith', role: 'Frontend Dev', initials: 'RS', score: 78, source: 'Indeed', location: 'Remote', stage: 'APPLIED', email: 'ryan@email.com', experience: '3 years' },
  { id: '4', name: 'Priya Lal', role: 'Data Scientist', initials: 'PL', score: 94, source: 'LinkedIn', location: 'Berlin, Germany', stage: 'OFFER', email: 'priya@email.com', experience: '6 years' },
  { id: '5', name: 'Tom Walker', role: 'Backend Dev', initials: 'TW', score: 81, source: 'Manual', location: 'Lviv, Ukraine', stage: 'INTERVIEW', email: 'tom@email.com', experience: '4 years' },
  { id: '6', name: 'Sarah Chen', role: 'UX Researcher', initials: 'SC', score: 89, source: 'LinkedIn', location: 'Remote', stage: 'HIRED', email: 'sarah@email.com', experience: '5 years' },
  { id: '7', name: 'David Park', role: 'DevOps Engineer', initials: 'DP', score: 83, source: 'Indeed', location: 'Prague, Czech', stage: 'SCREENING', email: 'david@email.com', experience: '4 years' },
  { id: '8', name: 'Nina Patel', role: 'ML Engineer', initials: 'NP', score: 96, source: 'LinkedIn', location: 'Remote', stage: 'INTERVIEW', email: 'nina@email.com', experience: '7 years' },
  { id: '9', name: 'James Lee', role: 'iOS Engineer', initials: 'JL', score: 76, source: 'Referral', location: 'Tallinn, Estonia', stage: 'REJECTED', email: 'james@email.com', experience: '3 years' },
]

const STATS = [
    { label: 'Total candidates', value: '248', icon: Users, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)' },
    { label: 'This week', value: '+12', icon: Sparkle, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)'  },
    { label: 'In pipeline', value: '34', icon: GraduationCap, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)'  },
    { label: 'Hired this month', value: '4', icon: LinkedinLogo, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)'  },
  ]

export default function CandidatesPage() {
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [stageFilter, setStageFilter] = useState('All')

  const filtered = useMemo(() => {
    return CANDIDATES.filter(c => {
      const matchSearch = search === '' ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase())
      const matchSource = sourceFilter === 'All' || c.source === sourceFilter
      const matchStage = stageFilter === 'All' || c.stage === stageFilter
      return matchSearch && matchSource && matchStage
    })
  }, [search, sourceFilter, stageFilter])

  return (
    <AppLayout title="Candidates">
      <div className={styles.page}>
        <div className={styles.statsRow}>
          {STATS.map((stat, i) => (
            <div key={i} className={styles.statCard}>
              <div
                className={styles.statIcon}
                style={{ background: stat.iconBg, color: stat.iconColor }}
              >
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
              placeholder="Search candidates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            className={styles.filterSelect}
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
          >
            <option value="All">All sources</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Indeed">Indeed</option>
            <option value="Referral">Referral</option>
            <option value="Manual">Manual</option>
          </select>

          <select
            className={styles.filterSelect}
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
          >
            <option value="All">All stages</option>
            <option value="APPLIED">Applied</option>
            <option value="SCREENING">Screening</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="HIRED">Hired</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <button className={styles.addBtn}>
            <Plus size={14} weight="bold" />
            Add candidate
          </button>
        </div>

        <div className={styles.grid}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <Users size={40} weight="thin" />
              <div className={styles.emptyTitle}>No candidates found</div>
              <div className={styles.emptyDesc}>Try adjusting your search or filters</div>
            </div>
          ) : (
            filtered.map(candidate => {
              const src = SOURCE_COLORS[candidate.source] || SOURCE_COLORS.Manual
              const stg = STAGE_COLORS[candidate.stage] || STAGE_COLORS.APPLIED
              return (
                <div key={candidate.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div className={styles.avatar} style={{ background: candidate.color }}>
                      {candidate.initials}
                    </div>
                    <div>
                      <div className={styles.cardName}>{candidate.name}</div>
                      <div className={styles.cardRole}>{candidate.role}</div>
                    </div>
                  </div>

                  <div className={styles.cardMeta}>
                    <span className={styles.metaTag}>
                      <MapPin size={12} weight="fill" />
                      {candidate.location}
                    </span>
                    <span className={styles.metaTag}>
                      <GraduationCap size={12} weight="fill" />
                      {candidate.experience}
                    </span>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.scoreWrap}>
                      <div className={styles.scoreBar}>
                        <div
                          className={styles.scoreFill}
                          style={{ width: `${candidate.score}%`, background: candidate.color }}
                        />
                      </div>
                      <span className={styles.scoreVal}>{candidate.score}%</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span className={styles.sourceBadge} style={{ background: src.bg, color: src.color }}>
                        {candidate.source}
                      </span>
                      <span className={styles.stageBadge} style={{ background: stg.bg, color: stg.color }}>
                        {candidate.stage.charAt(0) + candidate.stage.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </AppLayout>
  )
}