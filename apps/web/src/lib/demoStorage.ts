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
  return load(PIPELINE_KEY, BASE_PIPELINE)
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
