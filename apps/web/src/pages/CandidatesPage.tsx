import { useMemo, useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { Select } from '../components/ui/Select'
import { MagnifyingGlass, Plus, MapPin, Users, Sparkle, GraduationCap, UserCheck } from '@phosphor-icons/react'
import { candidatesApi } from '../api/candidates'
import { useDebounce } from '../hooks/useDebounce'
import styles from './CandidatesPage.module.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from '@phosphor-icons/react'
import { FormInput } from '../components/ui/FormInput'
const SOURCE_COLORS: Record<string, { bg: string; color: string }> = {
  LINKEDIN: { bg: 'rgba(0,119,181,0.12)', color: '#0077b5' },
  INDEED: { bg: 'rgba(255,122,61,0.12)', color: '#ff7a3d' },
  REFERRAL: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  MANUAL: { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
  CAREERS_PAGE: { bg: 'rgba(0,153,255,0.12)', color: '#0099ff' },
  OTHER: { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
}

const STAGE_COLORS: Record<string, { bg: string; color: string }> = {
  APPLIED: { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
  SCREENING: { bg: 'rgba(0,153,255,0.12)', color: '#0099ff' },
  INTERVIEW: { bg: 'rgba(251,146,60,0.12)', color: '#fb923c' },
  OFFER: { bg: 'rgba(249,115,22,0.12)', color: '#f97316' },
  HIRED: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  REJECTED: { bg: 'rgba(255,85,119,0.12)', color: '#ff5577' },
}

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
}

function AddCandidateModal({ onClose, onAdd }: {
    onClose: () => void
    onAdd: (data: {
      firstName: string
      lastName: string
      email: string
      phone: string
      location: string
      source: string
    }) => void
  }) {
    const [form, setForm] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      source: 'MANUAL',
    })
  
    const handleSubmit = () => {
      if (!form.firstName || !form.email) return
      onAdd(form)
      onClose()
    }
  
    const sourceOptions = [
      { value: 'MANUAL', label: 'Manual' },
      { value: 'LINKEDIN', label: 'LinkedIn' },
      { value: 'INDEED', label: 'Indeed' },
      { value: 'REFERRAL', label: 'Referral' },
      { value: 'CAREERS_PAGE', label: 'Careers Page' },
      { value: 'OTHER', label: 'Other' },
    ]
  
    return (
      <div className={styles.modal}>
        <div className={styles.modalOverlay} onClick={onClose} />
        <div className={styles.modalBox}>
          <div className={styles.modalHeader}>
            <div>
              <div className={styles.modalName}>Add candidate</div>
              <div className={styles.modalRole}>Fill in the candidate details</div>
            </div>
            <button className={styles.modalCloseBtn} onClick={onClose}>
              <X size={16} weight="bold" />
            </button>
          </div>
  
          <div className={styles.modalBody}>
            <div className={styles.twoCol}>
              <FormInput
                label="First name"
                required
                value={form.firstName}
                onChange={v => setForm(p => ({ ...p, firstName: v }))}
                placeholder="Alex"
              />
              <FormInput
                label="Last name"
                value={form.lastName}
                onChange={v => setForm(p => ({ ...p, lastName: v }))}
                placeholder="Johnson"
              />
            </div>
  
            <FormInput
              label="Email"
              required
              type="email"
              value={form.email}
              onChange={v => setForm(p => ({ ...p, email: v }))}
              placeholder="alex@email.com"
            />
  
            <div className={styles.twoCol}>
              <FormInput
                label="Phone"
                value={form.phone}
                onChange={v => setForm(p => ({ ...p, phone: v }))}
                placeholder="+380 50 123 4567"
              />
              <FormInput
                label="Location"
                value={form.location}
                onChange={v => setForm(p => ({ ...p, location: v }))}
                placeholder="Kyiv, Ukraine"
              />
            </div>
  
            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>Source</div>
              <Select
                value={form.source}
                onChange={v => setForm(p => ({ ...p, source: v }))}
                options={sourceOptions}
              />
            </div>
          </div>
  
          <div className={styles.modalFooter}>
            <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button className={styles.saveBtn} onClick={handleSubmit}>Add candidate</button>
          </div>
        </div>
      </div>
    )
  }

export default function CandidatesPage() {
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [stageFilter, setStageFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const debouncedSearch = useDebounce(search, 300)

  const queryClient = useQueryClient()

const addCandidateMutation = useMutation({
  mutationFn: (data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    location: string
    source: string
  }) => candidatesApi.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['candidates'] })
  },
})

  const { data, isLoading } = useQuery({
    queryKey: ['candidates', debouncedSearch, sourceFilter, stageFilter],
    queryFn: () => candidatesApi.getAll({
      search: debouncedSearch || undefined,
      source: sourceFilter !== 'All' ? sourceFilter : undefined,
      limit: 200,
    }),
  })

  const candidates = data?.candidates || []
  const total = data?.total || 0

  const filtered = useMemo(() => {
    if (stageFilter === 'All') return candidates
    return candidates.filter(c =>
      c.candidateJobs?.some(cj => cj.stage === stageFilter)
    )
  }, [candidates, stageFilter])

  const stats = useMemo(() => {
    const hired = candidates.filter(c =>
      c.candidateJobs?.some(cj => cj.stage === 'HIRED')
    ).length
    const inPipeline = candidates.filter(c =>
      c.candidateJobs?.some(cj => !['HIRED', 'REJECTED'].includes(cj.stage))
    ).length
    return { hired, inPipeline }
  }, [candidates])

  const STATS = [
    { label: 'Total candidates', icon: Users, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)', value: total.toString() },
    { label: 'This week', icon: Sparkle, iconBg: 'rgba(255,122,61,0.1)', iconColor: 'var(--c-orange)', value: '+' + Math.max(0, Math.floor(total * 0.1)) },
    { label: 'In pipeline', icon: GraduationCap, iconBg: 'rgba(0,153,255,0.1)', iconColor: 'var(--c-accent)', value: stats.inPipeline.toString() },
    { label: 'Hired this month', icon: UserCheck, iconBg: 'rgba(0,153,255,0.1)', iconColor: 'var(--c-accent)', value: stats.hired.toString() },
  ]

  

  return (
    <AppLayout title="Candidates">
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
              placeholder="Search candidates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={sourceFilter}
            onChange={setSourceFilter}
            options={[
              { value: 'All', label: 'All sources' },
              { value: 'LINKEDIN', label: 'LinkedIn' },
              { value: 'INDEED', label: 'Indeed' },
              { value: 'REFERRAL', label: 'Referral' },
              { value: 'MANUAL', label: 'Manual' },
              { value: 'CAREERS_PAGE', label: 'Careers Page' },
              { value: 'OTHER', label: 'Other' },
            ]}
          />

          <Select
            value={stageFilter}
            onChange={setStageFilter}
            options={[
              { value: 'All', label: 'All stages' },
              { value: 'APPLIED', label: 'Applied' },
              { value: 'SCREENING', label: 'Screening' },
              { value: 'INTERVIEW', label: 'Interview' },
              { value: 'OFFER', label: 'Offer' },
              { value: 'HIRED', label: 'Hired' },
              { value: 'REJECTED', label: 'Rejected' },
            ]}
          />

            <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            <Plus size={14} weight="bold" />
            Add candidate
            </button>
        </div>

        <div className={styles.grid}>
          {isLoading ? (
            <div className={styles.empty}>
              <div className={styles.emptyTitle}>Loading...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <Users size={40} weight="thin" />
              <div className={styles.emptyTitle}>No candidates found</div>
              <div className={styles.emptyDesc}>Try adjusting your search or filters</div>
            </div>
          ) : (
            filtered.map(candidate => {
              const src = SOURCE_COLORS[candidate.source || 'MANUAL'] || SOURCE_COLORS.MANUAL
              const latestStage = candidate.candidateJobs?.[0]?.stage
              const stg = STAGE_COLORS[latestStage || ''] || STAGE_COLORS.APPLIED
              const initials = getInitials(candidate.firstName, candidate.lastName)
              const score = candidate.candidateJobs?.[0]?.aiScore

              return (
                <div key={candidate.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div className={styles.avatar}>{initials}</div>
                    <div>
                      <div className={styles.cardName}>
                        {candidate.firstName} {candidate.lastName}
                      </div>
                      <div className={styles.cardRole}>{candidate.email}</div>
                    </div>
                  </div>

                  <div className={styles.cardMeta}>
                    {candidate.location && (
                      <span className={styles.metaItem}>
                        <MapPin size={12} weight="fill" />
                        {candidate.location}
                      </span>
                    )}
                    {candidate.source && (
                      <span className={styles.metaItem}>
                        <GraduationCap size={12} weight="fill" />
                        {candidate.source}
                      </span>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.scoreWrap}>
                      <div className={styles.scoreBar}>
                        <div
                          className={styles.scoreFill}
                          style={{ width: `${score || 0}%`, background: 'var(--c-accent)' }}
                        />
                      </div>
                      <span className={styles.scoreVal}>{score ? `${score}%` : '—'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span className={styles.sourceBadge} style={{ background: src.bg, color: src.color }}>
                        {candidate.source || 'Manual'}
                      </span>
                      {latestStage && (
                        <span className={styles.stageBadge} style={{ background: stg.bg, color: stg.color }}>
                          {latestStage.charAt(0) + latestStage.slice(1).toLowerCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
      {showAddModal && (
  <AddCandidateModal
    onClose={() => setShowAddModal(false)}
    onAdd={data => addCandidateMutation.mutate(data)}
  />
)}
    </AppLayout>
  )
}