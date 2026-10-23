import { useEffect, useRef, useState } from 'react'
import HeroArtwork from './HeroArtwork.jsx'
import { getSplineSceneUrl } from '../config/spline.js'

// Only the configured scene loads the runtime. The local artwork is available
// offline and remains visible while Spline loads or if the scene fails.
export default function SplineHero({ poster }) {
  const scene = getSplineSceneUrl(import.meta.env.VITE_SPLINE_SCENE_URL)
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!scene) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches || navigator.connection?.saveData) return
    let disposed = false
    const controller = new AbortController()
    let application
    let timeout
    const canvas = canvasRef.current
    const fail = () => {
      if (disposed) return
      disposed = true
      controller.abort()
      clearTimeout(timeout)
      application?.dispose()
      application = undefined
      setReady(false)
    }
    const motionChanged = () => { if (motion.matches) fail() }
    motion.addEventListener('change', motionChanged)
    canvas.addEventListener('webglcontextlost', fail)
    timeout = setTimeout(fail, 15000)
    import('@splinetool/runtime').then(async ({ Application }) => {
      if (disposed) return
      application = new Application(canvas, { renderMode: 'auto', htmlContentMode: 'none' })
      await application.load(scene, undefined, { signal: controller.signal })
      if (disposed) return
      clearTimeout(timeout)
      setReady(true)
    }).catch(fail)
    return () => {
      disposed = true
      controller.abort()
      clearTimeout(timeout)
      motion.removeEventListener('change', motionChanged)
      canvas.removeEventListener('webglcontextlost', fail)
      application?.dispose()
    }
  }, [scene])
  return <div className={`spline-hero ${ready ? 'spline-hero--ready' : ''}`} aria-hidden="true">
    <div className="spline-poster">{poster ?? <HeroArtwork />}</div>
    {scene && <canvas ref={canvasRef} className="spline-canvas" />}
  </div>
}
