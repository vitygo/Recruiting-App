import { useCallback } from 'react'

export function useRipple() {
  const createRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const element = e.currentTarget
    const circle = document.createElement('span')
    const diameter = Math.max(element.clientWidth, element.clientHeight)
    const radius = diameter / 2
    const rect = element.getBoundingClientRect()

    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left = `${e.clientX - rect.left - radius}px`
    circle.style.top = `${e.clientY - rect.top - radius}px`
    circle.classList.add('ripple')

    const existing = element.querySelector('.ripple')
    if (existing) existing.remove()

    element.appendChild(circle)

    circle.addEventListener('animationend', () => circle.remove())
  }, [])

  return createRipple
}