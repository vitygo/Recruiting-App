import { useQuery } from '@tanstack/react-query'
import { AppLayout } from '../../components/layout/AppLayout'
import { candidatesApi } from '../../api/candidates'
import { jobsApi } from '../../api/jobs'
import { pipelineApi } from '../../api/pipeline'
import { interviewsApi } from '../../api/interviews'
import { PipelineTracker } from './components/PipelineTracker/PipelineTracker'
import { ActiveJobs } from './components/ActiveJobs/ActiveJobs'
import { UpcomingInterviews } from './components/UpcomingInterviews/UpcomingInterviews'
import { ProUpgradeCard } from './components/ProUpgradeCard/ProUpgradeCard'
import { HiringProgress } from './components/HiringProgress/HiringProgress'
import styles from './DashboardPage.module.css'

const STAGE_ORDER = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED']
const STAGE_SHORT: Record<string, string> = {
  APPLIED: 'A', SCREENING: 'S', INTERVIEW: 'I', OFFER: 'O', HIRED: 'H',
}
const STAGE_COLORS: Record<string, string> = {
  APPLIED: 'var(--c-ink-muted)',
  SCREENING: 'var(--c-accent)',
  INTERVIEW: 'var(--c-orange)',
  OFFER: '#f97316',
  HIRED: 'var(--c-success)',
}

export default function DashboardPage() {
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

  return (
    <AppLayout title="Dashboard">
      <div className={styles.dashboardContainer}>
        <div className={styles.topSection}>
          <PipelineTracker pipelineByStage={pipelineByStage} totalCandidates={totalCandidates} />
          <ActiveJobs jobs={recentJobs} />
        </div>

        <div className={styles.bottomSection}>
          <UpcomingInterviews interviews={upcomingInterviews} />
          <ProUpgradeCard />
          <HiringProgress
            totalCandidates={totalCandidates}
            interviewsThisWeek={interviewsThisWeek}
            activeJobs={activeJobs}
          />
        </div>
      </div>
    </AppLayout>
  )
}
