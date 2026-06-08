import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useThemeStore } from '../../store/themeStore'
import { useOrgStore } from '../../store/orgStore'
import { useRipple } from '../../hooks/useRipple'
import { AssistantBubble } from '../AssistantBubble'
import { UserDropdown } from './UserDropdown'
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
  const { theme, toggle } = useThemeStore()
  const companyName = useOrgStore((s) => s.companyName)
  const createRipple = useRipple()

  return (
    <div className={styles.root}>
    <div className={styles.sidebarWrap}>
  <div className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
    <NavLink
      to="/dashboard"
      className={`${styles.logo} ${collapsed ? styles.logoCollapsed : ''}`}
    >
      <span className={`${styles.logoText} ${collapsed ? styles.logoTextHidden : ''}`}>
        {companyName}
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

    <UserDropdown placement="sidebar" sidebarCollapsed={collapsed} />
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
            {companyName}
          </div>

          {/* <div className={styles.topbarSearch}>
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
          </div> */}

          <div className={styles.topbarActions}>
            <button className={styles.iconBtn} onClick={createRipple}>
              <i className="ti ti-bell" />
            </button>
            <button className={styles.iconBtn} onClick={(e) => { createRipple(e); toggle() }}>
              <i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'}`} />
            </button>
            <UserDropdown />
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

      <AssistantBubble />
    </div>
  )
}