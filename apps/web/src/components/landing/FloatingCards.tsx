import styles from './FloatingCards.module.css'

const CARDS = [
  { initials: 'AJ', name: 'Alex Johnson', role: 'Senior Engineer', score: 92, color: '#6a4cf5', top: '12%', left: '4%', delay: 0, scale: 1, opacity: 0.9 },
  { initials: 'MK', name: 'Maria Kim', role: 'Product Designer', score: 87, color: '#d44df0', top: '68%', left: '2%', delay: 1.5, scale: 0.85, opacity: 0.5 },
  { initials: 'RS', name: 'Ryan Smith', role: 'Frontend Dev', score: 78, color: '#0099ff', top: '38%', left: '76%', delay: 0.8, scale: 0.9, opacity: 0.7 },
  { initials: 'PL', name: 'Priya Lal', role: 'Data Scientist', score: 94, color: '#22c55e', top: '15%', left: '80%', delay: 2.1, scale: 1, opacity: 0.85 },
  { initials: 'TW', name: 'Tom Walker', role: 'Backend Dev', score: 81, color: '#ff7a3d', top: '78%', left: '73%', delay: 0.4, scale: 0.75, opacity: 0.4 },
  { initials: 'SC', name: 'Sarah Chen', role: 'UX Researcher', score: 89, color: '#f472b6', top: '52%', left: '86%', delay: 1.8, scale: 0.8, opacity: 0.55 },
  { initials: 'DK', name: 'David Kim', role: 'iOS Engineer', score: 83, color: '#6a4cf5', top: '85%', left: '20%', delay: 1.2, scale: 0.7, opacity: 0.35 },
  { initials: 'NP', name: 'Nina Patel', role: 'ML Engineer', score: 96, color: '#0099ff', top: '8%', left: '30%', delay: 2.8, scale: 0.75, opacity: 0.4 },
  { initials: 'JL', name: 'James Lee', role: 'DevOps', score: 76, color: '#ff7a3d', top: '30%', left: '88%', delay: 3.2, scale: 0.65, opacity: 0.3 },
  { initials: 'AR', name: 'Anna Reed', role: 'QA Engineer', score: 85, color: '#22c55e', top: '60%', left: '0%', delay: 0.6, scale: 0.8, opacity: 0.45 },
  { initials: 'MB', name: 'Mike Brown', role: 'Tech Lead', score: 91, color: '#d44df0', top: '95%', left: '50%', delay: 1.9, scale: 0.7, opacity: 0.3 },
  { initials: 'LW', name: 'Lisa Wang', role: 'Product Manager', score: 88, color: '#f472b6', top: '5%', left: '60%', delay: 2.5, scale: 0.65, opacity: 0.35 },
]

export function FloatingCards() {
  return (
    <div className={styles.wrapper}>
      {CARDS.map((card, i) => (
        <div
          key={i}
          className={styles.card}
          style={{
            top: card.top,
            left: card.left,
            animationDelay: `${card.delay}s`,
            animationDuration: `${5.5 + i * 0.4}s`,
            transform: `scale(${card.scale})`,
            opacity: card.opacity,
          }}
        >
          <div className={styles.cardInner}>
            <div className={styles.avatar} style={{ background: card.color }}>
              {card.initials}
            </div>
            <div className={styles.info}>
              <div className={styles.name}>{card.name}</div>
              <div className={styles.role}>{card.role}</div>
            </div>
            <div
              className={styles.score}
              style={{ color: card.score > 88 ? 'var(--c-success)' : 'var(--c-ink-muted)' }}
            >
              {card.score}%
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}