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
  { initials: 'AJ', name: 'Alex Johnson', role: 'Senior Engineer', score: 92, color: '#ff7a3d' },
  { initials: 'MK', name: 'Maria Kim', role: 'Product Designer', score: 87, color: '#ff7a3d' },
  { initials: 'RS', name: 'Ryan Smith', role: 'Frontend Dev', score: 78, color: '#ff7a3d' },
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