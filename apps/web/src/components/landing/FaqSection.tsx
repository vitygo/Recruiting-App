import { useState } from 'react'
import styles from './FaqSection.module.css'

const FAQS = [
  {
    q: 'How is RecruitApex different from Greenhouse or Lever?',
    a: 'RecruitApex is built for speed and simplicity. Setup takes 15 minutes vs 3 months. The UI is designed to minimize clicks, not maximize features. And our AI scoring is transparent — every score comes with an explanation.',
  },
  {
    q: 'Is my data safe and GDPR compliant?',
    a: 'Yes. Data is stored in EU (Frankfurt region). We support right to erasure, data export, and provide a Data Processing Agreement. Sub-processors are publicly listed. You stay in control.',
  },
  {
    q: 'Can I import my existing candidates?',
    a: 'Yes. You can import candidates via CSV from any ATS — Greenhouse, Lever, Workable, or a plain spreadsheet. The import wizard maps your columns automatically.',
  },
  {
    q: 'How does the AI scoring work?',
    a: 'Our AI scores candidates on four factors: skills match, seniority, location fit, and salary alignment. Every score includes a human-readable explanation. You can see exactly why a candidate scored 87% — no black box.',
  },
  {
    q: 'What happens when I hit the Starter plan limits?',
    a: 'You will get a notification before you hit the limit. You can upgrade to Pro at any time — your data stays exactly as is. No migration needed.',
  },
]

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