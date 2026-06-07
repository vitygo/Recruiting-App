import { useEffect, useRef } from 'react'
import { useThemeStore } from '../../../store/themeStore'
import { noise } from '../utils/noise'
import styles from './AuthBackground.module.css'

export default function AuthBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useThemeStore()

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')!
    let animId: number
    let t = 0

    const W_SMALL = 120, H_SMALL = 80
    const small = document.createElement('canvas')
    small.width = W_SMALL
    small.height = H_SMALL
    const sCtx = small.getContext('2d')!

    const resize = () => {
      cv.width = window.innerWidth
      cv.height = window.innerHeight
    }

    const draw = () => {
      const W = cv.width, H = cv.height
      t += 0.018

      const imgData = sCtx.createImageData(W_SMALL, H_SMALL)
      const data = imgData.data

      const bgR = 10, bgG = 16, bgB = 44
      const c1R = 0, c1G = 102, c1B = 255
      const c2R = 255, c2G = 122, c2B = 61

      for (let y = 0; y < H_SMALL; y++) {
        for (let x = 0; x < W_SMALL; x++) {
          const nx = x / W_SMALL
          const ny = y / H_SMALL

          const n1 = noise(nx * 2.8, ny * 2.8, t)
          const n2 = noise(nx * 2.2 + 4, ny * 2.2 + 4, t * 0.85)

          let factor1 = Math.max(0, Math.min(1, (n1 + 1.2) / 2.4))
          let factor2 = Math.max(0, Math.min(1, (n2 + 1.2) / 2.4))

          factor1 = Math.pow(factor1, 2)
          factor2 = Math.pow(factor2, 4) * 0.4

          let r = bgR + (c1R - bgR) * factor1
          let g = bgG + (c1G - bgG) * factor1
          let b = bgB + (c1B - bgB) * factor1

          r = r + (c2R - r) * factor2
          g = g + (c2G - g) * factor2
          b = b + (c2B - b) * factor2

          const idx = (y * W_SMALL + x) * 4
          data[idx] = Math.floor(r)
          data[idx + 1] = Math.floor(g)
          data[idx + 2] = Math.floor(b)
          data[idx + 3] = 255
        }
      }

      sCtx.putImageData(imgData, 0, 0)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(small, 0, 0, W, H)

      const vgn = ctx.createLinearGradient(0, 0, 0, H)
      vgn.addColorStop(0, 'rgba(5, 7, 20, 0.8)')
      vgn.addColorStop(0.3, 'rgba(5, 7, 20, 0.0)')
      vgn.addColorStop(0.7, 'rgba(5, 7, 20, 0.0)')
      vgn.addColorStop(1, 'rgba(5, 7, 20, 0.85)')
      ctx.fillStyle = vgn
      ctx.fillRect(0, 0, W, H)

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
    <>
      <canvas ref={canvasRef} className={styles.canvas} />
      {theme === 'light' && <div className={styles.bgLight} />}
    </>
  )
}
