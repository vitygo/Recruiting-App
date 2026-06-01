import client from './client'
import type { Note } from '../types'

export const notesApi = {
  getAll: async (candidateId: string) => {
    const res = await client.get<{ notes: Note[] }>('/notes', { params: { candidateId } })
    return res.data
  },

  create: async (data: { content: string; type?: string; candidateId: string }) => {
    const res = await client.post<{ note: Note }>('/notes', data)
    return res.data
  },

  update: async (id: string, content: string) => {
    const res = await client.patch<{ note: Note }>(`/notes/${id}`, { content })
    return res.data
  },

  delete: async (id: string) => {
    const res = await client.delete(`/notes/${id}`)
    return res.data
  },
}