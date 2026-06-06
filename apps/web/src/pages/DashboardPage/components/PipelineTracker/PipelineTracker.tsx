import { useState } from 'react'
import { ChartBar } from '@phosphor-icons/react/ChartBar'
import styles from './PipelineTracker.module.css'

const SIZE = 220
const CX = SIZE / 2
const CY = SIZE / 2
const STROKE = 8
const RADII = [96, 80, 64, 48, 32]

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
}

export function PipelineTracker({ pipelineByStage, totalCandidates }: PipelineTrackerProps) {
  const [activeStage, setActiveStage] = useState('SCREENING')
  const activeStageData = pipelineByStage.find(s => s.label === activeStage)

  return (
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
  )
}
