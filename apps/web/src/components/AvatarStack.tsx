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

const MONO_BG    = '#2e2e3a'
const MONO_COLOR = '#d4d4e0'

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
        return (
          <div
            key={i}
            className={styles.avatar}
            style={{
              width:       `${size}px`,
              height:      `${size}px`,
              marginLeft:  i === 0 ? 0 : `-${overlap}px`,
              background:  item.avatarUrl ? undefined : MONO_BG,
              color:       item.avatarUrl ? undefined : MONO_COLOR,
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
