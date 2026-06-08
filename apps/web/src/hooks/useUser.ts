import { useEffect, useState } from 'react'
import { loadDemoUser, type DemoUser } from '../lib/demoStorage'

export function useUser(): DemoUser {
  const [user, setUser] = useState<DemoUser>(loadDemoUser)

  useEffect(() => {
    const refresh = () => setUser(loadDemoUser())
    window.addEventListener('storage', refresh)
    window.addEventListener('user-updated', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('user-updated', refresh)
    }
  }, [])

  return user
}
