import { useRef, useState } from 'react'
import ScreenLayout from '../components/ScreenLayout.jsx'
import { GameFeedback, GameHud, GameSummary } from './GameUI.jsx'
import { calculateShotForce, evaluateShot, SHOT_TARGETS, SHOT_TOLERANCE } from './gameLogic.js'
import useGameTimeout from './useGameTimeout.js'

export default function CoulombShot({ onBack, onRecord }) {
  const [round, setRound] = useState(0)
  const [charge, setCharge] = useState(5)
  const [distance, setDistance] = useState(4)
  const [score, setScore] = useState(0)
  const [hits, setHits] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [shot, setShot] = useState(null)
  const locked = useRef(false)
  const { schedule, cancel } = useGameTimeout()
  const finished = round >= SHOT_TARGETS.length
  const flying = shot?.phase === 'flying'
  const force = calculateShotForce(charge, distance)
  function replay() {
    cancel(); locked.current = false
    setRound(0); setCharge(5); setDistance(4); setScore(0); setHits(0); setAttempts(0); setShot(null)
    window.scrollTo(0, 0)
  }
  function launch() {
    if (finished || locked.current) return
    locked.current = true
    const result = evaluateShot(charge, distance, SHOT_TARGETS[round])
    setAttempts(attempts + 1)
    setShot({ ...result, phase: 'flying' })
    schedule(() => {
      setShot({ ...result, phase: 'landed' })
      if (result.correct) {
        const nextScore = score + 500
        setScore(nextScore); setHits(hits + 1); onRecord(nextScore)
      } else locked.current = false
    }, 700)
  }
  function nextRound() {
    if (shot?.phase !== 'landed' || !shot.correct) return
    setRound(round + 1); setShot(null); locked.current = false
    window.scrollTo(0, 0)
  }
  function change(setter, value) { setter(value); setShot(null) }
  return <ScreenLayout title="Coulomb Shot" description="Ajusta tu carga. Apunta a la zona. ¡Lanza!" onBack={onBack} backLabel="Volver a minijuegos" eyebrow="PUNTERÍA ELÉCTRICA" className="interactive-screen game-screen">
    {finished ? <GameSummary score={score} detail={`${hits} impactos de 5 rondas · ${attempts} lanzamientos`} onReplay={replay} onBack={onBack} /> : <>
      <GameHud score={score} label="Ronda" value={`${round + 1}/5`} extraLabel="Impactos" extraValue={hits} />
      <div className={`shot-arena ${shot?.phase === 'landed' && shot.correct ? 'shot-arena--hit' : ''}`}>
        <div className="shot-arena-title"><span>FUENTE +5 μC</span><span>ZONA OBJETIVO</span></div>
        <div className="shot-track">
          <div className="shot-target" style={{ left: `${SHOT_TARGETS[round] - SHOT_TOLERANCE}%`, width: `${SHOT_TOLERANCE * 2}%` }}><span>◎</span></div>
          <span className="shot-origin" aria-hidden="true">+</span>
          <span key={attempts} className={`shot-particle ${flying ? 'is-flying' : ''}`} style={{ left: `${shot?.reach ?? 0}%`, '--shot-end': `${shot?.reach ?? 0}%` }} aria-label="Partícula lanzada">+</span>
          <div className="shot-ground" />
        </div>
        <div className="shot-scale"><span>Salida</span><span>Alcance visual</span><span>Máximo</span></div>
      </div>
      <p className="shot-force">Fuerza eléctrica <output>{force.toFixed(4)} N</output></p>
      <div className="ohm-controls">
        <div className="ohm-control"><div><label htmlFor="shot-charge">Magnitud de carga (μC)</label><output>+{charge} μC</output></div><input id="shot-charge" type="range" min="1" max="10" step="1" value={charge} disabled={flying || !!shot?.correct} onChange={(event) => change(setCharge, Number(event.target.value))} /><div className="control-extents"><span>1 μC</span><span>10 μC</span></div></div>
        <div className="ohm-control"><div><label htmlFor="shot-distance">Distancia (m)</label><output>{distance.toFixed(1)} m</output></div><input id="shot-distance" type="range" min="1.5" max="8" step="0.1" value={distance} disabled={flying || !!shot?.correct} onChange={(event) => change(setDistance, Number(event.target.value))} /><div className="control-extents"><span>1,5 m</span><span>8 m</span></div></div>
      </div>
      {shot?.phase === 'landed' && shot.correct ? <button type="button" className="primary-mobile-button" onClick={nextRound}>{round === 4 ? 'VER RESULTADO' : 'SIGUIENTE RONDA'}<span aria-hidden="true">→</span></button> : <button type="button" className="primary-mobile-button" onClick={launch} disabled={flying}>{flying ? 'LANZANDO…' : 'LANZAR'}<span aria-hidden="true">→</span></button>}
      {shot?.phase === 'landed' && <GameFeedback status={shot.correct ? 'hit' : 'miss'} title={shot.correct ? '¡IMPACTO! +500' : shot.status === 'short' ? 'Te faltó fuerza.' : 'Demasiada fuerza.'}>
        {shot.correct ? '¡Justo en la zona!' : shot.status === 'short' ? 'Aumenta la carga o reduce la distancia.' : 'Reduce la carga o aumenta la distancia.'}
      </GameFeedback>}
      <p className="game-tip">Escala arcade: la fuerza determina el alcance visual, no una trayectoria física real.</p>
    </>}
  </ScreenLayout>
}
