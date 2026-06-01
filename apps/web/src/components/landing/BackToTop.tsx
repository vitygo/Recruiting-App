import { useEffect, useState } from 'react'
import { useRipple } from '../../hooks/useRipple'
import styles from './BackToTop.module.css'

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const createRipple = useRipple()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      className={`${styles.button} ${visible ? styles.visible : ''}`}
      onClick={(e) => {
        createRipple(e)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      aria-label="Back to top"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 12V4M4 8l4-4 4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}