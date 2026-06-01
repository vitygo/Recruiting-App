import { useEffect, useRef } from 'react'

interface TiltOptions {
  max?: number
  scale?: number
  speed?: number
}

export function useTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const ref = useRef<T>(null)
  const { max = 8, scale = 1.02, speed = 400 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const isTouchDevice = window.matchMedia('(hover: none)').matches
    if (isTouchDevice) return

    let rafId: number

    const onEnter = () => {
      el.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`
    }

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)

      const rotateX = -dy * max
      const rotateY = dx * max

      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        el.style.transition = 'transform 50ms linear'
        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
      })
    }

    const onLeave = () => {
      cancelAnimationFrame(rafId)
      el.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafId)
    }
  }, [max, scale, speed])

  return ref
}