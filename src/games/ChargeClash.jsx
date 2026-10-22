import { useRef, useState } from 'react'
import ScreenLayout from '../components/ScreenLayout.jsx'
import { GameHud, GameSummary } from './GameUI.jsx'
import { CLASH_DURATION, createClashRound } from './gameLogic.js'
import { captureCharge, getCapturePoints, getWaveDuration } from './arcadeLogic.js'
import useCountdown from './useCountdown.js'
import useGameTimeout from './useGameTimeout.js'
import useArcadeLoop from './useArcadeLoop.js'

export default function ChargeClash({ onBack, onRecord }) {
  const [incoming, setIncoming] = useState(() => createClashRound()[0])
  const [collector, setCollector] = useState(1)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [hits, setHits] = useState(0)
  const [lives, setLives] = useState(3)
  const [feedback, setFeedback] = useState(null)
  const [progress, setProgress] = useState(0)
  const startedRef = useRef(0)
  const locked = useRef(false)
  const timer = useCountdown(CLASH_DURATION)
  const { schedule, cancel } = useGameTimeout()
  const finished = timer.finished || lives === 0
  function newWave(count) {
    startedRef.current = Date.now()
    setIncoming(createClashRound()[0]); setProgress(0); setFeedback(null)
    locked.current = false
    return getWaveDuration(count)
  }
  function start() {
    cancel(); setScore(0); setStreak(0); setHits(0); setLives(3)
    newWave(0); timer.start()
  }
  function resolve(progressValue) {
    if (!timer.active || timer.hasExpired() || locked.current || finished) return
    locked.current = true
    const result = captureCharge(incoming, collector, progressValue)
    const points = result.correct ? getCapturePoints(streak) : 0
    const nextHits = hits + (result.correct ? 1 : 0)
    setFeedback({ ...result, points })
    if (result.correct) { setScore(score + points); setStreak(streak + 1); setHits(nextHits); onRecord(score + points) }
    else { setLives(lives - 1); setStreak(0); if (lives === 1) { timer.stop(); return } }
    schedule(() => newWave(nextHits), 650)
  }
  useArcadeLoop(() => {
    const next = (Date.now() - startedRef.current) / getWaveDuration(hits)
    setProgress(Math.min(1, next))
    if (next >= 1) resolve(next)
  }, timer.active && !finished && !feedback)
  const timingText = progress < 0.55 ? 'Se acerca…' : progress <= 0.82 ? 'Ahora. ¡Captúrala!' : 'Se escapa…'
  const messages = { early: 'Demasiado pronto. Espera a la zona.', late: 'Se escapó. Prueba con la siguiente.', repelled: 'Mismo signo: la rechazaste.' }
  return <ScreenLayout title="Carga Clash" description="Cambia tu signo y atrapa la carga en el momento justo." onBack={onBack} backLabel="Volver a minijuegos" eyebrow="REFLEJOS / 01" className="interactive-screen game-screen arcade-clash-screen">
    {finished ? <GameSummary score={score} detail={`${hits} capturas · ${lives === 0 ? 'Sin vidas' : 'Tiempo completado'}`} onReplay={start} onBack={onBack} /> : <>
      <GameHud score={score} label="Tiempo" value={`${timer.seconds} s`} extraLabel="Vidas" extraValue={`${lives}/3`} />
      <div className={`capture-arena ${feedback?.correct ? 'capture-arena--hit' : ''}`}>
        <span className="arena-kicker">USA EL SIGNO OPUESTO PARA ATRAER</span>
        <div className="capture-lane">
          <div className="capture-zone"><span>ZONA DE CAPTURA</span></div>
          <span className={`incoming-charge ${incoming > 0 ? 'positive' : 'negative'}`} aria-label={`Carga entrante ${incoming > 0 ? 'positiva' : 'negativa'}`} style={{ top: `${8 + progress * 70}%` }}>{incoming > 0 ? '+' : '−'}</span>
          <span className={`collector-charge ${collector > 0 ? 'positive' : 'negative'}`}>{collector > 0 ? '+' : '−'}</span>
        </div>
        <p className="capture-timing" role="status">{feedback ? feedback.correct ? `Capturada. +${feedback.points} · Racha ×${streak}` : messages[feedback.status] : timer.active ? timingText : 'Elige tu signo. Espera. Captura.'}</p>
      </div>
      <div className="polarity-switch" aria-label="Signo de tu carga"><button type="button" aria-pressed={collector === 1} onClick={() => setCollector(1)} disabled={!!feedback}>CARGA +</button><button type="button" aria-pressed={collector === -1} onClick={() => setCollector(-1)} disabled={!!feedback}>CARGA −</button></div>
      <button type="button" className="primary-mobile-button" onClick={timer.active ? () => resolve((Date.now() - startedRef.current) / getWaveDuration(hits)) : start} disabled={!!feedback}>{timer.active ? 'CAPTURAR' : 'EMPEZAR · 45 s'}<span aria-hidden="true">↓</span></button>
      <p className="game-tip">Signos opuestos se atraen. Tres vidas; la racha aumenta los puntos.</p>
    </>}
  </ScreenLayout>
}
