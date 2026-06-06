import { useQuery } from '@tanstack/react-query'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuthStore } from '../store/authStore'
import { candidatesApi } from '../api/candidates'
import { jobsApi } from '../api/jobs'
import { pipelineApi } from '../api/pipeline'
import { interviewsApi } from '../api/interviews'
import { ChartBar } from '@phosphor-icons/react/ChartBar'
import { Briefcase } from '@phosphor-icons/react/Briefcase'
import { CaretUp } from '@phosphor-icons/react/CaretUp'
import { CaretDown } from '@phosphor-icons/react/CaretDown'
import { MapPin } from '@phosphor-icons/react/MapPin'
import { Plus } from '@phosphor-icons/react/Plus'
import { ArrowRight } from '@phosphor-icons/react/ArrowRight'
import styles from './DashboardPage.module.css'
import { useState } from 'react'


const SIZE = 220
const CX = SIZE / 2
const CY = SIZE / 2
const STROKE = 8
const RADII = [96, 80, 64, 48, 32]

const STAGE_COLORS: Record<string, string> = {
  APPLIED: 'var(--c-ink-muted)',
  SCREENING: 'var(--c-accent)',
  INTERVIEW: 'var(--c-orange)',
  OFFER: '#f97316',
  HIRED: 'var(--c-success)',
}

