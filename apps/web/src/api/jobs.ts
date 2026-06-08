import client from './client'
import type { Job } from '../types'

interface GetJobsParams {
  status?: string
  department?: string
}

function parseTechStack(job: Job): Job {
  if (!job.techStack) return { ...job, technologies: [] }
  try {
    return { ...job, technologies: JSON.parse(job.techStack) }
  } catch {
    return { ...job, technologies: job.techStack.split(',').map(s => s.trim()).filter(Boolean) }
  }
}

function toApiPayload(data: Partial<Job>): Record<string, unknown> {
  const { technologies, ...rest } = data as Partial<Job> & { technologies?: string[] }
  return {
    ...rest,
    ...(technologies !== undefined && {
      techStack: technologies.length > 0 ? JSON.stringify(technologies) : undefined,
    }),
  }
}

export const jobsApi = {
  getAll: async (params?: GetJobsParams) => {
    const res = await client.get<{ jobs: Job[] }>('/jobs', { params })
    return { ...res.data, jobs: res.data.jobs.map(parseTechStack) }
  },

  getOne: async (id: string) => {
    const res = await client.get<{ job: Job }>(`/jobs/${id}`)
    return { ...res.data, job: parseTechStack(res.data.job) }
  },

  create: async (data: Partial<Job>) => {
    const res = await client.post<{ job: Job }>('/jobs', toApiPayload(data))
    return { ...res.data, job: parseTechStack(res.data.job) }
  },

  update: async (id: string, data: Partial<Job>) => {
    const res = await client.patch<{ job: Job }>(`/jobs/${id}`, toApiPayload(data))
    return { ...res.data, job: parseTechStack(res.data.job) }
  },

  delete: async (id: string) => {
    const res = await client.delete(`/jobs/${id}`)
    return res.data
  },
}
