import styles from './LogosSection.module.css'
import { PHRASES } from '../../constants'

export function LogosSection() {
  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <div className={styles.track}>
          {[...PHRASES, ...PHRASES].map((phrase, i) => (
            <span key={i} className={styles.phrase}>{phrase}</span>
          ))}
        </div>
      </div>

      <div className={styles.wrapper}>
        <div className={`${styles.track} ${styles.trackReverse}`}>
          {[...PHRASES, ...PHRASES].reverse().map((phrase, i) => (
            <span key={i} className={`${styles.phrase} ${styles.phraseMuted}`}>{phrase}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
