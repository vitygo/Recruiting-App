import { create } from 'zustand'
import type { User } from '../types'
import { authApi } from '../api'
import { setAccessToken } from '../api/client'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setAccessToken: (token: string) => void
  initAuth: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setAccessToken: (token) => setAccessToken(token),

  initAuth: async () => {
    try {
      const { user } = await authApi.me()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
  
  logout: async () => {
    try {
      await authApi.logout()
    } finally {
      setAccessToken(null)
      set({ user: null, isAuthenticated: false })
    }
  },
}))