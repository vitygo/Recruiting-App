import { Link } from 'react-router-dom'
import styles from './LandingFooter.module.css'
import { FOOTER_LINKS } from '../../constants'

export function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoText}>RecruitApex</span>
            </Link>

            <p className={styles.brandDesc}>
              The ATS recruiters actually want to use. Minimal clicks, maximum results.
            </p>

            <div className={styles.socials}>
              <a href="#" className={styles.socialBtn} aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 3L9 7.5L13.5 13H10.5L8 9.5L5 13H2L6.5 8L2 3H5L7.5 6.5L10.5 3H13Z" fill="currentColor" />
                </svg>
              </a>
              <a href="#" className={styles.socialBtn} aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="4" height="4" rx="1" fill="currentColor" />
                  <rect x="2" y="8" width="4" height="6" fill="currentColor" />
                  <path d="M8 8h2.5S14 8 14 11.5V14h-4v-2.5S10 10 9 10H8V8z" fill="currentColor" />
                </svg>
              </a>
              <a href="#" className={styles.socialBtn} aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5a6.5 6.5 0 00-2.055 12.67c.325.06.444-.141.444-.313v-1.095c-1.803.392-2.183-.87-2.183-.87-.295-.75-.72-.95-.72-.95-.588-.402.044-.394.044-.394.65.046.992.668.992.668.578.99 1.516.704 1.886.538.058-.418.226-.704.411-.865-1.44-.164-2.952-.72-2.952-3.204 0-.707.253-1.286.667-1.739-.067-.164-.289-.823.063-1.715 0 0 .543-.174 1.779.663A6.2 6.2 0 018 5.88a6.2 6.2 0 011.621.218c1.235-.837 1.778-.663 1.778-.663.353.892.13 1.551.064 1.715.416.453.666 1.032.666 1.739 0 2.49-1.515 3.038-2.959 3.199.233.2.44.598.44 1.205v1.785c0 .174.117.376.448.312A6.5 6.5 0 008 1.5z" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className={styles.col}>
              <p className={styles.colTitle}>{title}</p>
              <div className={styles.colLinks}>
                {links.map((link) => (
                  <a key={link.label} href={link.href} className={styles.colLink}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} RecruitApex. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink}>Privacy</a>
            <a href="#" className={styles.bottomLink}>Terms</a>
            <a href="#" className={styles.bottomLink}>Security</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
