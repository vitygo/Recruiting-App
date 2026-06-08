import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'
import { loadDemoUser, saveDemoUser, type DemoUser } from '../../lib/demoStorage'
import { useOrgStore } from '../../store/orgStore'
import { useThemeStore } from '../../store/themeStore'

import { User } from "@phosphor-icons/react/User"
import { Lock } from "@phosphor-icons/react/Lock"
import { PaintBrush } from "@phosphor-icons/react/PaintBrush"
import { Buildings } from "@phosphor-icons/react/Buildings"
import { Warning } from "@phosphor-icons/react/Warning"
import { Camera } from "@phosphor-icons/react/Camera"
import { CheckCircle } from "@phosphor-icons/react/CheckCircle"
import { Sun } from "@phosphor-icons/react/Sun"
import { Moon } from "@phosphor-icons/react/Moon"

import styles from './SettingsPage.module.css'

type Tab = 'profile' | 'security' | 'appearance' | 'organization' | 'danger'

const TABS: { id: Tab; label: string; icon: React.ElementType; danger?: boolean }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: PaintBrush },
  { id: 'organization', label: 'Organization', icon: Buildings },
  { id: 'danger', label: 'Danger Zone', icon: Warning, danger: true },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'
}

function ProfileTab() {
  const stored = loadDemoUser()
  const [form, setForm] = useState<DemoUser>(stored)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleChange = (field: keyof DemoUser) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setSaved(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setForm((prev) => ({ ...prev, avatarDataUrl: dataUrl }))
      setSaved(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    saveDemoUser(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    setForm(stored)
    setSaved(false)
  }

  const avatarInitials = initials(form.name)

  return (
    <div className={styles.content}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Profile Information</h2>
          <p className={styles.cardSubtitle}>Update your personal details and public profile.</p>
        </div>

        <div className={styles.avatarRow}>
          <div className={styles.avatarWrap} onClick={() => fileRef.current?.click()}>
            <div className={styles.avatar}>
              {form.avatarDataUrl
                ? <img src={form.avatarDataUrl} alt="avatar" className={styles.avatarImg} />
                : avatarInitials}
            </div>
            <div className={styles.avatarOverlay}>
              <Camera size={22} weight="bold" />
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className={styles.avatarInput}
              onChange={handleAvatarChange}
            />
          </div>
          <div className={styles.avatarMeta}>
            <p className={styles.avatarLabel}>Profile Photo</p>
            <p className={styles.avatarHint}>JPG, PNG or GIF · Max 2 MB</p>
            <button className={styles.avatarBtn} onClick={() => fileRef.current?.click()}>
              Change photo
            </button>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              className={styles.input}
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="Your full name"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Position / Title</label>
            <input
              className={styles.input}
              type="text"
              value={form.position}
              onChange={handleChange('position')}
              placeholder="e.g. Senior Recruiter"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              className={styles.input}
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="you@company.com"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <label className={styles.label}>Bio</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={form.bio}
              onChange={handleChange('bio')}
              placeholder="A short bio visible to your team..."
            />
          </div>
        </div>

        <div className={styles.formFooter}>
          {saved && (
            <div className={`${styles.toast} ${styles.toastSuccess}`}>
              <CheckCircle size={15} weight="fill" />
              Changes saved
            </div>
          )}
          <button className={styles.btnSecondary} onClick={handleReset}>
            Discard
          </button>
          <button className={styles.btnPrimary} onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}

function SecurityTab() {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setError('')
    setSaved(false)
  }

  const handleSubmit = () => {
    if (!form.current) { setError('Please enter your current password.'); return }
    if (form.next.length < 8) { setError('New password must be at least 8 characters.'); return }
    if (form.next !== form.confirm) { setError('New passwords do not match.'); return }
    setForm({ current: '', next: '', confirm: '' })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className={styles.content}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Change Password</h2>
          <p className={styles.cardSubtitle}>Update your password to keep your account secure.</p>
        </div>

        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <label className={styles.label}>Current Password</label>
            <input
              className={styles.input}
              type="password"
              value={form.current}
              onChange={handleChange('current')}
              placeholder="Enter your current password"
              autoComplete="current-password"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>New Password</label>
            <input
              className={styles.input}
              type="password"
              value={form.next}
              onChange={handleChange('next')}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm New Password</label>
            <input
              className={styles.input}
              type="password"
              value={form.confirm}
              onChange={handleChange('confirm')}
              placeholder="Repeat new password"
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className={styles.formFooter}>
          {error && (
            <div className={`${styles.toast} ${styles.toastError}`}>
              {error}
            </div>
          )}
          {saved && (
            <div className={`${styles.toast} ${styles.toastSuccess}`}>
              <CheckCircle size={15} weight="fill" />
              Password updated
            </div>
          )}
          <button className={styles.btnPrimary} onClick={handleSubmit}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  )
}

function OrganizationTab() {
  const { companyName, setCompanyName } = useOrgStore()
  const [draft, setDraft] = useState(companyName)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    setCompanyName(trimmed)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDiscard = () => {
    setDraft(companyName)
    setSaved(false)
  }

  return (
    <div className={styles.content}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Organization</h2>
          <p className={styles.cardSubtitle}>Manage your workspace branding and company details.</p>
        </div>

        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <label className={styles.label}>Company Name</label>
            <input
              className={styles.input}
              type="text"
              value={draft}
              onChange={(e) => { setDraft(e.target.value); setSaved(false) }}
              placeholder="Your company name"
            />
            <p className={styles.fieldHint}>This name appears in the sidebar and topbar across the entire application.</p>
          </div>
        </div>

        <div className={styles.formFooter}>
          {saved && (
            <div className={`${styles.toast} ${styles.toastSuccess}`}>
              <CheckCircle size={15} weight="fill" />
              Branding updated
            </div>
          )}
          <button className={styles.btnSecondary} onClick={handleDiscard}>
            Discard
          </button>
          <button className={styles.btnPrimary} onClick={handleSave} disabled={!draft.trim()}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}

function AppearanceTab() {
  const { theme, setTheme } = useThemeStore()

  return (
    <div className={styles.content}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Appearance</h2>
          <p className={styles.cardSubtitle}>Choose how RecruitApex looks for you.</p>
        </div>

        <div className={styles.themeGrid}>
          <button
            className={`${styles.themeOption} ${theme === 'light' ? styles.themeOptionActive : ''}`}
            onClick={() => setTheme('light')}
          >
            <div className={styles.themePreview} data-preview="light">
              <div className={styles.themePreviewSidebar} />
              <div className={styles.themePreviewContent}>
                <div className={styles.themePreviewBar} />
                <div className={styles.themePreviewRow} />
                <div className={styles.themePreviewRow} />
              </div>
            </div>
            <div className={styles.themeLabel}>
              <Sun size={15} weight="fill" />
              Light Mode
            </div>
            {theme === 'light' && <div className={styles.themeCheck}><CheckCircle size={16} weight="fill" /></div>}
          </button>

          <button
            className={`${styles.themeOption} ${theme === 'dark' ? styles.themeOptionActive : ''}`}
            onClick={() => setTheme('dark')}
          >
            <div className={styles.themePreview} data-preview="dark">
              <div className={styles.themePreviewSidebar} style={{ background: '#1a1a2e' }} />
              <div className={styles.themePreviewContent} style={{ background: '#0f0f1a' }}>
                <div className={styles.themePreviewBar} style={{ background: '#1a1a2e' }} />
                <div className={styles.themePreviewRow} style={{ background: '#2a2a3e' }} />
                <div className={styles.themePreviewRow} style={{ background: '#2a2a3e' }} />
              </div>
            </div>
            <div className={styles.themeLabel}>
              <Moon size={15} weight="fill" />
              Dark Mode
            </div>
            {theme === 'dark' && <div className={styles.themeCheck}><CheckCircle size={16} weight="fill" /></div>}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const [typed, setTyped] = useState('')
  const CONFIRM_WORD = 'DELETE'

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalDangerIcon}>
          <Warning size={28} weight="fill" />
        </div>
        <h3 className={styles.modalTitle}>Delete Account</h3>
        <p className={styles.modalDesc}>
          This will permanently erase all your data — pipeline, jobs, candidates, and profile.
          This action <strong>cannot be undone</strong>.
        </p>
        <p className={styles.modalPrompt}>
          Type <strong>{CONFIRM_WORD}</strong> to confirm:
        </p>
        <input
          className={`${styles.input} ${styles.modalInput}`}
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value.toUpperCase())}
          placeholder={CONFIRM_WORD}
          autoFocus
        />
        <div className={styles.modalActions}>
          <button className={styles.btnSecondary} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={styles.btnDangerSolid}
            disabled={typed !== CONFIRM_WORD}
            onClick={onConfirm}
          >
            Delete my account
          </button>
        </div>
      </div>
    </div>
  )
}

