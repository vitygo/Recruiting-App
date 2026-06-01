import axios from 'axios'

let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

client.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let refreshPromise: Promise<string> | null = null

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    original._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post('/api/auth/refresh', {}, { withCredentials: true })
          .then((res) => res.data.accessToken)
          .finally(() => { refreshPromise = null })
      }

      const newToken = await refreshPromise
      setAccessToken(newToken)
      original.headers.Authorization = `Bearer ${newToken}`
      return client(original)
    } catch {
      setAccessToken(null)
      window.location.href = '/login'
      return Promise.reject(error)
    }
  }
)

export default client