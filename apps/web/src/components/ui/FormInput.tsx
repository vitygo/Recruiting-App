import styles from './FormInput.module.css'

interface FormInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}

export function FormInput({ label, value, onChange, placeholder, type = 'text', required }: FormInputProps) {
  return (
    <div className={styles.group}>
      <label className={styles.label}>
        {label}{required && <span className={styles.required}>*</span>}
      </label>
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}