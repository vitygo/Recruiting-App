import { useState, useRef, useEffect } from 'react'
import { CaretDown, Check } from '@phosphor-icons/react'
import styles from './Select.module.css'

interface Option {
  value: string
  label: string
}

interface SelectProps {
    value: string
    onChange: (value: string) => void
    options: Option[]
    placeholder?: string
    fullWidth?: boolean
  }
  


  export function Select({ value, onChange, options, placeholder, fullWidth }: SelectProps) {
  const [open, setOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropdownPos({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      })
    }
    setOpen(o => !o)
  }

  return (
<div className={`${styles.wrap} ${fullWidth ? styles.wrapFull : ''}`} ref={wrapRef}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        onClick={handleOpen}
        type="button"
      >
        <span className={selected ? styles.triggerValue : styles.triggerPlaceholder}>
          {selected?.label || placeholder || 'Select...'}
        </span>
        <CaretDown
          size={12}
          weight="bold"
          className={`${styles.caret} ${open ? styles.caretOpen : ''}`}
        />
      </button>

      {open && (
        <div
          className={styles.dropdown}
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
            minWidth: dropdownPos.width,
          }}
        >
          {options.map(option => (
            <button
              key={option.value}
              className={`${styles.option} ${option.value === value ? styles.optionActive : ''}`}
              onClick={() => { onChange(option.value); setOpen(false) }}
              type="button"
            >
              <span>{option.label}</span>
              {option.value === value && (
                <Check size={12} weight="bold" className={styles.check} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}