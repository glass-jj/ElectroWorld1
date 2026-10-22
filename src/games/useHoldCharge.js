import { useEffect, useRef, useState } from 'react'
import { oscillatingLevel } from './arcadeLogic.js'
import useArcadeLoop from './useArcadeLoop.js'

export default function useHoldCharge({ onRelease, onBegin, disabled, halfCycle = 2200 }) {
  const [charging, setCharging] = useState(false)
  const [level, setLevel] = useState(0)
  const startRef = useRef(null)
  useArcadeLoop(() => { if (startRef.current !== null) setLevel(oscillatingLevel(Date.now() - startRef.current, halfCycle)) }, charging)
  function cancel() { startRef.current = null; setCharging(false) }
  useEffect(() => {
    const cancelHold = () => { startRef.current = null; setCharging(false) }
    window.addEventListener('blur', cancelHold)
    const visibility = () => { if (document.hidden) cancelHold() }
    document.addEventListener('visibilitychange', visibility)
    return () => { window.removeEventListener('blur', cancelHold); document.removeEventListener('visibilitychange', visibility) }
  }, [])
  function begin() {
    if (disabled || startRef.current !== null) return
    startRef.current = Date.now()
    setLevel(0); setCharging(true); onBegin?.()
  }
  function release() {
    if (startRef.current === null) return
    const finalLevel = oscillatingLevel(Date.now() - startRef.current, halfCycle)
    startRef.current = null
    setLevel(finalLevel); setCharging(false)
    if (!disabled) onRelease(finalLevel)
  }
  return { charging, level, cancel, buttonProps: {
    onPointerDown: (event) => {
      if (event.button !== 0 || disabled) return
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      begin()
    },
    onPointerUp: (event) => { release(); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) },
    onPointerCancel: cancel,
    onLostPointerCapture: cancel,
    onKeyDown: (event) => { if ([' ', 'Enter'].includes(event.key)) { event.preventDefault(); if (!event.repeat) begin() } },
    onKeyUp: (event) => { if ([' ', 'Enter'].includes(event.key)) { event.preventDefault(); release() } },
    onBlur: cancel,
  } }
}
