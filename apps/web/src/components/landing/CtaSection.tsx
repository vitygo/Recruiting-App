import { Link } from 'react-router-dom'
import { useRipple } from '../../hooks/useRipple'
import styles from './CtaSection.module.css'

export function CtaSection() {
  const createRipple = useRipple()

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.inner} reveal`}>
          <div className={`${styles.orb} ${styles.orb1}`} />
          <div className={`${styles.orb} ${styles.orb2}`} />

          <h2 className={styles.title}>
            Ready to hire smarter?
          </h2>

          <p className={`t-body-lg ${styles.sub}`}>
          Built for recruiters who are tired of spreadsheets.
          </p>

          <div className={styles.btns}>
            <Link
              to="/register"
              className={`${"btn"} ${styles.btnPrimary}`}
              onClick={createRipple}
              style={{ padding: '12px 32px', fontSize: 15 }}
            >
                <i className="ti ti-arrow-right"></i> 
              Start for free
            </Link>
            <a
              href="mailto:hello@recruitapex.com"
              className={`${"btn btn-secondary"} ${styles.btnSecondary}`}
              onClick={createRipple}
              style={{ padding: '12px 32px', fontSize: 15 }}
            >
              Talk to us
            </a>
          </div>

          <p className={styles.note}>
            No credit card required · GDPR compliant · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}