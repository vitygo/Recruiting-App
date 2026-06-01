import { Link } from 'react-router-dom'
import { useRipple } from '../../hooks/useRipple'
import styles from './HeroSection.module.css'
import { useRef, useEffect } from 'react'
import { useThemeStore } from '../../store/themeStore'
import { FloatingCards } from './FloatingCards'
import {AnimatedPipeline} from './AnimatedPipeline'
const COLUMNS = [
  { label: 'Applied', count: 12, color: 'var(--c-ink-muted)' },
  { label: 'Screening', count: 7, color: 'var(--c-accent)' },
  { label: 'Interview', count: 4, color: 'var(--c-violet)' },
  { label: 'Offer', count: 2, color: 'var(--c-success)' },
]

const CANDIDATES = [
  { initials: 'AJ', name: 'Alex Johnson', role: 'Senior Engineer', score: 92, color: '#6a4cf5' },
  { initials: 'MK', name: 'Maria Kim', role: 'Product Designer', score: 87, color: '#d44df0' },
  { initials: 'RS', name: 'Ryan Smith', role: 'Frontend Dev', score: 78, color: '#0099ff' },
]

export function HeroSection() {
  const createRipple = useRipple()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useThemeStore()

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')!
    let animId: number
    let t = 0
  
    const resize = () => {
      cv.width = window.innerWidth
      cv.height = window.innerHeight
    }
  
    const W_SMALL = 120
    const H_SMALL = 80
    const small = document.createElement('canvas')
    small.width = W_SMALL
    small.height = H_SMALL
    const sCtx = small.getContext('2d')!
  
    const noise = (x: number, y: number, t: number) =>
        Math.sin(x * 1.8 + t * 1.2) * Math.cos(y * 1.4 + t * 0.9) +
        Math.sin(x * 3.1 + y * 1.8 + t * 1.6) * 0.5 +
        Math.sin(x * 1.0 - y * 2.6 + t * 0.7) * 0.35 +
        Math.cos(x * 2.4 + y * 3.2 + t * 1.1) * 0.25 +
        Math.sin(x * 5.2 + y * 4.1 + t * 2.1) * 0.15 +
        Math.cos(x * 6.3 - y * 5.4 + t * 1.8) * 0.12 +
        Math.sin(x * 8.1 + y * 7.2 + t * 2.6) * 0.08 +
        Math.cos(x * 9.4 - y * 8.3 + t * 3.1) * 0.06

    const draw = () => {
      const W = cv.width, H = cv.height
      t += 0.022
  
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
  
      const imgData = sCtx.createImageData(W_SMALL, H_SMALL)
      const data = imgData.data
  
     for (let y = 0; y < H_SMALL; y++) {
  for (let x = 0; x < W_SMALL; x++) {
    const nx = x / W_SMALL
    const ny = y / H_SMALL

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

    let r, g, b

    if (isDark) {
        r = Math.floor(10 + b1 * 160 + b4 * 60 + b5 * 30)
        g = Math.floor(0  + b2 * 15  + b3 * 20 + b4 * 10)
        b = Math.floor(60 + b1 * 130 + b2 * 90 + b3 * 50 + b5 * 40)
      } else {
        r = Math.floor(80 + b1 * 80 + b4 * 20)
        g = Math.floor(40 + b2 * 50 + b5 * 15)
        b = Math.floor(120 + b3 * 80 + b1 * 40)
      }

    const idx = (y * W_SMALL + x) * 4
    data[idx]     = Math.min(255, r)
    data[idx + 1] = Math.min(255, g)
    data[idx + 2] = Math.min(255, b)
    data[idx + 3] = 255
  }
}
  
      sCtx.putImageData(imgData, 0, 0)
  
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(small, 0, 0, W, H)
  
      const vgn = ctx.createLinearGradient(0, 0, 0, H)
      if (isDark) {
        vgn.addColorStop(0, 'rgba(4,3,10,0.55)')
        vgn.addColorStop(0.35, 'rgba(4,3,10,0.05)')
        vgn.addColorStop(0.7, 'rgba(4,3,10,0.05)')
        vgn.addColorStop(1, 'rgba(4,3,10,0.65)')
      } else {
        vgn.addColorStop(0, 'rgba(245,243,255,0.55)')
        vgn.addColorStop(0.35, 'rgba(245,243,255,0.05)')
        vgn.addColorStop(0.7, 'rgba(245,243,255,0.05)')
        vgn.addColorStop(1, 'rgba(245,243,255,0.55)')
      }
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

  return (
    <section className={styles.section}>
<div className={styles.bg}>
  <canvas ref={canvasRef} className={styles.canvas} />
  {theme === 'light' && <div className={styles.bgLight} />}
  <FloatingCards />
</div>

      <div className={styles.content}>
        <div className="reveal">
        <span className={styles.badge}>
  <span className={styles.badgeStar}>✦</span>
  Now in beta — free for early adopters
</span>
        </div>

        <h1 className={`t-display-xxl ${styles.heading} reveal reveal-delay-1`}>
          Recruiting that{' '}
          <span className={styles.gradient}>actually works</span>
        </h1>

        <p className={`t-body-lg ${styles.sub} reveal reveal-delay-2`}>
          The ATS recruiters want to use. Drag-and-drop pipeline, transparent AI scoring,
          smart scheduling — set up in 15 minutes.
        </p>

        <div className={`${styles.btns} reveal reveal-delay-3`}>
          <Link
            to="/register"
            className="btn btn-primary"
            onClick={createRipple}
            style={{ padding: '12px 28px', fontSize: 15 }}
          >
            Start for free
            <i className="ti ti-arrow-right" />
          </Link>
          <a
            href="#features"
            className="btn btn-secondary"
            onClick={createRipple}
            style={{ padding: '12px 28px', fontSize: 15 }}
          >
            <i className="ti ti-player-play" />
            See how it works
          </a>
        </div>

        <div className={`${styles.mockup} reveal reveal-delay-4`}>
          <div className={styles.mockupChrome}>
            <div className={styles.dot} style={{ background: '#ff5f57' }} />
            <div className={styles.dot} style={{ background: '#febc2e' }} />
            <div className={styles.dot} style={{ background: '#28c840' }} />
            <div className={styles.addressBar}>
              app.recruitapex.com/pipeline
            </div>
          </div>

          <div className={styles.mockupBody}>
  <AnimatedPipeline />
</div>
        </div>
        <div className={`${styles.mockupMobile} reveal reveal-delay-4`}>
  <div className={styles.candidateCard}>
    <div className={styles.candidateTop}>
      <div className={styles.candidateAvatar}>AJ</div>
      <div>
        <div className={styles.candidateName}>Alex Johnson</div>
        <div className={styles.candidateRole}>Senior Engineer</div>
      </div>
      <span className={styles.candidateBadge}>Top pick</span>
    </div>

    <div className={styles.candidateDivider} />

    <div className={styles.candidateStats}>
      <div className={styles.candidateStat}>
        <div className={styles.candidateStatValue}>92%</div>
        <div className={styles.candidateStatLabel}>AI Score</div>
      </div>
      <div className={styles.candidateStat}>
        <div className={styles.candidateStatValue}>8y</div>
        <div className={styles.candidateStatLabel}>Experience</div>
      </div>
      <div className={styles.candidateStat}>
        <div className={styles.candidateStatValue}>$140k</div>
        <div className={styles.candidateStatLabel}>Expected</div>
      </div>
    </div>

    <div className={styles.candidateFooter}>
      <div className={styles.candidateStage}>
        <div className={styles.candidateStageDot} />
        Screening stage
      </div>
      <div className={styles.candidateAction}>
        View profile
        <i className="ti ti-arrow-right" style={{ fontSize: 13 }} />
      </div>
    </div>
  </div>
</div>
      </div>
    </section>
  )
}