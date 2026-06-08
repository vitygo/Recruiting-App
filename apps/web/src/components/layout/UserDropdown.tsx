import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useUser } from '../../hooks/useUser'
import { User } from "@phosphor-icons/react/User"
import { Gear } from "@phosphor-icons/react/Gear"
import { Question } from "@phosphor-icons/react/Question"
import { SignOut } from "@phosphor-icons/react/SignOut"
import styles from './UserDropdown.module.css'

interface Props {
  placement?: 'topbar' | 'sidebar'
  sidebarCollapsed?: boolean
}

export function UserDropdown({ placement = 'topbar', sidebarCollapsed = false }: Props) {
  const [open, setOpen] = useState(false)
  const [fixedPos, setFixedPos] = useState<{ left: number; bottom: number } | null>(null)
  const { logout } = useAuthStore()
  const demoUser = useUser()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const isSidebar = placement === 'sidebar'

  const initials = demoUser.name
    ? demoUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleTrigger = () => {
    if (isSidebar && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setFixedPos({
        left: rect.right + 8,
        bottom: window.innerHeight - rect.bottom,
      })
    }
    setOpen((v) => !v)
  }

  const handleLogout = async () => {
    setOpen(false)
    localStorage.clear()
    await logout()
    navigate('/login')
  }

  const avatarInner = demoUser.avatarDataUrl
    ? <img src={demoUser.avatarDataUrl} alt="avatar" className={styles.avatarImg} />
    : initials

  const dropdownContent = (
    <>
      <div className={styles.header}>
        <span className={isSidebar ? styles.sidebarHeaderAvatar : styles.headerAvatar}>
          {avatarInner}
        </span>
        <div className={styles.headerInfo}>
          <span className={styles.headerName}>{demoUser.name || 'User'}</span>
          <span className={styles.headerEmail}>
            {isSidebar ? (demoUser.position || demoUser.email) : (demoUser.email || '')}
          </span>
        </div>
      </div>

      <div className={styles.divider} />

      <Link to="/settings" className={styles.item} onClick={() => setOpen(false)} role="menuitem">
        <User size={15} weight="fill" className={styles.itemIcon} />
        My Profile
      </Link>
      <Link to="/settings" className={styles.item} onClick={() => setOpen(false)} role="menuitem">
        <Gear size={15} weight="fill" className={styles.itemIcon} />
        Settings
      </Link>
      <button className={styles.item} onClick={() => setOpen(false)} role="menuitem">
        <Question size={15} weight="fill" className={styles.itemIcon} />
        Help & Support
      </button>

      <div className={styles.divider} />

      <button className={`${styles.item} ${styles.itemLogout}`} onClick={handleLogout} role="menuitem">
        <SignOut size={15} weight="fill" className={styles.itemIcon} />
        Log out
      </button>
    </>
  )

  if (isSidebar) {
    return (
      <div className={styles.sidebarWrap} ref={ref}>
        <button
          ref={triggerRef}
          className={[
            styles.sidebarTrigger,
            sidebarCollapsed ? styles.sidebarTriggerCollapsed : '',
            open ? styles.sidebarTriggerActive : '',
          ].join(' ')}
          onClick={handleTrigger}
          aria-label="User menu"
          aria-expanded={open}
        >
          <span className={styles.sidebarAvatar}>{avatarInner}</span>
          {!sidebarCollapsed && (
            <div className={styles.sidebarUserInfo}>
              <span className={styles.sidebarUserName}>{demoUser.name || 'User'}</span>
              <span className={styles.sidebarUserRole}>{demoUser.position || 'Recruiter'}</span>
            </div>
          )}
        </button>

        <div
          className={`${styles.dropdown} ${styles.dropdownSidebar} ${open ? styles.dropdownOpen : ''}`}
          style={
            fixedPos
              ? { left: fixedPos.left, bottom: fixedPos.bottom, top: 'auto', right: 'auto' }
              : undefined
          }
          role="menu"
        >
          {dropdownContent}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={`${styles.trigger} ${open ? styles.triggerActive : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
        aria-expanded={open}
      >
        <span className={styles.avatar}>{avatarInner}</span>
      </button>

      <div className={`${styles.dropdown} ${open ? styles.dropdownOpen : ''}`} role="menu">
        {dropdownContent}
      </div>
    </div>
  )
}
