import styles from './PerspectiveSection.module.css'

const MATCH_BAR_HEIGHTS = [35, 55, 70, 90, 75, 60, 80, 95, 65, 85, 50, 72]
const ACTIVE_BARS = new Set([3, 4, 7, 8, 9, 11])

export function PerspectiveSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>&#x2F;&#x2F; Spatial Depth Talent Analytics</p>
          <h2 className={styles.title}>
            Recruitment Data<br />
            <span className={styles.titleAccent}>Reimagined</span> in Depth
          </h2>
          <p className={styles.subtitle}>
            Multi-layered candidate intelligence that surfaces what matters—from raw intake
            all the way to a single hire action.
          </p>
        </div>

        {/* Layered cards */}
        <div className={styles.layerStack}>

          {/* Layer 0 — Sourcing Streams */}
          <div className={`${styles.layerCard} ${styles.layer0} reveal`}>
            <p className={styles.layerBadge}>
              <span className={styles.layerDot} />
              Layer 01 &mdash; Sourcing Streams
            </p>
            <h3 className={styles.layerTitle}>Raw Intake Metrics</h3>
            <p className={styles.layerBody}>
              Aggregated inbound volume across all active sourcing channels—
              job boards, referrals, LinkedIn, and inbound applications.
            </p>
            <div className={styles.metricsRow}>
              <div className={styles.metric}>
                <span className={styles.metricValue}>1,248</span>
                <span className={styles.metricLabel}>Applicants / mo</span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metric}>
                <span className={styles.metricValue}>6</span>
                <span className={styles.metricLabel}>Active channels</span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metric}>
                <span className={styles.metricValue}>34%</span>
                <span className={styles.metricLabel}>Referral share</span>
              </div>
            </div>
            <div className={styles.pillRow} style={{ marginTop: 18 }}>
              {['LinkedIn', 'Indeed', 'Referral', 'AngelList', 'Career Page', 'GitHub'].map(src => (
                <span key={src} className={styles.pill}>{src}</span>
              ))}
            </div>
          </div>

          {/* Layer 1 — AI Skill Matching */}
          <div className={`${styles.layerCard} ${styles.layer1} reveal reveal-delay-1`}>
            <p className={styles.layerBadge}>
              <span className={styles.layerDot} />
              Layer 02 &mdash; AI Skill Matching
            </p>
            <h3 className={styles.layerTitle}>The Core Engine</h3>
            <p className={styles.layerBody}>
              Semantic skill-to-role alignment scored in real time. The model reads every CV,
              ranks candidate fit, and surfaces your top picks instantly.
            </p>
            <div className={styles.metricsRow} style={{ marginBottom: 16 }}>
              <div className={styles.metric}>
                <span className={styles.metricValue}>97%</span>
                <span className={styles.metricLabel}>Match accuracy</span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metric}>
                <span className={styles.metricValue}>&lt; 2s</span>
                <span className={styles.metricLabel}>Score latency</span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metric}>
                <span className={styles.metricValue}>340</span>
                <span className={styles.metricLabel}>Skills indexed</span>
              </div>
            </div>
            <div className={styles.matchBars}>
              {MATCH_BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className={`${styles.matchBar} ${ACTIVE_BARS.has(i) ? styles.matchBarActive : ''}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Layer 2 — Instant Hire Actions (top focus) */}
          <div className={`${styles.layerCard} ${styles.layer2} reveal reveal-delay-2`}>
            <p className={styles.layerBadge}>
              <span className={styles.layerDot} />
              Layer 03 &mdash; Instant Hire Actions
            </p>
            <h3 className={styles.layerTitle}>Highest-Contrast Decisions</h3>
            <p className={styles.layerBody}>
              One-click pipeline progression, offer generation, and calendar scheduling—
              converging all intelligence into a single decisive action surface.
            </p>
            <div className={styles.metricsRow} style={{ marginBottom: 20 }}>
              <div className={styles.metric}>
                <span className={styles.metricValue}>18d</span>
                <span className={styles.metricLabel}>Avg time-to-hire</span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metric}>
                <span className={styles.metricValue}>3x</span>
                <span className={styles.metricLabel}>Faster decisions</span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metric}>
                <span className={styles.metricValue}>100%</span>
                <span className={styles.metricLabel}>Audit trail</span>
              </div>
            </div>
            <div className={styles.actionRow}>
              <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>
                Move to Offer
              </button>
              <button className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}>
                Schedule Interview
              </button>
              <button className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}>
                Send Assessment
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