function DangerTab() {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteAccount = () => {
    localStorage.clear()
    navigate('/register')
  }

  return (
    <div className={styles.content}>
      {showDeleteModal && (
        <DeleteConfirmModal
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <div className={`${styles.card} ${styles.dangerCard}`}>
        <div className={`${styles.cardHeader} ${styles.dangerCardHeader}`}>
          <div className={styles.dangerCardTitleRow}>
            <Warning size={20} weight="fill" className={styles.dangerCardIcon} />
            <h2 className={`${styles.cardTitle} ${styles.dangerCardTitle}`}>Danger Zone</h2>
          </div>
          <p className={styles.cardSubtitle}>These actions are irreversible. Proceed with caution.</p>
        </div>

        <div className={styles.dangerItem}>
          <div>
            <p className={styles.dangerLabel}>Reset demo data</p>
            <p className={styles.dangerDesc}>Clears all pipeline, job, and candidate data from localStorage and reverts to seed data.</p>
          </div>
          <button
            className={styles.btnDanger}
            onClick={() => {
              localStorage.removeItem('recruit_demo_pipeline')
              localStorage.removeItem('recruit_demo_jobs')
              window.location.reload()
            }}
          >
            Reset data
          </button>
        </div>

        <div className={styles.dangerItem}>
          <div>
            <p className={styles.dangerLabel}>Delete account</p>
            <p className={styles.dangerDesc}>Permanently remove your account and all associated data. This cannot be undone.</p>
          </div>
          <button className={styles.btnDanger} onClick={() => setShowDeleteModal(true)}>
            Delete account
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':      return <ProfileTab />
      case 'security':     return <SecurityTab />
      case 'appearance':   return <AppearanceTab />
      case 'organization': return <OrganizationTab />
      case 'danger':       return <DangerTab />
    }
  }

  return (
    <AppLayout title="Settings">
      <div className={styles.page}>
        <nav className={styles.nav}>
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isDanger = tab.danger
            const isActive = activeTab === tab.id
            return (
              <>
                {isDanger && <div key={`div-${tab.id}`} className={styles.navDivider} />}
                <button
                  key={tab.id}
                  className={[
                    styles.navItem,
                    isActive && !isDanger && styles.navItemActive,
                    isActive && isDanger && styles.navDangerActive,
                    !isActive && isDanger && styles.navDanger,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={16} weight={isActive ? 'fill' : 'regular'} />
                  {tab.label}
                </button>
              </>
            )
          })}
        </nav>

        {renderContent()}
      </div>
    </AppLayout>
  )
}
