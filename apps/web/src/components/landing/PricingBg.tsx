import { useEffect, useRef } from 'react'
import styles from './PricingBg.module.css'

export function PricingBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')!
    let animId: number
    let t = 0

    const resize = () => {
      cv.width = cv.offsetWidth
      cv.height = cv.offsetHeight
    }

    const blob = (cx: number, cy: number, r: number, red: number, g: number, b: number, a: number) => {
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      grad.addColorStop(0, `rgba(${red},${g},${b},${a})`)
      grad.addColorStop(0.5, `rgba(${red},${g},${b},${a * 0.2})`)
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, cv.width, cv.height)
    }

    const draw = () => {
      const W = cv.width, H = cv.height
      t += 0.006

      ctx.clearRect(0, 0, W, H)

      const s = Math.sin(t * 0.5)
      const c = Math.cos(t * 0.4)

      blob(W * (0.2 + s * 0.08), H * (0.3 + c * 0.1), W * 0.4, 106, 76, 245, 0.12)
      blob(W * (0.8 + c * 0.06), H * (0.7 + s * 0.08), W * 0.35, 212, 77, 240, 0.1)
      blob(W * (0.5 + s * 0.05), H * (0.5 + c * 0.06), W * 0.3, 106, 76, 245, 0.08)

      animId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.gridLines} />

      <div className={styles.floatingElements}>
        {[
          { top: '10%', left: '8%', size: 48, delay: 0, opacity: 0.15 },
          { top: '80%', left: '5%', size: 32, delay: 1.2, opacity: 0.1 },
          { top: '20%', left: '88%', size: 40, delay: 0.6, opacity: 0.12 },
          { top: '70%', left: '90%', size: 56, delay: 2, opacity: 0.08 },
          { top: '50%', left: '92%', size: 24, delay: 1.5, opacity: 0.1 },
          { top: '40%', left: '3%', size: 36, delay: 0.9, opacity: 0.1 },
        ].map((el, i) => (
          <div
            key={i}
            className={styles.floatingEl}
            style={{
              top: el.top,
              left: el.left,
              width: el.size,
              height: el.size,
              opacity: el.opacity,
              animationDelay: `${el.delay}s`,
              animationDuration: `${6 + i * 0.8}s`,
            }}
          />
        ))}

        {[
          { top: '15%', left: '12%', delay: 0.3, opacity: 0.2 },
          { top: '65%', left: '8%', delay: 1.8, opacity: 0.15 },
          { top: '25%', left: '85%', delay: 0.9, opacity: 0.18 },
          { top: '75%', left: '88%', delay: 2.4, opacity: 0.12 },
          { top: '45%', left: '6%', delay: 1.1, opacity: 0.15 },
          { top: '55%', left: '91%', delay: 0.5, opacity: 0.13 },
        ].map((el, i) => (
          <div
            key={`star-${i}`}
            className={styles.floatingStar}
            style={{
              top: el.top,
              left: el.left,
              opacity: el.opacity,
              animationDelay: `${el.delay}s`,
              animationDuration: `${4 + i * 0.6}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}