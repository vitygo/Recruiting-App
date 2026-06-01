import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { useRipple } from '../../hooks/useRipple'
import styles from './AppLayout.module.css'

const NAV_ITEMS = [
  { to: '/dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { to: '/pipeline', icon: 'ti-layout-kanban', label: 'Pipeline', badge: '14' },
  { to: '/candidates', icon: 'ti-users', label: 'Candidates' },
  { to: '/jobs', icon: 'ti-briefcase', label: 'Jobs' },
  { to: '/interviews', icon: 'ti-calendar', label: 'Interviews', badge: '3' },
]

const SETTINGS_ITEMS = [
  { to: '/settings', icon: 'ti-settings', label: 'Settings' },
]

export function AppLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const createRipple = useRipple()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <div className={styles.root}>
      <div className={styles.sidebarWrap}>
        <div className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
          <NavLink to="/" className={styles.logo}>
            <div className={styles.logoDot} />
            <span className={styles.logoText}>RecruitApex</span>
          </NavLink>

          <div className={styles.navSection}>Main</div>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <i className={`ti ${item.icon} ${styles.navIcon}`} />
              <span className={styles.navLabel}>{item.label}</span>
              {item.badge && (
                <span className={styles.navBadge}>{item.badge}</span>
              )}
              {collapsed && (
                <span className={styles.tooltip}>{item.label}</span>
              )}
            </NavLink>
          ))}

          <div className={styles.navSection}>Settings</div>
          {SETTINGS_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <i className={`ti ${item.icon} ${styles.navIcon}`} />
              <span className={styles.navLabel}>{item.label}</span>
              {collapsed && (
                <span className={styles.tooltip}>{item.label}</span>
              )}
            </NavLink>
          ))}

          <div className={styles.spacer} />

          <div className={styles.userArea} onClick={handleLogout}>
            <div className={styles.userAvatar}>{initials}</div>
            <div>
              <div className={styles.userName}>{user?.name || 'User'}</div>
              <div className={styles.userRole}>{user?.role || 'Recruiter'}</div>
            </div>
          </div>
        </div>

        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
        >
          <i className={`ti ${collapsed ? 'ti-chevron-right' : 'ti-chevron-left'}`} />
        </button>
      </div>

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.topbarTitle}>{title}</div>

          <div className={styles.topbarSearch}>
            <i className="ti ti-search" style={{ fontSize: '0.875rem' }} />
            Search candidates, jobs...
          </div>

          <div className={styles.topbarActions}>
            <button className={styles.iconBtn} onClick={createRipple}>
              <i className="ti ti-bell" />
            </button>
            <button className={styles.iconBtn} onClick={(e) => { createRipple(e); toggle() }}>
              <i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'}`} />
            </button>
            <div className={styles.avatarBtn}>{initials}</div>
          </div>
        </div>

        <div className={styles.page}>
          {children}
        </div>
      </div>
    </div>
  )
}