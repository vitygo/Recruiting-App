// import styles from './TestimonialsSection.module.css'

// const TESTIMONIALS = [
//   {
//     quote: "We cut our time-to-hire by 40% in the first month. The AI scoring actually explains itself — our hiring managers finally trust the data.",
//     name: 'Sarah Chen',
//     role: 'Head of Talent, Vercel',
//     initials: 'SC',
//     color: '#6a4cf5',
//   },
//   {
//     quote: "Setup took 12 minutes. I imported our pipeline from a spreadsheet and everything just worked. No ops manager, no training sessions.",
//     name: 'Marcus Williams',
//     role: 'Recruiting Lead, Linear',
//     initials: 'MW',
//     color: '#d44df0',
//   },
//   {
//     quote: "The candidate scheduling link is a game changer. Zero back-and-forth emails. Candidates love it too — we get fewer no-shows.",
//     name: 'Priya Sharma',
//     role: 'Senior Recruiter, Notion',
//     initials: 'PS',
//     color: '#0099ff',
//   },
// ]

// export function TestimonialsSection() {
//   return (
//     <section className={styles.section}>
//       <div className="container">
//         <div className={styles.header}>
//           <p className={`t-caption ${styles.eyebrow}`}>Testimonials</p>
//           <h2 className={`t-display-lg ${styles.title} reveal`}>
//             Loved by recruiters
//           </h2>
//         </div>

//         <div className={styles.grid}>
//           {TESTIMONIALS.map((t, i) => (
//             <div
//               key={i}
//               className={`${styles.card} reveal`}
//               style={{ transitionDelay: `${i * 0.1}s` }}
//             >
//               <div className={styles.stars}>
//                 {Array.from({ length: 5 }).map((_, j) => (
//                   <span key={j} className={styles.star}>★</span>
//                 ))}
//               </div>

//               <p className={styles.quote}>"{t.quote}"</p>

//               <div className={styles.author}>
//                 <div className={styles.avatar} style={{ background: t.color }}>
//                   {t.initials}
//                 </div>
//                 <div>
//                   <div className={styles.authorName}>{t.name}</div>
//                   <div className={styles.authorRole}>{t.role}</div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }


import styles from './TestimonialsSection.module.css'
import { useTilt } from '../../hooks/useTilt'

const PAIN_POINTS = [
  {
    icon: 'ti-table-off',
    highlight: ['200+ candidates', ' in a spreadsheet.'],
    quote: 'Columns everywhere, no history, no context. One wrong filter and everything was gone.',
    role: 'Recruiter at a Series A startup',
    span: 'g5',
  },
  {
    icon: 'ti-clock-x',
    highlight: ['2 hours every Monday', ' just scheduling interviews.'],
    quote: 'Back-and-forth emails, timezone confusion, last-minute cancellations. It was exhausting.',
    role: 'Talent Lead, remote-first team',
    span: 'g7',
  },
  {
    icon: 'ti-brain-off',
    highlight: ['91% match.', ' Completely wrong hire.'],
    quote: 'The ATS never explained why. We trusted the score and paid for it.',
    role: 'Hiring Manager, 50-person company',
    span: 'g4',
  },
  {
    icon: 'ti-messages-off',
    highlight: ['Feedback ', 'scattered', ' everywhere.'],
    quote: 'Slack, email, sticky notes. By decision time half the team forgot what they thought.',
    role: 'Engineering Manager',
    span: 'g4',
    accentMiddle: true,
  },
  {
    icon: 'ti-plug-off',
    highlight: ['3 months', ' to set up. Still broken.'],
    quote: 'Required a dedicated ops person and still didn\'t work the way we actually hired.',
    role: 'Head of People, growth-stage startup',
    span: 'g4',
  },
  {
    icon: 'ti-eye-off',
    highlight: ['We were ', 'flying blind.'],
    quote: 'No idea where candidates dropped off. Zero visibility into our own funnel.',
    role: 'Recruiter, agency',
    span: 'g5',
    accentMiddle: true,
  },
]

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