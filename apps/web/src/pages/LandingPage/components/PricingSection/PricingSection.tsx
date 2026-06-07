import { Link } from 'react-router-dom'
import { useRipple } from '../../../../hooks/useRipple'
import styles from './PricingSection.module.css'
import { useRef } from 'react'
import { PricingBg } from '../PricingBg/PricingBg'
import { PLANS } from '../../constants'

function FeaturedCard({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
