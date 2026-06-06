import type { ElementType } from 'react'
import styles from './CandidateStats.module.css'

interface StatItem {
  label: string
  icon: ElementType
  iconBg: string
  iconColor: string
  value: string
}

interface CandidateStatsProps {
  stats: StatItem[]
  isLoading: boolean
}

export function CandidateStats({ stats, isLoading }: CandidateStatsProps) {
  return (
    <div className={styles.statsRow}>
      {stats.map((stat, i) => (
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
  )
}
