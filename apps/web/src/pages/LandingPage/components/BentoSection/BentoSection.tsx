import styles from './BentoSection.module.css'
import { useTilt } from '../../../../hooks/useTilt'
import { useRef } from 'react'
import { BARS, INTEGRATIONS } from '../../constants'

function TiltCard({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useTilt<HTMLDivElement>({ max: 6, scale: 1.02, speed: 500 })
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export function BentoSection() {
  return (
    <section className={styles.section} id="features">
      <div className="container">
        <div className={styles.header}>
          <p className={`t-caption ${styles.eyebrow}`}>— Features</p>
          <h2 className={`t-display-lg ${styles.title} reveal`}>
            Everything your team needs
          </h2>
        </div>

        <div className={styles.bento}>
          <TiltCard className={`${styles.bc} ${styles.bcViolet} ${styles.onGrad} ${styles.g5} ${styles.r2} reveal`}>
            <div className={styles.bcIcon}><i className="ti ti-brain" /></div>
            <div className={styles.bcTitle}>AI Candidate Scoring</div>
            <div className={styles.bcBody}>
              Our model reads CVs, ranks fit, and surfaces your top candidates instantly.
            </div>
            <div className={styles.floatTags}>
              <span className={styles.ftag}>97% match</span>
              <span className={styles.ftag}>Senior fit</span>
              <span className={styles.ftag}>Top pick</span>
            </div>
          </TiltCard>

          <TiltCard className={`${styles.bc} ${styles.g7} ${styles.r2} reveal reveal-delay-1`}>
            <div className={styles.bcIcon}><i className="ti ti-layout-kanban" /></div>
            <div className={styles.bcTitle}>Visual Pipeline</div>
            <div className={styles.bcBody}>
              Drag-and-drop kanban that mirrors how your team actually thinks about stages.
            </div>
            <div className={styles.bars}>
              {BARS.map((bar, i) => (
                <div
                  key={i}
                  className={`${styles.bar} ${bar.active ? styles.barActive : ''}`}
                  style={{ height: `${bar.h}%`, animationDelay: `${bar.delay}s` }}
                />
              ))}
            </div>
          </TiltCard>

          <TiltCard className={`${styles.bc} ${styles.g4} reveal`}>
            <div className={styles.bcStat}>
              18<span className={styles.bcStatUnit}>d</span>
            </div>
            <div className={styles.bcBody} style={{ marginTop: 10 }}>
              Average time-to-hire. Down from 34-day industry average.
            </div>
          </TiltCard>

          <TiltCard className={`${styles.bc} ${styles.bcMagenta} ${styles.onGrad} ${styles.g4} reveal reveal-delay-1`}>
            <div className={styles.bcIcon}><i className="ti ti-message-dots" /></div>
            <div className={styles.bcTitle}>Team Collaboration</div>
            <div className={styles.bcBody}>
              Shared scorecards and @mentions keep everyone aligned.
            </div>
          </TiltCard>

          <TiltCard className={`${styles.bc} ${styles.g4} reveal reveal-delay-2`}>
            <div className={styles.bcIcon}><i className="ti ti-calendar-event" /></div>
            <div className={styles.bcTitle}>Smart Scheduling</div>
            <div className={styles.bcBody}>
              One-click scheduling syncs with Google Calendar and Outlook automatically.
            </div>
          </TiltCard>

          <TiltCard className={`${styles.bc} ${styles.bcOrange} ${styles.onGrad} ${styles.g4} reveal`}>
            <div className={styles.bcIcon}><i className="ti ti-chart-dots" /></div>
            <div className={styles.bcTitle}>Hiring Analytics</div>
            <div className={styles.bcBody}>
              Track source quality and funnel conversion in real time.
            </div>
          </TiltCard>

          <TiltCard className={`${styles.bc} ${styles.g8} ${styles.rowStart} reveal reveal-delay-1`}>
            <div className={styles.bcIcon}><i className="ti ti-plug-connected" /></div>
            <div className={styles.bcTitle}>40+ Integrations</div>
            <div className={styles.bcBody}>
              Plug into your existing stack in minutes.
            </div>
            <div className={styles.intgRow}>
              {INTEGRATIONS.map((item) => (
                <div key={item.label} className={styles.intgPill}>
                  <i className={`ti ${item.icon}`} />
                  {item.label}
                </div>
              ))}
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  )
}
