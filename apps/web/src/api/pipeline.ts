import client from './client'
import type { CandidateJob, PipelineStage } from '../types'

export const pipelineApi = {
  getAll: async (params?: { jobId?: string; stage?: string }) => {
    const res = await client.get<{ pipeline: CandidateJob[] }>('/pipeline', { params })
    return res.data
  },

  addCandidate: async (data: { candidateId: string; jobId: string; stage?: PipelineStage }) => {
    const res = await client.post<{ candidateJob: CandidateJob }>('/pipeline', data)
    return res.data
  },

  updateStage: async (id: string, stage: PipelineStage) => {
    const res = await client.patch<{ candidateJob: CandidateJob }>(`/pipeline/${id}/stage`, { stage })
    return res.data
  },

  remove: async (id: string) => {
    const res = await client.delete(`/pipeline/${id}`)
    return res.data
  },
}