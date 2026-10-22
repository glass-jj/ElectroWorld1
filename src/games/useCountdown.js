import { useCallback, useEffect, useState } from 'react'

export default function useCountdown(duration) {
  const [deadline, setDeadline] = useState(null)
  const [remaining, setRemaining] = useState(duration)
  const start = () => {
    setRemaining(duration)
    setDeadline(Date.now() + duration)
  }
  useEffect(() => {
    if (deadline === null) return
    const tick = () => {
      const left = Math.max(0, deadline - Date.now())
      setRemaining(left)
      if (left === 0) clearInterval(interval)
    }
    const interval = setInterval(tick, 100)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [deadline])
  const hasExpired = useCallback(() => deadline !== null && Date.now() >= deadline, [deadline])
  return { seconds: Math.ceil(remaining / 1000), active: deadline !== null, finished: remaining === 0, start, hasExpired }
}
