import { useRef, useState } from 'react'
import ScreenLayout from '../components/ScreenLayout.jsx'
import { GameHud, GameSummary } from '../components/choqueCargas/GameUI.jsx'
import { CLASH_DURATION, createClashRound, captureCharge, getCapturePoints, getWaveDuration } from '../components/choqueCargas/logica.js'
import useCountdown from '../components/choqueCargas/useCountdown.js'
import useGameTimeout from '../components/choqueCargas/useGameTimeout.js'
import useArcadeLoop from '../components/choqueCargas/useArcadeLoop.js'

export default function ChoqueCargas({ onBack }) {
  const [cargaEntrante, cambiarCargaEntrante] = useState(() => createClashRound()[0])
  const [signoElegido, elegirSigno] = useState(1)
  const [puntaje, cambiarPuntaje] = useState(0)
  const [racha, cambiarRacha] = useState(0)
  const [hits, setHits] = useState(0)
  const [vidas, cambiarVidas] = useState(3)
  const [feedback, setFeedback] = useState(null)
  const [progress, setProgress] = useState(0)
  const startedRef = useRef(0)
  const locked = useRef(false)
  const temporizador = useCountdown(CLASH_DURATION)
  const { schedule, cancel } = useGameTimeout()
  const finished = temporizador.finished || vidas === 0
  function newWave(count) {
    startedRef.current = Date.now()
    cambiarCargaEntrante(createClashRound()[0]); setProgress(0); setFeedback(null)
    locked.current = false
    return getWaveDuration(count)
  }
  function start() {
    cancel(); cambiarPuntaje(0); cambiarRacha(0); setHits(0); cambiarVidas(3)
    newWave(0); temporizador.start()
  }
  function resolve(progressValue) {
    if (!temporizador.active || temporizador.hasExpired() || locked.current || finished) return
    locked.current = true
    const result = captureCharge(cargaEntrante, signoElegido, progressValue)
    const points = result.correct ? getCapturePoints(racha) : 0
    const nextHits = hits + (result.correct ? 1 : 0)
    setFeedback({ ...result, points })
    if (result.correct) { cambiarPuntaje(puntaje + points); cambiarRacha(racha + 1); setHits(nextHits) }
    else { cambiarVidas(vidas - 1); cambiarRacha(0); if (vidas === 1) { temporizador.stop(); return } }
    schedule(() => newWave(nextHits), 650)
  }
  useArcadeLoop(() => {
    const next = (Date.now() - startedRef.current) / getWaveDuration(hits)
    setProgress(Math.min(1, next))
    if (next >= 1) resolve(next)
  }, temporizador.active && !finished && !feedback)
  const timingText = progress < 0.55 ? 'Se acerca…' : progress <= 0.82 ? '¡Captura ahora!' : 'Se escapa…'
  const messages = { early: 'Muy pronto.', late: 'Se escapó.', repelled: 'Mismo signo: se repelen.' }
  return <ScreenLayout title="Choque de Cargas" description="Las cargas iguales se repelen. Elige el signo opuesto y captura la carga cuando llegue a la zona." onBack={onBack} backLabel="Volver al menú del minijuego" className="interactive-screen game-screen arcade-clash-screen">
    {finished ? <GameSummary score={puntaje} detail={`${hits} capturas · ${vidas === 0 ? 'Sin vidas' : 'Tiempo completado'}`} onReplay={start} onBack={onBack} /> : <>
      <GameHud score={puntaje} label="Tiempo" value={`${temporizador.seconds} s`} extraLabel="Vidas" extraValue={`${vidas}/3`} />
      <div className={`capture-arena ${feedback?.correct ? 'capture-arena--hit' : ''}`}>
        <div className="capture-lane">
          <div className="capture-zone"><span>ZONA DE CAPTURA</span></div>
          <span className={`incoming-charge ${cargaEntrante > 0 ? 'positive' : 'negative'}`} aria-label={`Carga entrante ${cargaEntrante > 0 ? 'positiva' : 'negativa'}`} style={{ top: `${8 + progress * 70}%` }}>{cargaEntrante > 0 ? '+' : '−'}</span>
          <span className={`collector-charge ${signoElegido > 0 ? 'positive' : 'negative'}`}>{signoElegido > 0 ? '+' : '−'}</span>
        </div>
        <p className="capture-timing" role="status">{feedback ? feedback.correct ? `Capturada. +${feedback.points} · Racha ×${racha}` : messages[feedback.status] : temporizador.active ? timingText : 'Pulsa Empezar.'}</p>
      </div>
      <div className="polarity-switch" aria-label="Signo de tu carga"><button type="button" aria-pressed={signoElegido === 1} onClick={() => elegirSigno(1)} disabled={!!feedback}>CARGA +</button><button type="button" aria-pressed={signoElegido === -1} onClick={() => elegirSigno(-1)} disabled={!!feedback}>CARGA −</button></div>
      <button type="button" className="primary-mobile-button" onClick={temporizador.active ? () => resolve((Date.now() - startedRef.current) / getWaveDuration(hits)) : start} disabled={!!feedback}>{temporizador.active ? 'CAPTURAR' : 'EMPEZAR · 45 s'}<span aria-hidden="true">↓</span></button>
    </>}
  </ScreenLayout>
}
