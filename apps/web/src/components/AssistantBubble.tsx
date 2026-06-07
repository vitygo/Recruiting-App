import { useState, useEffect } from 'react'
import { X } from '@phosphor-icons/react'
import styles from './AssistantBubble.module.css'

const MESSAGE =
  'Demo mode active. You are viewing sample data. Connect a real database or update localized storage parameters to manipulate live assets.'

export function AssistantBubble() {
  const [open, setOpen] = useState(false)
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    if (!open) {
      setDisplayText('')
      return
    }
    setDisplayText('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayText(MESSAGE.slice(0, i))
      if (i >= MESSAGE.length) clearInterval(id)
    }, 22)
    return () => clearInterval(id)
  }, [open])

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.popup} ${open ? styles.popupOpen : ''}`}
        aria-live="polite"
        aria-atomic="false"
      >
        <p className={styles.popupText}>
          {displayText}
          {open && displayText.length < MESSAGE.length && (
            <span className={styles.cursor} aria-hidden="true">|</span>
          )}
        </p>
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
