import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'
import { ProtectedRoute } from './components/ProtectedRoute'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const PipelinePage = lazy(() => import('./pages/PipelinePage'))
const CandidatesPage = lazy(() => import('./pages/CandidatesPage'))
const JobsPage = lazy(() => import('./pages/JobsPage'))
const InterviewsPage = lazy(() => import('./pages/InterviewsPage'))

const Spinner = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'var(--c-canvas)',
  }}>
    <div style={{
      width: 32,
      height: 32,
      border: '2px solid var(--c-hairline)',
      borderTopColor: 'var(--c-ink)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
)

export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth)
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    setTheme(saved || 'dark')
  }, [setTheme])

  useEffect(() => {
    initAuth()
  }, [initAuth])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/pipeline"
            element={
              <ProtectedRoute>
                <PipelinePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates"
            element={
              <ProtectedRoute>
                <CandidatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviews"
            element={
              <ProtectedRoute>
                <InterviewsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}