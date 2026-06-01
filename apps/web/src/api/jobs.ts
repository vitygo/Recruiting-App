import client from './client'
import { Job } from '../types'

interface GetJobsParams {
  status?: string
  department?: string
}

export const jobsApi = {
  getAll: async (params?: GetJobsParams) => {
    const res = await client.get<{ jobs: Job[] }>('/jobs', { params })
    return res.data
  },

  getOne: async (id: string) => {
    const res = await client.get<{ job: Job }>(`/jobs/${id}`)
    return res.data
  },

  create: async (data: Partial<Job>) => {
    const res = await client.post<{ job: Job }>('/jobs', data)
    return res.data
  },

  update: async (id: string, data: Partial<Job>) => {
    const res = await client.patch<{ job: Job }>(`/jobs/${id}`, data)
    return res.data
  },

  delete: async (id: string) => {
    const res = await client.delete(`/jobs/${id}`)
    return res.data
  },
}