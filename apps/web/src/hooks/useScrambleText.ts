import { useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*'

export function useScrambleText(original: string) {
  const ref = useRef<HTMLElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.innerHTML = original
      .split('')
      .map((c) => `<span data-char="${c}">${c}</span>`)
      .join('')

    const onEnter = () => {
      if (timerRef.current) return

      const spans = el.querySelectorAll<HTMLSpanElement>('span')
      let iter = 0

      timerRef.current = setInterval(() => {
        spans.forEach((s, i) => {
          if (i < iter) {
            s.textContent = s.dataset.char || ''
            s.style.color = ''
          } else {
            s.textContent = CHARS[Math.floor(Math.random() * CHARS.length)]
            s.style.color = 'rgba(160,130,255,0.9)'
          }
        })

        iter += 0.5

        if (iter > original.length + 1) {
          clearInterval(timerRef.current!)
          timerRef.current = null
          spans.forEach((s) => {
            s.textContent = s.dataset.char || ''
            s.style.color = ''
          })
        }
      }, 35)
    }

    el.addEventListener('mouseenter', onEnter)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [original])

  return ref
}