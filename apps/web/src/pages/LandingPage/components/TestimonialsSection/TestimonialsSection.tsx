import styles from './TestimonialsSection.module.css'
import { useTilt } from '../../../../hooks/useTilt'
import { PAIN_POINTS } from '../../constants'

function TiltCard({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useTilt<HTMLDivElement>({ max: 5, scale: 1.01, speed: 500 })
  return <div ref={ref} className={className}>{children}</div>
}

export function TestimonialsSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <p className={`t-caption ${styles.eyebrow}`}>Why RecruitApex</p>
          <h2 className={`t-display-lg ${styles.title} reveal`}>
            What recruiters hate about<br />their current tools
          </h2>
          <p className={`t-body-lg ${styles.sub} reveal reveal-delay-1`}>
            Real frustrations we heard from recruiters before building this.
          </p>
        </div>

        <div className={styles.grid}>
          {PAIN_POINTS.map((p, i) => (
            <TiltCard
              key={i}
              className={`${styles.card} ${styles[p.span]} reveal`}
            >
              <div className={styles.iconWrap}>
                <i className={`ti ${p.icon}`} />
              </div>
              <div className={styles.highlight}>
                {p.accentMiddle ? (
                  <>
                    <span>{p.highlight[0]}</span>
                    <span className={styles.accent}>{p.highlight[1]}</span>
                    {p.highlight[2] && <span>{p.highlight[2]}</span>}
                  </>
                ) : (
                  <>
                    <span className={styles.accent}>{p.highlight[0]}</span>
                    <span>{p.highlight[1]}</span>
                  </>
                )}
              </div>
              <p className={styles.quote}>{p.quote}</p>
              <div className={styles.role}>{p.role}</div>
            </TiltCard>
          ))}

          <TiltCard className={`${styles.card} ${styles.cardCta} ${styles.g7} reveal`}>
            <div className={styles.ctaTitle}>
              RecruitApex fixes<br />
              <span className={styles.ctaAccent}>all of this.</span>
            </div>
            <p className={styles.ctaSub}>
              Setup in 15 minutes. No ops person needed. AI that explains itself. Scheduling that just works.
            </p>
          </TiltCard>
        </div>
      </div>
    </section>
  )
}
