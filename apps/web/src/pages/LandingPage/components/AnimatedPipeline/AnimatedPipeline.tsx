import { useEffect, useState } from 'react'
import styles from './AnimatedPipeline.module.css'
import { PIPELINE_STAGES, PIPELINE_STAGE_COLORS, PIPELINE_INITIAL_CARDS } from '../../constants'

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
  const [cards, setCards] = useState<Card[]>(PIPELINE_INITIAL_CARDS)

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) => {
        const movable = prev.filter((c) => c.stage < 3 && !c.moving)
        if (movable.length === 0) return PIPELINE_INITIAL_CARDS

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
      {PIPELINE_STAGES.map((stage, si) => (
        <div key={stage} className={styles.column}>
          <div className={styles.columnHeader}>
            <div className={styles.columnDot} style={{ background: PIPELINE_STAGE_COLORS[si] }} />
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
