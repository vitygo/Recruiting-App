import client from './client'
import type { User } from '../types'

interface AuthResponse {
  accessToken: string
  user: User
}

export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await client.post<AuthResponse>('/auth/register', data)
    return res.data
  },

  login: async (data: { email: string; password: string }) => {
    const res = await client.post<AuthResponse>('/auth/login', data)
    return res.data
  },

  logout: async () => {
    const res = await client.post('/auth/logout')
    return res.data
  },

  me: async () => {
    const res = await client.get<{ user: User }>('/auth/me')
    return res.data
  },

  updateMe: async (data: { name?: string; bio?: string; position?: string }) => {
    const res = await client.patch<{ user: User }>('/auth/me', data)
    return res.data.user
  },
}