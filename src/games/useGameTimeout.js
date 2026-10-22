import { useCallback, useEffect, useRef } from 'react'

export default function useGameTimeout() {
  const timer = useRef(null)
  const cancel = useCallback(() => clearTimeout(timer.current), [])
  const schedule = useCallback((callback, delay) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(callback, delay)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])
  return { schedule, cancel }
}