function polarToXY(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToXY(cx, cy, r, startAngle)
  const end = polarToXY(cx, cy, r, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

const STAGE_ORDER = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED']
const STAGE_SHORT: Record<string, string> = {
  APPLIED: 'A', SCREENING: 'S', INTERVIEW: 'I', OFFER: 'O', HIRED: 'H'
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const firstName = user?.name?.split(' ')[0] || 'there'

  const { data: candidatesData } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => candidatesApi.getAll({ limit: 100 }),
  })

  const { data: jobsData } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.getAll(),
  })

  const { data: pipelineData } = useQuery({
    queryKey: ['pipeline'],
    queryFn: () => pipelineApi.getAll(),
  })

  const { data: interviewsData } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => interviewsApi.getAll(),
  })

  const totalCandidates = candidatesData?.total || 0
  const activeJobs = jobsData?.jobs.filter(j => j.status === 'OPEN').length || 0

  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)

  const interviewsThisWeek = interviewsData?.interviews.filter(iv => {
    const d = new Date(iv.scheduledAt)
    return d >= weekStart && d <= weekEnd
  }).length || 0

  const pipeline = pipelineData?.pipeline || []
  const pipelineByStage = STAGE_ORDER.map(stage => ({
    label: stage,
    short: STAGE_SHORT[stage],
    count: pipeline.filter(p => p.stage === stage).length,
    max: Math.max(pipeline.length, 1),
    color: STAGE_COLORS[stage],
  }))

  const upcomingInterviews = (interviewsData?.interviews || [])
    .filter(iv => iv.status === 'SCHEDULED' && new Date(iv.scheduledAt) >= now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 4)

  const recentJobs = jobsData?.jobs.slice(0, 3) || []

  const [activeStage, setActiveStage] = useState('SCREENING')
  const activeStageData = pipelineByStage.find(s => s.label === activeStage)

  const formatInterviewTime = (scheduledAt: string) => {
    const d = new Date(scheduledAt)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const isToday = d.toDateString() === today.toDateString()
    const isTomorrow = d.toDateString() === tomorrow.toDateString()

    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

    if (isToday) return `Today ${time}`
    if (isTomorrow) return `Tomorrow ${time}`
    return d.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' + time
  }

  return (
    <AppLayout title="Dashboard">
      <div className={styles.dashboardContainer}>
        <div className={styles.topSection}>
          <div className={styles.trackerCard}>
            <div className={styles.trackerHeaderRow}>
              <div className={styles.iconWrapper}>
                <ChartBar size={20} weight="fill" />
              </div>
              <div>
                <h3 className={styles.cardTitle}>Pipeline Tracker</h3>
                <p className={styles.cardSubtitle}>Conversion and candidate flow overview</p>
              </div>
            </div>

            <div className={styles.trackerContent}>
              <div className={styles.radialWrap}>
                <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                  {pipelineByStage.map((stage, i) => {
                    const r = RADII[i]
                    const pct = stage.max > 0 ? stage.count / stage.max : 0
                    const angle = pct * 340
                    const isActive = activeStage === stage.label
                    return (
                      <g key={stage.label}>
                        <circle cx={CX} cy={CY} r={r} fill="none" stroke="var(--c-hairline-soft)" strokeWidth={STROKE} />
                        {angle > 0 && (
                          <path
                            d={describeArc(CX, CY, r, 0, angle)}
                            fill="none"
                            stroke={stage.color}
                            strokeWidth={isActive ? STROKE + 3 : STROKE}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-width 0.15s ease' }}
                            onMouseEnter={() => setActiveStage(stage.label)}
                            cursor="pointer"
                          />
                        )}
                      </g>
                    )
                  })}
                  <text x={CX} y={CY - 4} textAnchor="middle" fill="var(--c-ink)" fontSize="24" fontWeight="700" fontFamily="var(--f-body)">
                    {activeStageData?.count || 0}
                  </text>
                  <text x={CX} y={CY + 14} textAnchor="middle" fill="var(--c-ink-muted)" fontSize="9" fontWeight="600" fontFamily="var(--f-body)" letterSpacing="0.5">
                    {activeStageData?.label || 'TOTAL'}
                  </text>
                </svg>
              </div>

              <div className={styles.legendList}>
                {pipelineByStage.map(stage => (
                  <div
                    key={stage.label}
                    className={`${styles.legendItem} ${activeStage === stage.label ? styles.legendItemHovered : ''}`}
                    onMouseEnter={() => setActiveStage(stage.label)}
                  >
                    <div className={styles.legendDot} style={{ background: stage.color }} />
                    <div className={styles.legendInfo}>
                      <span className={styles.legendName}>{stage.label.charAt(0) + stage.label.slice(1).toLowerCase()}</span>
                      <span className={styles.legendCount}>{stage.count} candidates</span>
                    </div>
                    <div className={styles.legendBadge}>{stage.short}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.metricFooter}>
              <div className={styles.metricValue}>{totalCandidates}</div>
              <p className={styles.metricDesc}>Total candidates across all pipeline stages</p>
            </div>
          </div>

          <div className={styles.jobsCard}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTitle}>Active Jobs</h4>
              <span className={styles.seeAllLink}>See all jobs</span>
            </div>

            <div className={styles.jobsList}>
              {recentJobs.length === 0 ? (
                <p className={styles.cardSubtitle}>No jobs yet</p>
              ) : (
                recentJobs.map(job => (
                  <div key={job.id} className={styles.jobItem}>
                    <div className={styles.jobMainRow}>
                      <div className={styles.jobIcon}>
                        <Briefcase size={20} weight="fill" />
                      </div>
                      <div className={styles.jobMeta}>
                        <div className={styles.jobTitleWrap}>
                          <h5>{job.title}</h5>
                          <span className={`${styles.badge} ${job.status === 'OPEN' ? styles.badgeSuccess : styles.badgeDraft}`}>
                            {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                          </span>
                        </div>
                        <p className={styles.jobSubText}>{job._count?.candidates || 0} candidates</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.connectCard}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTitle}>Upcoming Interviews</h4>
              <span className={styles.seeAllLink}>See all</span>
            </div>
            <div className={styles.connectList}>
              {upcomingInterviews.length === 0 ? (
                <p className={styles.cardSubtitle}>No upcoming interviews</p>
              ) : (
                upcomingInterviews.map(iv => (
                  <div key={iv.id} className={styles.connectItem}>
                    <div className={styles.avatar}>
                      {iv.candidate?.firstName?.[0]}{iv.candidate?.lastName?.[0]}
                    </div>
                    <div className={styles.connectInfo}>
                      <h6>{iv.candidate?.firstName} {iv.candidate?.lastName}</h6>
                      <p>{formatInterviewTime(iv.scheduledAt)}</p>
                    </div>
                    <span className={styles.levelLabel}>{iv.type}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.premiumCard}>
            <h5>Unlock AI Sourcing</h5>
            <p>Get access to AI candidate scoring, smart scheduling and advanced pipeline analytics.</p>
            <button className={styles.premiumBtn}>
              Upgrade to Pro <ArrowRight size={16} weight="fill" style={{ marginLeft: '6px' }} />
            </button>
          </div>

          <div className={styles.progressCard}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTitle}>Hiring Progress</h4>
            </div>
            <div className={styles.progressGrid}>
              <div className={styles.progressMetric}>
                <span>Candidates</span>
                <strong>{totalCandidates}</strong>
              </div>
              <div className={styles.progressMetric} style={{ borderColor: 'var(--c-orange)' }}>
                <span>Interviews</span>
                <strong style={{ color: 'var(--c-orange)' }}>{interviewsThisWeek}</strong>
              </div>
              <div className={styles.progressMetric}>
                <span>Open jobs</span>
                <strong>{activeJobs}</strong>
              </div>
            </div>
            <div className={styles.combChart}>
              {Array.from({ length: 30 }).map((_, i) => {
                let barColor = 'var(--c-hairline)'
                if (i >= 10 && i <= 18) barColor = 'var(--c-orange)'
                if (i > 18 && i <= 24) barColor = 'var(--c-ink)'
                return <div key={i} className={styles.combTooth} style={{ backgroundColor: barColor }} />
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}