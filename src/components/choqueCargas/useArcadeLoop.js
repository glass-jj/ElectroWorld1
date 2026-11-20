import { useEffect, useRef } from 'react'

export default function useArcadeLoop(callback, active, delay = 40) {
  const callbackRef = useRef(callback)
  useEffect(() => { callbackRef.current = callback }, [callback])
  useEffect(() => {
    if (!active) return
    const interval = setInterval(() => callbackRef.current(), delay)
    return () => clearInterval(interval)
  }, [active, delay])
}
