import { useRef, useState } from 'react'
import ScreenLayout from '../components/ScreenLayout.jsx'
import { GameHud, GameSummary } from './GameUI.jsx'
import { SHOT_TARGETS } from './gameLogic.js'
import { judgeArcadeShot, movingShotTarget } from './arcadeLogic.js'
import useGameTimeout from './useGameTimeout.js'
import useHoldCharge from './useHoldCharge.js'
import useReducedMotion from './useReducedMotion.js'
import useArcadeLoop from './useArcadeLoop.js'

export default function CoulombShot({ onBack, onRecord }) {
  const [round, setRound] = useState(0)
  const [distance, setDistance] = useState(4)
  const [score, setScore] = useState(0)
  const [hits, setHits] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [shot, setShot] = useState(null)
  const [target, setTarget] = useState(SHOT_TARGETS[0])
  const startedRef = useRef(null)
  const locked = useRef(false)
  const reduced = useReducedMotion()
  const { schedule, cancel } = useGameTimeout()
  const finished = round >= SHOT_TARGETS.length
  const flying = shot?.phase === 'flying'
  const busy = flying || (shot?.phase === 'landed' && (shot.correct || attempt >= 3))
  const hold = useHoldCharge({ disabled: finished || busy, onBegin: () => setShot(null), onRelease: launch, halfCycle: 2500 })
  useArcadeLoop(() => {
    if (startedRef.current === null) startedRef.current = Date.now()
    setTarget(movingShotTarget(SHOT_TARGETS[round], Date.now() - startedRef.current, reduced))
  }, !finished && !busy)
  const preview = judgeArcadeShot(hold.level, distance, target, attempt + 1)
  function replay() {
    cancel(); hold.cancel(); locked.current = false; startedRef.current = null
    setRound(0); setDistance(4); setScore(0); setHits(0); setAttempt(0); setShot(null); setTarget(SHOT_TARGETS[0])
    window.scrollTo(0, 0)
  }
  function nextRound() {
    setRound(round + 1); setAttempt(0); setShot(null); startedRef.current = null; locked.current = false
    setTarget(SHOT_TARGETS[round + 1] ?? 50)
    window.scrollTo(0, 0)
  }
  function launch(level) {
    if (finished || locked.current) return
    locked.current = true
    const result = judgeArcadeShot(level, distance, target, attempt + 1)
    setAttempt(attempt + 1); setShot({ ...result, phase: 'flying' })
    schedule(() => {
      setShot({ ...result, phase: 'landed' })
      if (result.correct) { setScore(score + result.points); setHits(hits + 1); onRecord(score + result.points) }
      else if (attempt + 1 < 3) locked.current = false
    }, 650)
  }
  const roundEnded = shot?.phase === 'landed' && (shot.correct || attempt >= 3)
  return <ScreenLayout title="Coulomb Shot" description="La zona se mueve. Carga tu tiro y suelta cuando coincida." onBack={onBack} backLabel="Volver a minijuegos" eyebrow="PUNTERÍA / 03" className="interactive-screen game-screen arcade-shot-screen">
    {finished ? <GameSummary score={score} detail={`${hits}/5 impactos · Puntos por precisión y menos intentos`} onReplay={replay} onBack={onBack} /> : <>
      <GameHud score={score} label="Ronda" value={`${round + 1}/5`} extraLabel="Tiros" extraValue={`${Math.max(0, 3 - attempt)}/3`} />
      <div className={`shot-arena ${shot?.phase === 'landed' && shot.correct ? 'shot-arena--hit' : ''}`}>
        <div className="shot-arena-title"><span>FUENTE +5 μC</span><span>OBJETIVO MÓVIL</span></div>
        <div className="shot-track">
          <div className="shot-target" style={{ left: `${target - 6}%`, width: '12%' }}><span>◎</span></div>
          <span className="shot-origin" aria-hidden="true">+</span>
          {hold.charging && <span className="shot-aim" style={{ left: `${preview.reach}%` }} aria-label="Punto previsto de llegada" />}
          <span key={attempt} className={`shot-particle ${flying ? 'is-flying' : ''}`} style={{ left: `${shot?.reach ?? 0}%`, '--shot-end': `${shot?.reach ?? 0}%` }}>+</span>
          <div className="shot-ground" />
        </div>
        <div className="shot-scale"><span>Salida</span><span>Más carga → más alcance</span></div>
      </div>
      <div className="shot-live-data"><span>Carga <strong>+{preview.charge.toFixed(1)} μC</strong></span><span>Fuerza <strong>{preview.force.toFixed(4)} N</strong></span></div>
      <div className="charge-meter"><span className="meter-fill" style={{ width: `${hold.level * 100}%` }} /></div>
      <div className="resistance-choices" aria-label="Distancia de lanzamiento">{[2.5, 4, 5.5].map((value) => <button type="button" key={value} aria-pressed={distance === value} disabled={hold.charging || flying || roundEnded} onClick={() => { setDistance(value); setShot(null) }}>{value.toLocaleString('es-CO')} m</button>)}</div>
      {roundEnded ? <button type="button" className="primary-mobile-button" onClick={nextRound}>{round === 4 ? 'VER RESULTADO' : 'SIGUIENTE RONDA'}<span aria-hidden="true">→</span></button> : <button type="button" className={`primary-mobile-button hold-button ${hold.charging ? 'is-holding' : ''}`} {...hold.buttonProps} disabled={flying}>{flying ? 'EN EL AIRE…' : hold.charging ? 'SUELTA PARA LANZAR' : 'MANTÉN PARA APUNTAR'}<span aria-hidden="true">↗</span></button>}
      <p className={`arcade-message ${shot && !shot.correct ? 'is-miss' : ''}`} role="status">{shot?.phase === 'landed' ? shot.correct ? `Impacto. +${shot.points} puntos` : shot.status === 'short' ? 'Corto. Un poco más de carga.' : 'Te pasaste. Un poco menos de carga.' : 'Alinea la marca de llegada con la zona. Tienes tres tiros por ronda.'}</p>
      <p className="game-tip">Fuerza de Coulomb real; alcance visual de arcade.</p>
    </>}
  </ScreenLayout>
}
