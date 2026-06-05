import { Link } from 'react-router-dom'
import { useRipple } from '../../hooks/useRipple'
import styles from './PricingSection.module.css'
import { useEffect, useRef } from 'react'
import { PricingBg } from './PricingBg'

const PLANS = [
  {
    name: 'Starter',
    amount: '0',
    period: 'forever',
    desc: 'Perfect for solo recruiters and small teams just getting started.',
    featured: false,
    cta: 'Get started free',
    ctaTo: '/register',
    features: [
      'Up to 3 active jobs',
      'Up to 50 candidates',
      'Kanban pipeline',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    amount: '49',
    period: '/user/mo',
    desc: 'For growing teams that need AI scoring, smart scheduling and full analytics.',
    featured: true,
    cta: 'Start free trial',
    ctaTo: '/register',
    features: [
      'Unlimited jobs & candidates',
      'AI match scoring',
      'Smart scheduling',
      'Unified timeline',
      'Advanced analytics',
      'Priority support',
      'White-label portal',
    ],
  },
  {
    name: 'Enterprise',
    amount: 'Custom',
    period: '',
    desc: 'For large teams with custom compliance, SSO and dedicated support needs.',
    featured: false,
    cta: 'Contact us',
    ctaTo: '/register',
    features: [
      'Everything in Pro',
      'SSO / SAML',
      'Custom data residency',
      'SLA 99.9%',
      'Dedicated CSM',
      'Custom integrations',
    ],
  },
]




function FeaturedCard({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // useEffect(() => {
  //   const cv = canvasRef.current
  //   if (!cv) return
  //   const ctx = cv.getContext('2d')!
  //   let animId: number

  //   const resize = () => {
  //     cv.width = cv.offsetWidth
  //     cv.height = cv.offsetHeight
  //   }

  //   interface Star {
  //     x: number
  //     y: number
  //     size: number
  //     opacity: number
  //     speed: number
  //     angle: number
  //     pulse: number
  //     pulseSpeed: number
  //   }

  //   const stars: Star[] = Array.from({ length: 20 }, () => ({
  //     x: Math.random(),
  //     y: Math.random(),
  //     size: 1 + Math.random() * 2,
  //     opacity: 0.2 + Math.random() * 0.6,
  //     speed: 0.0003 + Math.random() * 0.0005,
  //     angle: Math.random() * Math.PI * 2,
  //     pulse: Math.random() * Math.PI * 2,
  //     pulseSpeed: 0.02 + Math.random() * 0.03,
  //   }))

  //   const drawStar = (cx: number, cy: number, size: number) => {
  //     const spikes = 4
  //     const outer = size
  //     const inner = size * 0.3
  //     let rot = -Math.PI / 4
  //     ctx.beginPath()
  //     for (let i = 0; i < spikes * 2; i++) {
  //       const r = i % 2 === 0 ? outer : inner
  //       ctx.lineTo(cx + Math.cos(rot) * r, cy + Math.sin(rot) * r)
  //       rot += Math.PI / spikes
  //     }
  //     ctx.closePath()
  //   }

  //   const draw = () => {
  //     const W = cv.width, H = cv.height
  //     ctx.clearRect(0, 0, W, H)

  //     stars.forEach((s) => {
  //       s.angle += s.speed * Math.PI * 2
  //       s.pulse += s.pulseSpeed

  //       const orbitX = 0.5 + Math.cos(s.angle) * 0.45
  //       const orbitY = 0.5 + Math.sin(s.angle) * 0.48
  //       const x = orbitX * W
  //       const y = orbitY * H
  //       const pulse = 1 + Math.sin(s.pulse) * 0.3
  //       const size = s.size * pulse
  //       const opacity = s.opacity * (0.7 + Math.sin(s.pulse) * 0.3)

  //       ctx.save()
  //       ctx.globalAlpha = opacity
  //       ctx.fillStyle = 'rgba(180, 150, 255, 0.9)'
  //       drawStar(x, y, size)
  //       ctx.fill()
  //       ctx.restore()
  //     })

  //     animId = requestAnimationFrame(draw)
  //   }

  //   resize()
  //   window.addEventListener('resize', resize)
  //   draw()

  //   return () => {
  //     cancelAnimationFrame(animId)
  //     window.removeEventListener('resize', resize)
  //   }
  // }, [])

  return (
    <div className={`${styles.card} ${styles.cardFeatured}`}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          borderRadius: 'var(--r-xxl)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {children}
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <div className={styles.checkIcon}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export function PricingSection() {
  const createRipple = useRipple()

  return (
    <section className={styles.section} id="pricing">
        <PricingBg />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.header}>
          <p className={`t-caption ${styles.eyebrow}`}>Pricing</p>
          <h2 className={`t-display-lg ${styles.title} reveal`}>
            Simple, transparent pricing
          </h2>
          <p className={`t-body-lg ${styles.sub} reveal reveal-delay-1`}>
            Start free. Upgrade when you're ready. No hidden fees.
          </p>
        </div>

        <div className={styles.grid}>
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`${styles.card} ${plan.featured ? styles.cardFeatured : ''} reveal`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {plan.featured && (
                <div className={styles.featuredBadge}>Most popular</div>
              )}

              <div>
                <div className={styles.planName}>{plan.name}</div>
              </div>

              <div className={styles.price}>
                {plan.amount === 'Custom' ? (
                  <span className={styles.amount} style={{ fontSize: 32 }}>Custom</span>
                ) : (
                  <>
                    <span className={styles.amount}>
                      {plan.amount === '0' ? 'Free' : `$${plan.amount}`}
                    </span>
                    {plan.period && (
                      <span className={styles.period}>{plan.period}</span>
                    )}
                  </>
                )}
              </div>

              <p className={styles.desc}>{plan.desc}</p>

              <div className={styles.divider} />

              <div className={styles.features}>
                {plan.features.map((f) => (
                  <div key={f} className={styles.feature}>
                    <CheckIcon />
                    {f}
                  </div>
                ))}
              </div>

              <Link
                to={plan.ctaTo}
                className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'} ${styles.cta}`}
                onClick={createRipple}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}