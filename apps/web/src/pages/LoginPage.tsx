import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { useRipple } from '../hooks/useRipple'
import { authApi } from '../api'
import { setAccessToken } from '../api/client'
import styles from './LoginPage.module.css'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Required'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
})

type LoginInput = z.infer<typeof loginSchema>
type RegisterInput = z.infer<typeof registerSchema>

const FLOAT_CARDS = [
  { initials: 'AJ', name: 'Alex Johnson', role: 'Senior Engineer', score: 92, color: '#6a4cf5', top: '18%', left: '55%', delay: 0, scale: 1, opacity: 0.85 },
  { initials: 'MK', name: 'Maria Kim', role: 'Product Designer', score: 87, color: '#d44df0', top: '45%', left: '60%', delay: 1.5, scale: 0.9, opacity: 0.65 },
  { initials: 'RS', name: 'Ryan Smith', role: 'Frontend Dev', score: 78, color: '#0099ff', top: '68%', left: '52%', delay: 0.8, scale: 0.85, opacity: 0.55 },
  { initials: 'PL', name: 'Priya Lal', role: 'Data Scientist', score: 94, color: '#22c55e', top: '30%', left: '62%', delay: 2.1, scale: 0.8, opacity: 0.45 },
  { initials: 'TW', name: 'Tom Walker', role: 'Backend Dev', score: 81, color: '#ff7a3d', top: '78%', left: '58%', delay: 0.4, scale: 0.75, opacity: 0.35 },
]

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [animKey, setAnimKey] = useState(0)
  const [animDir, setAnimDir] = useState<'right' | 'left'>('right')
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useThemeStore()
  const { setUser } = useAuthStore()
  const navigate = useNavigate()
  const createRipple = useRipple()

  const loginForm = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const switchMode = (next: 'login' | 'register') => {
    if (next === mode) return
    setAnimDir(next === 'register' ? 'right' : 'left')
    setMode(next)
    setAnimKey((k) => k + 1)
  }

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')!
    let animId: number
    let t = 0

    const W_SMALL = 120, H_SMALL = 80
    const small = document.createElement('canvas')
    small.width = W_SMALL
    small.height = H_SMALL
    const sCtx = small.getContext('2d')!

    const resize = () => {
      cv.width = window.innerWidth
      cv.height = window.innerHeight
    }

    const noise = (x: number, y: number, t: number) =>
      Math.sin(x * 1.8 + t * 1.2) * Math.cos(y * 1.4 + t * 0.9) +
      Math.sin(x * 3.1 + y * 1.8 + t * 1.6) * 0.5 +
      Math.sin(x * 1.0 - y * 2.6 + t * 0.7) * 0.35 +
      Math.cos(x * 2.4 + y * 3.2 + t * 1.1) * 0.25 +
      Math.sin(x * 5.2 + y * 4.1 + t * 2.1) * 0.15

    const draw = () => {
      const W = cv.width, H = cv.height
      t += 0.022

      const imgData = sCtx.createImageData(W_SMALL, H_SMALL)
      const data = imgData.data

      for (let y = 0; y < H_SMALL; y++) {
        for (let x = 0; x < W_SMALL; x++) {
          const nx = x / W_SMALL, ny = y / H_SMALL
          const n1 = noise(nx * 3, ny * 3, t)
          const n2 = noise(nx * 2.5 + 5, ny * 2.5 + 5, t * 0.75)
          const n3 = noise(nx * 4 - 3, ny * 4 - 3, t * 1.3)
          const n4 = noise(nx * 5 + 8, ny * 3.5 - 6, t * 0.9)
          const n5 = noise(nx * 2 - 7, ny * 6 + 4, t * 1.6)
          const b1 = (n1 + 2.5) / 5
          const b2 = (n2 + 2.5) / 5
          const b3 = (n3 + 2.5) / 5
          const b4 = (n4 + 2.5) / 5
          const b5 = (n5 + 2.5) / 5
          const idx = (y * W_SMALL + x) * 4
          data[idx] = Math.min(255, Math.floor(10 + b1 * 160 + b4 * 60 + b5 * 30))
          data[idx + 1] = Math.min(255, Math.floor(0 + b2 * 15 + b3 * 20 + b4 * 10))
          data[idx + 2] = Math.min(255, Math.floor(60 + b1 * 130 + b2 * 90 + b3 * 50 + b5 * 40))
          data[idx + 3] = 255
        }
      }

      sCtx.putImageData(imgData, 0, 0)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(small, 0, 0, W, H)

      const vgn = ctx.createLinearGradient(0, 0, 0, H)
      vgn.addColorStop(0, 'rgba(4,3,10,0.55)')
      vgn.addColorStop(0.35, 'rgba(4,3,10,0.05)')
      vgn.addColorStop(0.7, 'rgba(4,3,10,0.05)')
      vgn.addColorStop(1, 'rgba(4,3,10,0.65)')
      ctx.fillStyle = vgn
      ctx.fillRect(0, 0, W, H)

      animId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const onLogin = async (data: LoginInput) => {
    setLoading(true)
    try {
      const res = await authApi.login(data)
      setAccessToken(res.accessToken)
      setUser(res.user)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const onRegister = async (data: RegisterInput) => {
    setLoading(true)
    try {
      const res = await authApi.register(data)
      setAccessToken(res.accessToken)
      setUser(res.user)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch {
      toast.error('Email already in use')
    } finally {
      setLoading(false)
    }
  }

  const animClass = animDir === 'right' ? styles.slideEnter : styles.slideEnterReverse

  return (
    <div className={styles.page}>
      <canvas ref={canvasRef} className={styles.canvas} />
      {theme === 'light' && <div className={styles.bgLight} />}

      <div className={styles.left}>
        <Link to="/" className={styles.logo}>RecruitApex</Link>

        <div key={`title-${mode}`} className={styles.leftTitleEnter}>
          <div className={styles.title}>
            {mode === 'login' ? (
              <>Welcome<br />back.</>
            ) : (
              <>Start hiring<br /><span className={styles.titleGrad}>smarter.</span></>
            )}
          </div>
          <p className={styles.sub}>
            {mode === 'login'
              ? 'Your pipeline is waiting. Candidates to review, interviews to schedule.'
              : 'Set up your recruitment pipeline in 15 minutes. No ops person needed.'}
          </p>
        </div>

        <div className={styles.floatingCards}>
          {FLOAT_CARDS.map((card, i) => (
            <div
              key={i}
              className={styles.floatCard}
              style={{
                top: card.top,
                left: card.left,
                opacity: card.opacity,
                transform: `scale(${card.scale})`,
                animation: `floatCard ${5.5 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${card.delay}s`,
              }}
            >
              <div className={styles.floatAvatar} style={{ background: card.color }}>
                {card.initials}
              </div>
              <div>
                <div className={styles.floatName}>{card.name}</div>
                <div className={styles.floatRole}>{card.role}</div>
              </div>
              <div className={styles.floatScore}>{card.score}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.right}>
      <div className={styles.mobileHeader}>
  <Link to="/" style={{ textDecoration: 'none' }}>
    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--c-ink)' }}>
      RecruitApex
    </span>
  </Link>
  <div key={`mobile-title-${mode}`} className={styles.leftTitleEnter}>
    <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-1px', color: 'var(--c-ink)', lineHeight: 1.1 }}>
      {mode === 'login' ? 'Welcome back.' : <span>Start hiring <span className={styles.titleGrad}>smarter.</span></span>}
    </div>
  </div>
</div>
        <div className={styles.formWrap}>
          <div key={animKey} className={`${styles.formCard} ${animClass}`}>
            {mode === 'login' ? (
              <>
                <div className={styles.formTitle}>Sign in</div>
                <div className={styles.formSub}>
                  Don't have an account?{' '}
                  <a onClick={() => switchMode('register')}>Create one free</a>
                </div>

                <form onSubmit={loginForm.handleSubmit(onLogin)}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email</label>
                    <input
                      className={styles.formInput}
                      placeholder="you@company.com"
                      {...loginForm.register('email')}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Password</label>
                    <input
                      className={styles.formInput}
                      type="password"
                      placeholder="••••••••"
                      {...loginForm.register('password')}
                    />
                  </div>
                  <button
                    className={styles.submitBtn}
                    type="submit"
                    disabled={loading}
                    onClick={createRipple}
                  >
                    {loading ? 'Signing in...' : 'Sign in →'}
                  </button>
                </form>

                <div className={styles.divider}>
                  <div className={styles.dividerLine} />
                  <span className={styles.dividerText}>or continue with</span>
                  <div className={styles.dividerLine} />
                </div>

                <button className={styles.googleBtn} onClick={createRipple}>
                  <i className="ti ti-brand-google" />
                  Google
                </button>

                <div className={styles.formFooter}>
                  Forgot password? <a href="#">Reset it</a>
                </div>
              </>
            ) : (
              <>
                <div className={styles.formTitle}>Create account</div>
                <div className={styles.formSub}>
                  Already have one?{' '}
                  <a onClick={() => switchMode('login')}>Sign in</a>
                </div>

                <form onSubmit={registerForm.handleSubmit(onRegister)}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Full name</label>
                    <input
                      className={styles.formInput}
                      placeholder="Alex Johnson"
                      {...registerForm.register('name')}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email</label>
                    <input
                      className={styles.formInput}
                      placeholder="you@company.com"
                      {...registerForm.register('email')}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Password</label>
                    <input
                      className={styles.formInput}
                      type="password"
                      placeholder="Min. 8 characters"
                      {...registerForm.register('password')}
                    />
                  </div>
                  <button
                    className={styles.submitBtn}
                    type="submit"
                    disabled={loading}
                    onClick={createRipple}
                  >
                    {loading ? 'Creating account...' : 'Get started free →'}
                  </button>
                </form>

                <div className={styles.divider}>
                  <div className={styles.dividerLine} />
                  <span className={styles.dividerText}>or continue with</span>
                  <div className={styles.dividerLine} />
                </div>

                <button className={styles.googleBtn} onClick={createRipple}>
                  <i className="ti ti-brand-google" />
                  Google
                </button>

                <div className={styles.formFooter}>
                  By signing up you agree to our <a href="#">Terms</a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0) rotate(-1deg) scale(var(--scale, 1)); }
          33% { transform: translateY(-12px) rotate(0.5deg) scale(var(--scale, 1)); }
          66% { transform: translateY(6px) rotate(-0.5deg) scale(var(--scale, 1)); }
        }
      `}</style>
    </div>
  )
}