import { useState, useEffect } from 'react'
import { X } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { demoApi } from '../api/demo'
import styles from './AssistantBubble.module.css'

const FULL_MESSAGE =
  'Demo mode active. We have populated your pipeline with sample positions and talent. ' +
  'Click below to permanently wipe this workspace and start fresh.'

export function AssistantBubble() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [displayText, setDisplayText] = useState('')
  const [isDemoActive, setIsDemoActive] = useState(
    () => localStorage.getItem('is_demo_active') === 'true'
  )

  const wipeMutation = useMutation({
    mutationFn: () => demoApi.clear(),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
      localStorage.removeItem('has_seen_assistant')
      localStorage.setItem('is_demo_active', 'false')
      setIsDemoActive(false)
      setOpen(false)
    },
  })

  // Auto-open once per session; localStorage prevents re-trigger on route changes
  useEffect(() => {
    if (isDemoActive && !localStorage.getItem('has_seen_assistant')) {
      setOpen(true)
      localStorage.setItem('has_seen_assistant', 'true')
    }
  }, [isDemoActive])

  // Typewriter animation — restarts every time the popup opens
  useEffect(() => {
    if (!open) {
      setDisplayText('')
      return
    }
    setDisplayText('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayText(FULL_MESSAGE.slice(0, i))
      if (i >= FULL_MESSAGE.length) clearInterval(id)
    }, 20)
    return () => clearInterval(id)
  }, [open])

  if (!isDemoActive) return null

  const typingDone = displayText.length >= FULL_MESSAGE.length

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.popup} ${open ? styles.popupOpen : ''}`}
        aria-live="polite"
        aria-atomic="false"
      >
        <p className={styles.popupText}>
          {displayText}
          {open && !typingDone && (
            <span className={styles.cursor} aria-hidden="true">|</span>
          )}
        </p>

        {typingDone && (
          <button
            type="button"
            className={styles.wipeBtn}
            onClick={() => wipeMutation.mutate()}
            disabled={wipeMutation.isPending}
          >
            {wipeMutation.isPending ? 'Clearing…' : 'Clear Workspace Data'}
          </button>
        )}

        <span className={styles.popupArrow} aria-hidden="true" />
      </div>

      <button
        type="button"
        className={styles.bubble}
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close assistant info' : 'Open assistant info'}
        aria-expanded={open}
      >
        {open ? (
          <X size={18} weight="bold" aria-hidden="true" />
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-2 11H6v-2h12v2zm0-3H6V8h12v2z"/>
          </svg>
        )}
      </button>
    </div>
  )
}
