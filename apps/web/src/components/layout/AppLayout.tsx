import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { useRipple } from '../../hooks/useRipple'
import styles from './AppLayout.module.css'


import { SquaresFour } from "@phosphor-icons/react/SquaresFour"
import { Kanban } from "@phosphor-icons/react/Kanban"
import { Users } from "@phosphor-icons/react/Users"
import { Briefcase } from "@phosphor-icons/react/Briefcase"
import { CalendarBlank } from "@phosphor-icons/react/CalendarBlank"
import { CaretLeft } from "@phosphor-icons/react/CaretLeft"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { Gear } from "@phosphor-icons/react/Gear"

const NAV_ITEMS = [
  { to: '/dashboard', icon: SquaresFour, label: 'Dashboard' },
  { to: '/pipeline', icon: Kanban, label: 'Pipeline', badge: '14' },
  { to: '/candidates', icon: Users, label: 'Candidates' },
  { to: '/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/interviews', icon: CalendarBlank, label: 'Interviews', badge: '3' },
]


const SETTINGS_ITEMS = [
  { to: '/settings', icon: Gear, label: 'Settings' },
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
    <NavLink
      to="/dashboard"
      className={`${styles.logo} ${collapsed ? styles.logoCollapsed : ''}`}
    >
      <span className={`${styles.logoText} ${collapsed ? styles.logoTextHidden : ''}`}>
        RecruitApex
      </span>
    </NavLink>

    <div className={`${styles.navSection} ${collapsed ? styles.navSectionHidden : ''}`}>
      Main
    </div>

    {NAV_ITEMS.map((item) => {
      const IconComponent = item.icon
      return (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `${styles.navItem} ${collapsed ? styles.navItemCollapsed : ''} ${isActive ? styles.navItemActive : ''}`
          }
        >
          <IconComponent size={18} weight="fill" className={styles.navIcon} />
          <span className={`${styles.navLabel} ${collapsed ? styles.navLabelHidden : ''}`}>
            {item.label}
          </span>
          {item.badge && (
            <span className={`${styles.navBadge} ${collapsed ? styles.navBadgeHidden : ''}`}>
              {item.badge}
            </span>
          )}
          {collapsed && <span className={styles.tooltip}>{item.label}</span>}
        </NavLink>
      )
    })}

    <div className={`${styles.navSection} ${collapsed ? styles.navSectionHidden : ''}`}>
      Settings
    </div>

    {SETTINGS_ITEMS.map((item) => {
      const IconComponent = item.icon
      return (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `${styles.navItem} ${collapsed ? styles.navItemCollapsed : ''} ${isActive ? styles.navItemActive : ''}`
          }
        >
          <IconComponent size={18} weight="fill" className={styles.navIcon} />
          <span className={`${styles.navLabel} ${collapsed ? styles.navLabelHidden : ''}`}>
            {item.label}
          </span>
          {collapsed && <span className={styles.tooltip}>{item.label}</span>}
        </NavLink>
      )
    })}

    <div className={styles.spacer} />

    <div
      className={`${styles.userArea} ${collapsed ? styles.userAreaCollapsed : ''}`}
      onClick={handleLogout}
    >
      <div className={styles.avatarBtn }>{initials}</div>
      <div className={`${collapsed ? styles.userInfoHidden : ''}`}>
        <div className={styles.userName}>{user?.name || 'User'}</div>
        <div className={styles.userRole}>{user?.role || 'Recruiter'}</div>
      </div>
    </div>
  </div>

  <button
    className={styles.collapseBtn}
    onClick={() => setCollapsed(!collapsed)}
  >
    {collapsed ? <CaretRight size={12} weight="bold" /> : <CaretLeft size={12} weight="bold" />}
  </button>
</div>

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div className={`${styles.topbarLogo} ${collapsed ? styles.topbarLogoVisible : ''}`}>
            RecruitApex
          </div>

          <div className={styles.topbarSearch}>
            <i className="ti ti-search" style={{ fontSize: '0.875rem', flexShrink: 0 }} />
            <input
              placeholder="Search..."
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--c-ink)',
                fontSize: '0.8125rem',
                width: '100%',
                fontFamily: 'var(--f-body)',
              }}
            />
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

      <nav className={styles.mobileNav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ''}`
            }
          >
            <item.icon size="20px" weight="fill"></item.icon>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}