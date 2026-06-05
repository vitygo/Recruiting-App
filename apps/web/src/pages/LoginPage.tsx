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
  { initials: 'AJ', name: 'Alex Johnson', role: 'Senior Engineer', score: 92, color: '#ff7a3d', top: '18%', left: '55%', delay: 0, scale: 1, opacity: 0.85 },
  { initials: 'MK', name: 'Maria Kim', role: 'Product Designer', score: 87, color: '#ff7a3d', top: '45%', left: '60%', delay: 1.5, scale: 0.9, opacity: 0.65 },
  { initials: 'RS', name: 'Ryan Smith', role: 'Frontend Dev', score: 78, color: '#ff7a3d', top: '68%', left: '52%', delay: 0.8, scale: 0.85, opacity: 0.55 },
  { initials: 'PL', name: 'Priya Lal', role: 'Data Scientist', score: 94, color: '#ff7a3d', top: '30%', left: '62%', delay: 2.1, scale: 0.8, opacity: 0.45 },
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
      Math.sin(x * 1.5 + t * 1.0) * Math.cos(y * 1.2 + t * 0.8) +
      Math.sin(x * 2.5 + y * 1.5 + t * 1.4) * 0.5 +
      Math.sin(x * 0.8 - y * 2.0 + t * 0.6) * 0.3
  
    const draw = () => {
      const W = cv.width, H = cv.height
      t += 0.018
  
      const imgData = sCtx.createImageData(W_SMALL, H_SMALL)
      const data = imgData.data
  
      const bgR = 10, bgG = 16, bgB = 44
      const c1R = 0, c1G = 102, c1B = 255
  

      const c2R = 255, c2G = 122, c2B = 61 // #FF7A3D
  
      for (let y = 0; y < H_SMALL; y++) {
        for (let x = 0; x < W_SMALL; x++) {
          const nx = x / W_SMALL
          const ny = y / H_SMALL
  
          const n1 = noise(nx * 2.8, ny * 2.8, t)
          const n2 = noise(nx * 2.2 + 4, ny * 2.2 + 4, t * 0.85)
  
          let factor1 = Math.max(0, Math.min(1, (n1 + 1.2) / 2.4))
          let factor2 = Math.max(0, Math.min(1, (n2 + 1.2) / 2.4))
  
          factor1 = Math.pow(factor1, 2)
  
          factor2 = Math.pow(factor2, 4) * 0.4
  
          let r = bgR + (c1R - bgR) * factor1
          let g = bgG + (c1G - bgG) * factor1
          let b = bgB + (c1B - bgB) * factor1
  
          r = r + (c2R - r) * factor2
          g = g + (c2G - g) * factor2
          b = b + (c2B - b) * factor2
  
          const idx = (y * W_SMALL + x) * 4
          data[idx] = Math.floor(r)
          data[idx + 1] = Math.floor(g)
          data[idx + 2] = Math.floor(b)
          data[idx + 3] = 255
        }
      }
  
      sCtx.putImageData(imgData, 0, 0)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(small, 0, 0, W, H)
  
      const vgn = ctx.createLinearGradient(0, 0, 0, H)
      vgn.addColorStop(0, 'rgba(5, 7, 20, 0.8)')
      vgn.addColorStop(0.3, 'rgba(5, 7, 20, 0.0)')
      vgn.addColorStop(0.7, 'rgba(5, 7, 20, 0.0)')
      vgn.addColorStop(1, 'rgba(5, 7, 20, 0.85)')
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