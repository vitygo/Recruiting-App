import { useEffect, useState } from 'react'
import styles from './AnimatedPipeline.module.css'

const STAGES = ['Applied', 'Screening', 'Interview', 'Offer']

const INITIAL_CARDS = [
  { id: 1, initials: 'AJ', name: 'Alex Johnson', role: 'Senior Engineer', score: 92, color: '#6a4cf5', stage: 0 },
  { id: 2, initials: 'MK', name: 'Maria Kim', role: 'Product Designer', score: 87, color: '#d44df0', stage: 0 },
  { id: 3, initials: 'RS', name: 'Ryan Smith', role: 'Frontend Dev', score: 78, color: '#0099ff', stage: 1 },
  { id: 4, initials: 'PL', name: 'Priya Lal', role: 'Data Scientist', score: 94, color: '#22c55e', stage: 1 },
  { id: 5, initials: 'TW', name: 'Tom Walker', role: 'Backend Dev', score: 81, color: '#ff7a3d', stage: 2 },
  { id: 6, initials: 'SC', name: 'Sarah Chen', role: 'UX Researcher', score: 89, color: '#f472b6', stage: 3 },
]

const STAGE_COLORS = [
  'var(--c-ink-muted)',
  'var(--c-accent)',
  'var(--c-violet)',
  'var(--c-success)',
]

interface Card {
  id: number
  initials: string
  name: string
  role: string
  score: number
  color: string
  stage: number
  moving?: boolean
}

export function AnimatedPipeline() {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS)

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) => {
        const movable = prev.filter((c) => c.stage < 3 && !c.moving)
        if (movable.length === 0) return INITIAL_CARDS

        const pick = movable[Math.floor(Math.random() * movable.length)]

        return prev.map((c) =>
          c.id === pick.id
            ? { ...c, moving: true }
            : c
        )
      })

      setTimeout(() => {
        setCards((prev) => {
          return prev.map((c) =>
            c.moving ? { ...c, stage: Math.min(c.stage + 1, 3), moving: false } : c
          )
        })
      }, 500)
    }, 2200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.pipeline}>
      {STAGES.map((stage, si) => (
        <div key={stage} className={styles.column}>
          <div className={styles.columnHeader}>
            <div className={styles.columnDot} style={{ background: STAGE_COLORS[si] }} />
            <span className={styles.columnLabel}>{stage}</span>
            <span className={styles.columnCount}>
              {cards.filter((c) => c.stage === si).length}
            </span>
          </div>

          <div className={styles.cards}>
            {cards
              .filter((c) => c.stage === si)
              .map((card) => (
                <div
                  key={card.id}
                  className={`${styles.card} ${card.moving ? styles.cardMoving : ''}`}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.avatar} style={{ background: card.color }}>
                      {card.initials}
                    </div>
                    <div>
                      <div className={styles.cardName}>{card.name}</div>
                      <div className={styles.cardRole}>{card.role}</div>
                    </div>
                  </div>
                  <div className={styles.cardBottom}>
                    <span className={styles.scoreLabel}>AI Score</span>
                    <span
                      className={styles.scoreValue}
                      style={{ color: card.score > 85 ? 'var(--c-success)' : 'var(--c-ink)' }}
                    >
                      {card.score}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}