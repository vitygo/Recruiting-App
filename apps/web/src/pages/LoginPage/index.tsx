import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthBackground from './components/AuthBackground'
import LeftHeroSection from './components/LeftHeroSection'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [animKey, setAnimKey] = useState(0)
  const [animDir, setAnimDir] = useState<'right' | 'left'>('right')

  const switchMode = (next: 'login' | 'register') => {
    if (next === mode) return
    setAnimDir(next === 'register' ? 'right' : 'left')
    setMode(next)
    setAnimKey((k) => k + 1)
  }

  const animClass = animDir === 'right' ? styles.slideEnter : styles.slideEnterReverse

  return (
    <div className={styles.page}>
      <AuthBackground />
      <LeftHeroSection mode={mode} />

      <div className={styles.right}>
        <div className={styles.mobileHeader}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--c-ink)' }}>
              RecruitApex
            </span>
          </Link>
          <div key={`mobile-title-${mode}`} className={styles.leftTitleEnter}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-1px', color: 'var(--c-ink)', lineHeight: 1.1 }}>
              {mode === 'login' ? 'Welcome back.' : <span>Start hiring <span style={{ background: 'var(--main-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>smarter.</span></span>}
            </div>
          </div>
        </div>

        <div className={styles.formWrap}>
          <div key={animKey} className={`${styles.formCard} ${animClass}`}>
            {mode === 'login' ? (
              <LoginForm onSwitchToRegister={() => switchMode('register')} />
            ) : (
              <RegisterForm onSwitchToLogin={() => switchMode('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
