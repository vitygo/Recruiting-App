import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'
import { dashboardApi } from '../../api/dashboard'
import { jobsApi } from '../../api/jobs'
import { pipelineApi } from '../../api/pipeline'
import { interviewsApi } from '../../api/interviews'
import { STAGES } from '../PipelinePage/constants'
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
  const navigate = useNavigate()

  const { data: statsData } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats(),
  })

  const { data: jobsData } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.getAll(),
  })

  const { data: pipelineData } = useQuery({
    queryKey: ['pipeline', 'all'],
    queryFn: () => pipelineApi.getAll(),
  })

  const { data: interviewsData } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => interviewsApi.getAll(),
  })

  const pipeline = pipelineData?.pipeline ?? []
  const jobs = jobsData?.jobs ?? []

  const now = new Date()

  const totalCandidates = statsData?.totalCandidates ?? 0

  const pipelineByStage = STAGE_ORDER.map(stage => ({
    label: stage,
    short: STAGE_SHORT[stage],
    count: pipeline.filter(p => p.stage === stage).length,
    max: Math.max(pipeline.length, 1),
    color: STAGE_COLORS[stage],
  }))

  const upcomingInterviews = (interviewsData?.interviews ?? [])
    .filter(iv => iv.status === 'SCHEDULED' && new Date(iv.scheduledAt) >= now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 4)

  const recentJobs = jobs.slice(0, 3)

  const stageCounts = STAGES.map(s => pipeline.filter(p => p.stage === s.id).length)
  const stageMax = Math.max(...stageCounts, 1)
  const hiringStages = STAGES.map((s, i) => ({
    label: s.label,
    count: stageCounts[i],
    color: s.color,
    max: stageMax,
  }))

  return (
    <AppLayout title="Dashboard">
      <div className={styles.dashboardContainer}>
        <div className={styles.topSection}>
          <PipelineTracker pipelineByStage={pipelineByStage} totalCandidates={totalCandidates} pipeline={pipeline} />
          <ActiveJobs jobs={recentJobs} onSeeAll={() => navigate('/jobs')} />
        </div>

        <div className={styles.bottomSection}>
          <UpcomingInterviews interviews={upcomingInterviews} onSeeAll={() => navigate('/interviews')} />
          <ProUpgradeCard />
          <HiringProgress stages={hiringStages} />
        </div>
      </div>
    </AppLayout>
  )
}
