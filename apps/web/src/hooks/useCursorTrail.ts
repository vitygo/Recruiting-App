import { useEffect } from 'react'

export function useCursorTrail() {
  useEffect(() => {
    const isTouchDevice = window.matchMedia('(hover: none)').matches
    if (isTouchDevice) return

    const createRipple = (x: number, y: number) => {
      const ripple = document.createElement('div')

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
      const size = 12 + Math.random() * 16

      Object.assign(ripple.style, {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        border: `1px solid ${isDark ? ' #ff7a3d' : ' #ff7a3d'}`,
        pointerEvents: 'none',
        zIndex: '9999',
        transform: 'translate(-50%, -50%) scale(0)',
        animation: 'cursorRipple 0.8s ease-out forwards',
      })

      document.body.appendChild(ripple)
      ripple.addEventListener('animationend', () => ripple.remove())
    }

    const style = document.createElement('style')
    style.textContent = `
      @keyframes cursorRipple {
        0%   { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
      }
    `
    document.head.appendChild(style)

    let lastX = 0
    let lastY = 0
    let lastTime = 0

    const onMove = (e: MouseEvent) => {
      const now = Date.now()
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist > 20 && now - lastTime > 60) {
        createRipple(e.clientX, e.clientY)
        lastX = e.clientX
        lastY = e.clientY
        lastTime = now
      }
    }

    window.addEventListener('mousemove', onMove)

    return () => {
      window.removeEventListener('mousemove', onMove)
      style.remove()
    }
  }, [])
}