import styles from './LogosSection.module.css'

const PHRASES = [
  '✦ No more spreadsheets',
  '✦ Setup in 15 minutes',
  '✦ AI that explains itself',
  '✦ Zero email ping-pong',
  '✦ Drag. Drop. Hired.',
  '✦ Your pipeline, your way',
  '✦ Stop losing candidates',
  '✦ Hire faster, not harder',
  '✦ Less clicking, more hiring',
  '✦ Finally, an ATS you like',
]

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