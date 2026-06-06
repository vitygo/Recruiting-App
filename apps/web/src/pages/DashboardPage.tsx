import { useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuthStore } from '../store/authStore'
import styles from './DashboardPage.module.css'

import { ChartBar } from "@phosphor-icons/react/ChartBar"
import { Briefcase } from "@phosphor-icons/react/Briefcase"
import { CaretUp } from "@phosphor-icons/react/CaretUp"
import { CaretDown } from "@phosphor-icons/react/CaretDown"
import { MapPin } from "@phosphor-icons/react/MapPin"
import { Plus } from "@phosphor-icons/react/Plus"
import { ArrowRight } from "@phosphor-icons/react/ArrowRight"

const PIPELINE_DATA = [
  { label: 'Applied', short: 'A', count: 42, max: 42, color: 'var(--c-ink-muted)' },
  { label: 'Screening', short: 'S', count: 27, max: 42, color: 'var(--c-ink)' },
  { label: 'Interview', short: 'I', count: 17, max: 42, color: 'var(--c-orange)' },
  { label: 'Offer', short: 'O', count: 7, max: 42, color: '#f97316' },
  { label: 'Hired', short: 'H', count: 4, max: 42, color: 'var(--c-accent, #3b82f6)' },
]

const JOBS_DATA = [
  {
    id: 1,
    title: 'Senior Full-Stack Engineer',
    status: 'Active',
    type: 'Remote',
    schedule: 'Full-time',
    candidates: '42 candidates',
    location: 'Ukraine',
    time: '2h ago',
    open: true,
  },
  {
    id: 2,
    title: 'Product Designer',
    status: 'Draft',
    type: 'Hybrid',
    schedule: 'Part-time',
    candidates: '0 candidates',
    location: 'Poland',
    time: '1d ago',
    open: false,
  },
  {
    id: 3,
    title: 'DevOps Engineer',
    status: 'Active',
    type: 'Remote',
    schedule: 'Full-time',
    candidates: '17 candidates',
    location: 'Remote',
    time: '3d ago',
    open: false,
  },
]

const QUICK_CONTACTS = [
  { name: 'Alex Johnson', role: 'Senior Full-Stack Engineer', level: 'Senior', initials: 'AJ'},
  { name: 'Maria Kim', role: 'Product Designer', level: 'Middle', initials: 'MK'},
]

const SIZE = 220
const CX = SIZE / 2
const CY = SIZE / 2
const STROKE = 8
const RADII = [96, 80, 64, 48, 32]

