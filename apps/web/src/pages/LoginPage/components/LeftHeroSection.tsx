import { Link } from 'react-router-dom'
import FloatingCards from './FloatingCards'
import styles from './LeftHeroSection.module.css'

type Props = {
  mode: 'login' | 'register'
}

export default function LeftHeroSection({ mode }: Props) {
  return (
    <div className={styles.left}>
      <Link to="/" className={styles.logo}>RecruitApex</Link>

      <div key={`title-${mode}`} className={styles.leftTitleEnter}>
        <div className={styles.title}>
          {mode === 'login' ? (
            <>Welcome<br />back.</>
          ) : (
            <>Start hiring<br /><span className={styles.titleGrad}>smarter.</span></>
          )}
        </div>
        <p className={styles.sub}>
          {mode === 'login'
            ? 'Your pipeline is waiting. Candidates to review, interviews to schedule.'
            : 'Set up your recruitment pipeline in 15 minutes. No ops person needed.'}
        </p>
      </div>

      <FloatingCards />
    </div>
  )
}
