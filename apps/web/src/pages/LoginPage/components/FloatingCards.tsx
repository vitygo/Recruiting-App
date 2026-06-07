import { FLOAT_CARDS } from '../utils/constants'
import styles from './FloatingCards.module.css'

export default function FloatingCards() {
  return (
    <div className={styles.floatingCards}>
      {FLOAT_CARDS.map((card, i) => (
        <div
          key={i}
          className={styles.floatCard}
          style={{
            top: card.top,
            left: card.left,
            opacity: card.opacity,
            transform: `scale(${card.scale})`,
            animation: `floatCard ${5.5 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${card.delay}s`,
          }}
        >
          <div className={styles.floatAvatar} style={{ background: card.color }}>
            {card.initials}
          </div>
          <div>
            <div className={styles.floatName}>{card.name}</div>
            <div className={styles.floatRole}>{card.role}</div>
          </div>
          <div className={styles.floatScore}>{card.score}%</div>
        </div>
      ))}
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0) rotate(-1deg) scale(var(--scale, 1)); }
          33% { transform: translateY(-12px) rotate(0.5deg) scale(var(--scale, 1)); }
          66% { transform: translateY(6px) rotate(-0.5deg) scale(var(--scale, 1)); }
        }
      `}</style>
    </div>
  )
}