function polarToXY(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * (Math.PI / 180)
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToXY(cx, cy, r, startAngle)
  const end = polarToXY(cx, cy, r, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [activeStage, setActiveStage] = useState('Screening')

  const totalCandidates = PIPELINE_DATA.reduce((acc, curr) => acc + curr.count, 0)
  const activeStageData = PIPELINE_DATA.find(r => r.label === activeStage)

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
                  {PIPELINE_DATA.map((stage, i) => {
                    const r = RADII[i]
                    const pct = stage.count / stage.max
                    const angle = pct * 340
                    const isActive = activeStage === stage.label

                    return (
                      <g key={stage.label}>
                        <circle
                          cx={CX} cy={CY} r={r}
                          fill="none"
                          stroke="var(--c-hairline-soft)"
                          strokeWidth={STROKE}
                        />
                        {angle > 0 && (
                          <path
                            d={describeArc(CX, CY, r, 0, angle)}
                            fill="none"
                            stroke={stage.color}
                            strokeWidth={isActive ? STROKE + 3 : STROKE}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-width 0.15s ease, stroke 0.2s' }}
                            onMouseEnter={() => setActiveStage(stage.label)}
                            cursor="pointer"
                          />
                        )}
                      </g>
                    )
                  })}

                  <text
                    x={CX} y={CY - 4}
                    textAnchor="middle"
                    fill="var(--c-ink)"
                    fontSize="24"
                    fontWeight="700"
                    fontFamily="var(--f-body)"
                  >
                    {activeStageData ? activeStageData.count : totalCandidates}
                  </text>
                  <text
                    x={CX} y={CY + 14}
                    textAnchor="middle"
                    fill="var(--c-ink-muted)"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="var(--f-body)"
                    letterSpacing="0.5"
                  >
                    {activeStageData ? activeStageData.label.toUpperCase() : 'TOTAL CAND.'}
                  </text>
                </svg>
              </div>

              <div className={styles.legendList}>
                {PIPELINE_DATA.map((stage) => (
                  <div
                    key={stage.label}
                    className={`${styles.legendItem} ${activeStage === stage.label ? styles.legendItemHovered : ''}`}
                    onMouseEnter={() => setActiveStage(stage.label)}
                  >
                    <div className={styles.legendDot} style={{ background: stage.color }} />
                    <div className={styles.legendInfo}>
                      <span className={styles.legendName}>{stage.label}</span>
                      <span className={styles.legendCount}>{stage.count} candidates</span>
                    </div>
                    <div className={styles.legendBadge}>{stage.short}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.metricFooter}>
              <div className={styles.metricValue}>+20%</div>
              <p className={styles.metricDesc}>This week's hiring velocity is higher than last week's</p>
            </div>
          </div>

          <div className={styles.jobsCard}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTitle}>Your Active Jobs</h4>
              <span className={styles.seeAllLink}>See all jobs</span>
            </div>

            <div className={styles.jobsList}>
              {JOBS_DATA.map((job) => (
                <div key={job.id} className={`${styles.jobItem} ${job.open ? styles.jobItemExpanded : ''}`}>
                  <div className={styles.jobMainRow}>
                    <div className={styles.jobIcon}>
                      <Briefcase size={20} weight="fill" />
                    </div>
                    <div className={styles.jobMeta}>
                      <div className={styles.jobTitleWrap}>
                        <h5>{job.title}</h5>
                        <span className={`${styles.badge} ${job.status === 'Active' ? styles.badgeSuccess : styles.badgeDraft}`}>
                          {job.status}
                        </span>
                      </div>
                      <p className={styles.jobSubText}>{job.candidates}</p>
                    </div>
                    <button className={styles.expandBtn}>
                      {job.open ? <CaretUp size={16} weight="fill" /> : <CaretDown size={16} weight="fill" />}
                    </button>
                  </div>

                  {job.open && (
                    <div className={styles.jobDetailsArea}>
                      <div className={styles.tagRow}>
                        <span className={styles.filterTag}>{job.type}</span>
                        <span className={styles.filterTag}>{job.schedule}</span>
                      </div>
                      <p className={styles.jobDescriptionSnippet}>
                        This role involves building scalable features, conducting code reviews, and collaborating with product and design teams.
                      </p>
                      <div className={styles.jobFooterInfo}>
                        <span>
                          <MapPin size={14} weight="fill" style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          {job.location}
                        </span>
                        <span>{job.time}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className={styles.bottomSection}>

          <div className={styles.connectCard}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTitle}>Recent Candidates</h4>
              <span className={styles.seeAllLink}>See all</span>
            </div>
            <div className={styles.connectList}>
              {QUICK_CONTACTS.map((person, idx) => (
                <div key={idx} className={styles.connectItem}>
                  <div
                    className={styles.avatar}
                    style={{
                      background: person.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {person.initials}
                  </div>
                  <div className={styles.connectInfo}>
                    <h6>{person.name} <span className={styles.levelLabel}>{person.level}</span></h6>
                    <p>{person.role}</p>
                  </div>
                  <button className={styles.addBtn}>
                    <Plus size={14} weight="fill" />
                  </button>
                </div>
              ))}
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
              <span className={styles.dateSelector}>
                June, 2026 <CaretDown size={12} weight="bold" style={{ marginLeft: '4px' }} />
              </span>
            </div>

            <div className={styles.progressGrid}>
              <div className={styles.progressMetric}>
                <span>Reviewed</span>
                <strong>64</strong>
              </div>
              <div className={styles.progressMetric} style={{ borderColor: 'var(--c-orange)' }}>
                <span>Interviews</span>
                <strong style={{ color: 'var(--c-orange)' }}>12</strong>
              </div>
              <div className={styles.progressMetric}>
                <span>Hired</span>
                <strong>10</strong>
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