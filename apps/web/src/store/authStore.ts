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

let initPromise: Promise<void> | null = null

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAccessToken: (token) => setAccessToken(token),

  initAuth: async () => {
    if (initPromise) return initPromise

    initPromise = (async () => {
      try {
        const refreshRes = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        })

        if (!refreshRes.ok) {
          set({ user: null, isAuthenticated: false, isLoading: false })
          return
        }

        const data = await refreshRes.json()
        setAccessToken(data.accessToken)

        const meRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${data.accessToken}` },
          credentials: 'include',
        })

        if (!meRes.ok) {
          set({ user: null, isAuthenticated: false, isLoading: false })
          return
        }

        const { user } = await meRes.json()
        set({ user, isAuthenticated: true, isLoading: false })
      } catch {
        set({ user: null, isAuthenticated: false, isLoading: false })
      } finally {
        initPromise = null
      }
    })()

    return initPromise
  },

  logout: async () => {
    try {
      await authApi.logout()
    } finally {
      setAccessToken(null)
      set({ user: null, isAuthenticated: false, isLoading: true })
    }
  },
}))