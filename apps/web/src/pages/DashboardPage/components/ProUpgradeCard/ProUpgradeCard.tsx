import { ArrowRight } from '@phosphor-icons/react/ArrowRight'
import styles from './ProUpgradeCard.module.css'

export function ProUpgradeCard() {
  return (
    <div className={styles.premiumCard}>
      <h5>Unlock AI Sourcing</h5>
      <p>Get access to AI candidate scoring, smart scheduling and advanced pipeline analytics.</p>
      <button className={styles.premiumBtn}>
        Upgrade to Pro <ArrowRight size={16} weight="fill" style={{ marginLeft: '6px' }} />
      </button>
    </div>
  )
}
