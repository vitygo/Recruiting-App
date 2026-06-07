import styles from './LoadingSpinner.module.css'

interface Props {
  size?: number
}

export function LoadingSpinner({ size = 40 }: Props) {
  return (
    <svg
      className={styles.spinner}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-label="Loading"
      role="status"
    >
      <circle cx="20" cy="20" r="16" stroke="var(--c-hairline)" strokeWidth="3.5" />
      <circle
        cx="20"
        cy="20"
        r="16"
        stroke="var(--c-orange)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="75.4 25.2"
        transform="rotate(-90 20 20)"
      />
    </svg>
  )
}
