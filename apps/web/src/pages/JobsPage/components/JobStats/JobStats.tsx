import type { Icon } from '@phosphor-icons/react'
import styles from './JobStats.module.css'

export type StatItem = {
  label: string
  value: string
  icon: Icon
  iconBg: string
  iconColor: string
}

type Props = {
  stats: StatItem[]
  isLoading: boolean
}

export function JobStats({ stats, isLoading }: Props) {
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
