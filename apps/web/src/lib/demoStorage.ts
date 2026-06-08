import type { CandidateJob, Job } from '../types'
import { DEMO_PIPELINE as BASE_PIPELINE, DEMO_JOBS as BASE_JOBS } from '../pages/PipelinePage/constants'

const PIPELINE_KEY = 'recruit_demo_pipeline'
const JOBS_KEY = 'recruit_demo_jobs'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch {
    // ignore
  }
  return fallback
}

function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export function loadDemoPipeline(): CandidateJob[] {
  const data = load(PIPELINE_KEY, BASE_PIPELINE)
  // Flush stale data that used pre-formatted strings instead of ISO dates
  const isStale = data.some(cj => cj.appliedAt && isNaN(new Date(cj.appliedAt).getTime()))
  if (isStale) {
    save(PIPELINE_KEY, BASE_PIPELINE)
    return BASE_PIPELINE
  }
  return data
}

export function saveDemoPipeline(pipeline: CandidateJob[]): void {
  save(PIPELINE_KEY, pipeline)
}

export function loadDemoJobs(): Job[] {
  return load(JOBS_KEY, BASE_JOBS)
}

export function saveDemoJobs(jobs: Job[]): void {
  save(JOBS_KEY, jobs)
}

export function deleteCandidateFromDemo(candidateId: string): void {
  const updated = loadDemoPipeline().filter(cj => cj.candidateId !== candidateId)
  saveDemoPipeline(updated)
}

const USER_KEY = 'recruit_demo_user'
const ORG_KEY = 'recruit_demo_org'

export interface DemoUser {
  name: string
  email: string
  bio: string
  position: string
  avatarDataUrl?: string
}

export interface DemoOrg {
  companyName: string
}

const DEFAULT_USER: DemoUser = {
  name: 'Viktor',
  email: 'vitygocanal@gmail.com',
  bio: '',
  position: 'Recruiter',
}

export function loadDemoUser(): DemoUser {
  return load(USER_KEY, DEFAULT_USER)
}

export function saveDemoUser(user: DemoUser): void {
  save(USER_KEY, user)
  window.dispatchEvent(new CustomEvent('user-updated'))
}

const DEFAULT_ORG: DemoOrg = { companyName: 'RecruitApex' }

export function loadDemoOrg(): DemoOrg {
  return load(ORG_KEY, DEFAULT_ORG)
}

export function saveDemoOrg(org: DemoOrg): void {
  save(ORG_KEY, org)
}
