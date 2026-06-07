import styles from './HiringProgress.module.css'

interface StageBar {
  label: string
  count: number
  max: number
  color?: string
}

interface HiringProgressProps {
  stages: StageBar[]
}

export function HiringProgress({ stages }: HiringProgressProps) {
  const total = stages.reduce((acc, s) => acc + s.count, 0)

  return (
    <div className={styles.progressCard}>
      <div className={styles.sectionHeader}>
        <h4 className={styles.sectionTitle}>Hiring Progress</h4>
        <span className={styles.totalBadge}>{total} total</span>
      </div>

      <div className={styles.stageList}>
        {stages.map(({ label, count, max }) => {
          const pct = max > 0 ? Math.round((count / max) * 100) : 0
          return (
            <div key={label} className={styles.stageRow}>
              <span className={styles.stageLabel}>
                {label.charAt(0) + label.slice(1).toLowerCase()}
              </span>
              <div className={styles.stageBarWrap} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div className={styles.stageBar} style={{ width: `${pct}%` }} />
              </div>
              <div className={styles.stageMetrics}>
                <span className={styles.stageCount}>{count}</span>
                <span className={styles.stagePct}>{pct}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
