import { create } from 'zustand'

interface ThemeState {
  theme: 'dark' | 'light'
  toggle: () => void
  setTheme: (theme: 'dark' | 'light') => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',

  toggle: () => set((state) => {
    const next = state.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
    return { theme: next }
  }),

  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    set({ theme })
  },
}))