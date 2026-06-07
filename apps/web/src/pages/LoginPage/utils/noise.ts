export const noise = (x: number, y: number, t: number): number =>
  Math.sin(x * 1.5 + t * 1.0) * Math.cos(y * 1.2 + t * 0.8) +
  Math.sin(x * 2.5 + y * 1.5 + t * 1.4) * 0.5 +
  Math.sin(x * 0.8 - y * 2.0 + t * 0.6) * 0.3
