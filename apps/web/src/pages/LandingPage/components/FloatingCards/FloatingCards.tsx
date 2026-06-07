import styles from './FloatingCards.module.css'
import { FLOATING_CARDS } from '../../constants'

export function FloatingCards() {
  return (
    <div className={styles.wrapper}>
      {FLOATING_CARDS.map((card, i) => (
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
