import client from './client'
import { Candidate } from '../types'

interface GetCandidatesParams {
  search?: string
  source?: string
  page?: number
  limit?: number
}

interface CandidatesResponse {
  candidates: Candidate[]
  total: number
  page: number
}

export const candidatesApi = {
  getAll: async (params?: GetCandidatesParams) => {
    const res = await client.get<CandidatesResponse>('/candidates', { params })
    return res.data
  },

  getOne: async (id: string) => {
    const res = await client.get<{ candidate: Candidate }>(`/candidates/${id}`)
    return res.data
  },

  create: async (data: Partial<Candidate>) => {
    const res = await client.post<{ candidate: Candidate }>('/candidates', data)
    return res.data
  },

  update: async (id: string, data: Partial<Candidate>) => {
    const res = await client.patch<{ candidate: Candidate }>(`/candidates/${id}`, data)
    return res.data
  },

  delete: async (id: string) => {
    const res = await client.delete(`/candidates/${id}`)
    return res.data
  },
}