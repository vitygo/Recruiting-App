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

const PAIN_POINTS = [
  {
    icon: 'ti-table-off',
    quote: "We were tracking 200+ candidates in a spreadsheet. Columns everywhere, no history, no context. One wrong filter and everything was gone.",
    role: 'Recruiter at a Series A startup',
  },
  {
    icon: 'ti-clock-x',
    quote: "I spent 2 hours every Monday just scheduling interviews. Back-and-forth emails, timezone confusion, last-minute cancellations. It was exhausting.",
    role: 'Talent Lead, remote-first team',
  },
  {
    icon: 'ti-brain-off',
    quote: "Our ATS gave us a score but never explained why. We hired someone with a 91% match who was completely wrong for the role.",
    role: 'Hiring Manager, 50-person company',
  },
  {
    icon: 'ti-messages-off',
    quote: "Feedback was scattered across Slack, email, and sticky notes. By the time we made a decision, half the team forgot what they even thought.",
    role: 'Engineering Manager',
  },
  {
    icon: 'ti-plug-off',
    quote: "Our old ATS took 3 months to set up, required a dedicated ops person, and still didn't work the way we actually hired.",
    role: 'Head of People, growth-stage startup',
  },
  {
    icon: 'ti-eye-off',
    quote: "We had no idea where candidates were dropping off. Was it the job description? The process? We were flying blind.",
    role: 'Recruiter, agency',
  },
]

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
            <div
              key={i}
              className={`${styles.card} reveal`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className={styles.iconWrap}>
                <i className={`ti ${p.icon}`} />
              </div>
              <p className={styles.quote}>"{p.quote}"</p>
              <div className={styles.role}>{p.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}