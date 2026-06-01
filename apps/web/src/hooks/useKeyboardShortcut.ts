import { useEffect } from 'react'

type Key = string

interface Options {
  meta?: boolean
  ctrl?: boolean
  shift?: boolean
}

export function useKeyboardShortcut(
  key: Key,
  callback: () => void,
  options: Options = {}
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const metaMatch = options.meta ? e.metaKey : true
      const ctrlMatch = options.ctrl ? e.ctrlKey : true
      const shiftMatch = options.shift ? e.shiftKey : true

      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        metaMatch &&
        ctrlMatch &&
        shiftMatch
      ) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback, options.meta, options.ctrl, options.shift])
}