import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useThemeStore } from '../../store/themeStore'
import { useRipple } from '../../hooks/useRipple'
import styles from './LandingNav.module.css'
import { useScrambleText } from '../../hooks/useScrambleText'

export function LandingNav() {
  const { theme, toggle } = useThemeStore()
  const createRipple = useRipple()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const scrambleRef = useScrambleText('RecruitApex')

  useEffect(() => {
    const sections = ['features', 'pricing', 'faq']

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: '-56px 0px 0px 0px' }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <nav className={styles.nav}>
      <Link to="/" className={styles.logo} onClick={(e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }}>
          <span ref={scrambleRef as React.RefObject<HTMLSpanElement>} className={styles.logoText}>
            RecruitApex
          </span>
        </Link>

        <div className={styles.links}>
          {['features', 'pricing', 'faq'].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`${styles.link} ${activeSection === id ? styles.linkActive : ''}`}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>

        <div className={styles.actions}>
         

          <Link to="/login" className={styles.signIn}>
            Sign in
          </Link>

          <Link
            to="/register"
            className="btn btn-primary"
            onClick={createRipple}
            style={{ padding: '8px 16px', minHeight: 36, fontSize: 14 }}
          >
            Get started
          </Link>
          <button className={styles.themeBtn} onClick={toggle}>
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 1v1M8 14v1M1 8h1M14 8h1M3.05 3.05l.7.7M12.25 12.25l.7.7M12.95 3.05l-.7.7M3.75 12.25l-.7.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 9.5A5.5 5.5 0 016.5 2.5a5.5 5.5 0 100 11 5.5 5.5 0 007-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {menuOpen ? (
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        {['features', 'pricing', 'faq'].map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className={`${styles.mobileLink} ${activeSection === id ? styles.mobileLinkActive : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
        <div className={styles.mobileTheme}>
          <span>Theme</span>
          <button className={styles.themeBtn} onClick={toggle}>
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 1v1M8 14v1M1 8h1M14 8h1M3.05 3.05l.7.7M12.25 12.25l.7.7M12.95 3.05l-.7.7M3.75 12.25l-.7.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 9.5A5.5 5.5 0 016.5 2.5a5.5 5.5 0 100 11 5.5 5.5 0 007-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
        <div className={styles.mobileActions}>
          <Link
            to="/login"
            className="btn btn-secondary"
            style={{ flex: 1, fontSize: 14, minHeight: 40 }}
            onClick={() => setMenuOpen(false)}
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="btn btn-primary"
            style={{ flex: 1, fontSize: 14, minHeight: 40 }}
            onClick={(e) => { createRipple(e); setMenuOpen(false) }}
          >
            Get started
          </Link>
        </div>
      </div>
    </>
  )
}