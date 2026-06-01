import { AppLayout } from '../components/layout/AppLayout'
import { useAuthStore } from '../store/authStore'
import styles from './DashboardPage.module.css'

const STATS = [
  {
    label: 'Total candidates',
    icon: 'ti-users',
    value: '248',
    delta: '+12 this week',
    deltaType: 'positive',
    iconBg: 'rgba(106,76,245,0.15)',
    iconColor: '#a78bfa',
  },
  {
    label: 'Active jobs',
    icon: 'ti-briefcase',
    value: '7',
    delta: '2 closing soon',
    deltaType: 'neutral',
    iconBg: 'rgba(0,153,255,0.15)',
    iconColor: '#0099ff',
  },
  {
    label: 'Interviews this week',
    icon: 'ti-calendar',
    value: '12',
    delta: '+3 vs last week',
    deltaType: 'positive',
    iconBg: 'rgba(212,77,240,0.15)',
    iconColor: '#d44df0',
  },
  {
    label: 'Avg time-to-hire',
    icon: 'ti-clock',
    value: '18d',
    delta: '-4d vs last month',
    deltaType: 'positive',
    iconBg: 'rgba(34,197,94,0.15)',
    iconColor: '#22c55e',
  },
]

const PIPELINE = [
  { label: 'Applied', count: 42, max: 42, color: 'rgba(255,255,255,0.25)', dotColor: 'var(--c-ink-muted)' },
  { label: 'Screening', count: 27, max: 42, color: '#0099ff', dotColor: '#0099ff' },
  { label: 'Interview', count: 17, max: 42, color: '#6a4cf5', dotColor: '#6a4cf5' },
  { label: 'Offer', count: 7, max: 42, color: '#d44df0', dotColor: '#d44df0' },
  { label: 'Hired', count: 4, max: 42, color: '#22c55e', dotColor: '#22c55e' },
]

const INTERVIEWS = [
  {
    initials: 'AJ',
    name: 'Alex Johnson',
    role: 'Senior Engineer',
    time: 'Today 2:00 PM',
    type: 'Video',
    color: '#6a4cf5',
    badgeBg: 'rgba(0,153,255,0.12)',
    badgeColor: '#38bdf8',
  },
  {
    initials: 'MK',
    name: 'Maria Kim',
    role: 'Product Designer',
    time: 'Tomorrow 11:00 AM',
    type: 'Onsite',
    color: '#d44df0',
    badgeBg: 'rgba(106,76,245,0.12)',
    badgeColor: '#a78bfa',
  },
  {
    initials: 'RS',
    name: 'Ryan Smith',
    role: 'Frontend Dev',
    time: 'Thu 3:30 PM',
    type: 'Phone',
    color: '#0099ff',
    badgeBg: 'rgba(34,197,94,0.12)',
    badgeColor: '#22c55e',
  },
]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <AppLayout title="Dashboard">
      <div className={styles.page}>
        <div className={styles.greeting}>
          <div className={styles.greetingTitle}>Welcome back, {firstName}</div>
          <div className={styles.greetingSub}>Here's what's happening with your pipeline today.</div>
        </div>

        <div className={styles.stats}>
          {STATS.map((stat, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.statLabel}>{stat.label}</div>
                <div
                  className={styles.statIconWrap}
                  style={{ background: stat.iconBg, color: stat.iconColor }}
                >
                  <i className={`ti ${stat.icon}`} />
                </div>
              </div>

              <div className={styles.statBottom}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={`${styles.statDelta} ${
                  stat.deltaType === 'positive' ? styles.deltaPositive :
                  stat.deltaType === 'negative' ? styles.deltaNegative :
                  styles.deltaNeutral
                }`}>
                  {stat.deltaType === 'positive' && <i className="ti ti-trending-up" style={{ fontSize: '0.75rem' }} />}
                  {stat.deltaType === 'negative' && <i className="ti ti-trending-down" style={{ fontSize: '0.75rem' }} />}
                  {stat.delta}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Pipeline overview</div>
              <span className={styles.cardAction}>
                View all <i className="ti ti-arrow-right" style={{ fontSize: '0.75rem' }} />
              </span>
            </div>
            {PIPELINE.map((row) => (
              <div key={row.label} className={styles.pipelineRow}>
                <div className={styles.pipelineDot} style={{ background: row.dotColor }} />
                <div className={styles.pipelineLabel}>{row.label}</div>
                <div className={styles.pipelineBarWrap}>
                  <div
                    className={styles.pipelineBar}
                    style={{
                      width: `${(row.count / row.max) * 100}%`,
                      background: row.color,
                    }}
                  />
                </div>
                <div className={styles.pipelineCount}>{row.count}</div>
              </div>
            ))}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Upcoming interviews</div>
              <span className={styles.cardAction}>
                View all <i className="ti ti-arrow-right" style={{ fontSize: '0.75rem' }} />
              </span>
            </div>
            {INTERVIEWS.map((iv, i) => (
              <div key={i} className={styles.interviewItem}>
                <div
                  className={styles.interviewAvatar}
                  style={{ background: iv.color }}
                >
                  {iv.initials}
                </div>
                <div className={styles.interviewInfo}>
                  <div className={styles.interviewName}>{iv.name}</div>
                  <div className={styles.interviewRole}>{iv.role}</div>
                </div>
                <div className={styles.interviewMeta}>
                  <div className={styles.interviewTime}>{iv.time}</div>
                  <span
                    className={styles.interviewBadge}
                    style={{ background: iv.badgeBg, color: iv.badgeColor }}
                  >
                    {iv.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}