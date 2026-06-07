import { useState, useMemo } from 'react'
import { ChartBar } from '@phosphor-icons/react/ChartBar'
import type { CandidateJob } from '../../../../types'
import { AvatarStack } from '../../../../components/AvatarStack'
import type { AvatarItem } from '../../../../components/AvatarStack'
import styles from './PipelineTracker.module.css'

const SIZE = 220
const CX   = SIZE / 2
const CY   = SIZE / 2
const STROKE = 8
const RADII  = [96, 80, 64, 48, 32]

function polarToXY(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToXY(cx, cy, r, startAngle)
  const end   = polarToXY(cx, cy, r, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

interface StageData {
  label: string
  short: string
  count: number
  max: number
  color: string
}

interface PipelineTrackerProps {
  pipelineByStage: StageData[]
  totalCandidates: number
  pipeline?: CandidateJob[]
}

export function PipelineTracker({ pipelineByStage, totalCandidates, pipeline }: PipelineTrackerProps) {
  const [activeStage, setActiveStage] = useState('SCREENING')
  const activeStageData = pipelineByStage.find(s => s.label === activeStage)

  const avatarsByStage = useMemo(() => {
    const map: Record<string, AvatarItem[]> = {}
    for (const cj of pipeline ?? []) {
      if (!cj.candidate) continue
      if (!map[cj.stage]) map[cj.stage] = []
      map[cj.stage].push({
        name: `${cj.candidate.firstName} ${cj.candidate.lastName}`,
        avatarUrl: cj.candidate.avatarUrl,
      })
    }
    return map
  }, [pipeline])

  const allAvatars = useMemo(() => Object.values(avatarsByStage).flat(), [avatarsByStage])

  return (
    <div className={styles.trackerCard}>
      <div className={styles.trackerHeaderRow}>
        <div className={styles.iconWrapper}>
          <ChartBar size={20} weight="fill" aria-hidden="true" />
        </div>
        <div>
          <h3 className={styles.cardTitle}>Pipeline Tracker</h3>
          <p className={styles.cardSubtitle}>Conversion and candidate flow overview</p>
        </div>
      </div>

      <div className={styles.trackerContent}>
        <div className={styles.radialWrap}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
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
          {pipelineByStage.map(stage => {
            const stageAvatars = avatarsByStage[stage.label] ?? []
            return (
              <div
                key={stage.label}
                className={`${styles.legendItem} ${activeStage === stage.label ? styles.legendItemHovered : ''}`}
                onMouseEnter={() => setActiveStage(stage.label)}
                role="button"
                tabIndex={0}
                aria-label={`${stage.label}: ${stage.count} candidates`}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setActiveStage(stage.label) }}
              >
                <div className={styles.legendDot} style={{ background: stage.color }} aria-hidden="true" />
                <div className={styles.legendInfo}>
                  <span className={styles.legendName}>{stage.label.charAt(0) + stage.label.slice(1).toLowerCase()}</span>
                  <span className={styles.legendCount}>{stage.count} candidates</span>
                </div>
                {stageAvatars.length > 0 && (
                  <AvatarStack items={stageAvatars} max={3} size={22} />
                )}
                <div className={styles.legendBadge} aria-hidden="true">{stage.short}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.metricFooter}>
        <div>
          <div className={styles.metricValue}>{totalCandidates}</div>
          <p className={styles.metricDesc}>Total candidates across all pipeline stages</p>
        </div>
        {allAvatars.length > 0 && (
          <AvatarStack items={allAvatars} max={5} size={30} />
        )}
      </div>
    </div>
  )
}
