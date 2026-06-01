import client from './client'
import { Interview } from '../types'

interface GetInterviewsParams {
  date?: string
  status?: string
}

export const interviewsApi = {
  getAll: async (params?: GetInterviewsParams) => {
    const res = await client.get<{ interviews: Interview[] }>('/interviews', { params })
    return res.data
  },

  getOne: async (id: string) => {
    const res = await client.get<{ interview: Interview }>(`/interviews/${id}`)
    return res.data
  },

  create: async (data: Partial<Interview>) => {
    const res = await client.post<{ interview: Interview }>('/interviews', data)
    return res.data
  },

  update: async (id: string, data: Partial<Interview>) => {
    const res = await client.patch<{ interview: Interview }>(`/interviews/${id}`, data)
    return res.data
  },

  delete: async (id: string) => {
    const res = await client.delete(`/interviews/${id}`)
    return res.data
  },
}