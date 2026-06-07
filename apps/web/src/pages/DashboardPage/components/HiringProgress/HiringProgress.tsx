import styles from './HiringProgress.module.css'

interface StageBar {
  label: string
  count: number
  color: string
  max: number
}

interface HiringProgressProps {
  stages: StageBar[]
}

export function HiringProgress({ stages }: HiringProgressProps) {
  return (
    <div className={styles.progressCard}>
      <div className={styles.sectionHeader}>
        <h4 className={styles.sectionTitle}>Hiring Progress</h4>
      </div>
      <div className={styles.stageList}>
        {stages.map(({ label, count, color, max }) => (
          <div key={label} className={styles.stageRow}>
            <span className={styles.stageLabel}>{label}</span>
            <div className={styles.stageBarWrap}>
              <div
                className={styles.stageBar}
                style={{ width: `${Math.round((count / max) * 100)}%`, backgroundColor: color }}
              />
            </div>
            <span className={styles.stageCount}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
