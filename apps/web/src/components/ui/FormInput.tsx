import type React from 'react'
import styles from './FormInput.module.css'

interface FormInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  error?: string
  inputRef?: React.RefObject<HTMLInputElement | null>
}

export function FormInput({ label, value, onChange, placeholder, type = 'text', required, error, inputRef }: FormInputProps) {
  return (
    <div className={styles.group}>
      <label className={styles.label}>
        {label}{required && <span className={styles.required}>*</span>}
      </label>
      <input
        ref={inputRef}
        className={`${styles.input}${error ? ' ' + styles.inputError : ''}`}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  )
}