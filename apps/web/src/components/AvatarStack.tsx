import styles from './AvatarStack.module.css'

export interface AvatarItem {
  name: string
  avatarUrl?: string
}

interface Props {
  items: AvatarItem[]
  max?: number
  size?: number
}

const PALETTE = [
  { bg: 'rgba(255,122,61,0.15)', color: 'var(--c-orange)' },
  { bg: 'rgba(0,153,255,0.12)',  color: 'var(--c-accent)' },
  { bg: 'rgba(34,197,94,0.12)',  color: 'var(--c-success)' },
  { bg: 'rgba(168,85,247,0.12)', color: '#a855f7' },
]

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export function AvatarStack({ items, max = 4, size = 28 }: Props) {
  if (items.length === 0) return null

  const visible = items.slice(0, max)
  const extra   = items.length - max
  const overlap = Math.round(size * 0.35)

  return (
    <div className={styles.stack} style={{ height: `${size}px` }}>
      {visible.map((item, i) => {
        const { bg, color } = PALETTE[i % PALETTE.length]
        return (
          <div
            key={i}
            className={styles.avatar}
            style={{
              width:       `${size}px`,
              height:      `${size}px`,
              marginLeft:  i === 0 ? 0 : `-${overlap}px`,
              background:  item.avatarUrl ? undefined : bg,
              color:       item.avatarUrl ? undefined : color,
              fontSize:    `${Math.round(size * 0.36)}px`,
              zIndex:      visible.length - i,
            }}
            title={item.name}
            aria-label={item.name}
          >
            {item.avatarUrl
              ? <img src={item.avatarUrl} alt={item.name} className={styles.avatarImg} />
              : initials(item.name)
            }
          </div>
        )
      })}

      {extra > 0 && (
        <div
          className={`${styles.avatar} ${styles.extra}`}
          style={{
            width:      `${size}px`,
            height:     `${size}px`,
            marginLeft: `-${overlap}px`,
            fontSize:   `${Math.round(size * 0.3)}px`,
          }}
          aria-label={`${extra} more`}
        >
          +{extra}
        </div>
      )}
    </div>
  )
}
