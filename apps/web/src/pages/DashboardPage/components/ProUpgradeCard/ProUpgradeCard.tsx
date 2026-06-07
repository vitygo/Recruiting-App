import { ArrowRight } from '@phosphor-icons/react/ArrowRight'
import { useNavigate } from 'react-router-dom'
import styles from './ProUpgradeCard.module.css'

export function ProUpgradeCard() {
  const navigate = useNavigate()
  return (
    <div className={styles.premiumCard}>
      <h5>Recruitment Health Check</h5>
      <p>Your average Time-to-Hire this month is 14 days — 25% faster than the industry average. 'Senior React Developer' has the highest conversion rate from Technical Interview to Offer.</p>
      <button className={styles.premiumBtn} onClick={() => navigate('/')}>
        View Detailed Reports <ArrowRight size={16} weight="fill" style={{ marginLeft: '6px' }} />
      </button>
    </div>
  )
}
