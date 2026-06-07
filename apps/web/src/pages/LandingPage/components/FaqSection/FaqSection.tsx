import { useState } from 'react'
import styles from './FaqSection.module.css'
import { FAQS } from '../../constants'

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className={styles.section} id="faq">
      <div className="container">
        <div className={styles.header}>
          <p className={`t-caption ${styles.eyebrow}`}>— FAQ</p>
          <h2 className={`t-display-lg ${styles.title} reveal`}>
            Common questions
          </h2>
        </div>

        <div className={styles.list}>
          {FAQS.map((faq, i) => (
            <div key={i} className={`${styles.row} reveal`} style={{ transitionDelay: `${i * 0.05}s` }}>
              <button
                className={styles.question}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {faq.q}
                <svg
                  className={`${styles.chevron} ${open === i ? styles.open : ''}`}
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M4.5 6.75L9 11.25L13.5 6.75"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className={`${styles.answer} ${open === i ? styles.open : ''}`}>
                <p className={styles.answerText}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
