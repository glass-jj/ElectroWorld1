import { useRef, useState } from 'react'
import Circuit from '../components/Circuit.jsx'
import ScreenLayout from '../components/ScreenLayout.jsx'
import { calculateOhmsLaw } from '../physics/ohmsLaw.js'
import { GameHud, GameSummary } from './GameUI.jsx'
import { POWER_MISSIONS } from './gameLogic.js'
import { judgePowerRelease, powerVoltage } from './arcadeLogic.js'
import useGameTimeout from './useGameTimeout.js'
import useHoldCharge from './useHoldCharge.js'

export default function PowerUp({ onBack, onRecord }) {
  const [mission, setMission] = useState(0)
  const [resistance, setResistance] = useState(4)
  const [score, setScore] = useState(0)
  const [hits, setHits] = useState(0)
  const [lives, setLives] = useState(3)
  const [feedback, setFeedback] = useState(null)
  const [voltage, setVoltage] = useState(0)
  const locked = useRef(false)
  const { schedule, cancel } = useGameTimeout()
  const finished = mission >= POWER_MISSIONS.length || lives === 0
  const target = POWER_MISSIONS[mission] ?? 1
  const hold = useHoldCharge({ disabled: finished || !!feedback?.correct, onBegin: () => setFeedback(null), onRelease: release, halfCycle: 3000 })
  const liveVoltage = hold.charging ? powerVoltage(hold.level, resistance, target) : voltage
  const values = calculateOhmsLaw(liveVoltage, resistance)
  const maxVoltage = Math.min(24, 2 * target * resistance)
  const center = target * resistance / maxVoltage * 100
  function replay() {
    cancel(); hold.cancel(); locked.current = false
    setMission(0); setResistance(4); setScore(0); setHits(0); setLives(3); setFeedback(null); setVoltage(0)
    window.scrollTo(0, 0)
  }
  function release(level) {
    if (locked.current || finished) return
    const result = judgePowerRelease(level, resistance, target)
    setVoltage(result.voltage); setFeedback(result)
    if (!result.correct) { setLives(lives - 1); return }
    locked.current = true
    const nextScore = score + result.points
    setScore(nextScore); setHits(hits + 1); onRecord(nextScore)
    schedule(() => { setMission(mission + 1); setFeedback(null); setVoltage(0); locked.current = false }, 1000)
  }
  return <ScreenLayout title="Power Up" description="Mantén para cargar. Suelta en la zona de energía perfecta." onBack={onBack} backLabel="Volver a minijuegos" eyebrow="PRECISIÓN / 02" className="interactive-screen game-screen power-up-screen">
    {finished ? <GameSummary score={score} detail={`${hits} misiones resueltas · ${lives} vidas restantes`} onReplay={replay} onBack={onBack} /> : <>
      <GameHud score={score} label="Misión" value={`${mission + 1}/5`} extraLabel="Vidas" extraValue={`${lives}/3`} />
      <div className="power-mission"><span>OBJETIVO DE CORRIENTE</span><h2>{target.toLocaleString('es-CO')} <small>A</small></h2></div>
      <Circuit current={values.current} power={values.power} solved={feedback?.correct} />
      <div className="charge-meter" role="meter" aria-label="Nivel de carga" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(liveVoltage / maxVoltage * 100)}><span className="meter-sweet-spot" style={{ left: `${center * 0.92}%`, width: `${center * 0.16}%` }} /><span className="meter-fill" style={{ width: `${liveVoltage / maxVoltage * 100}%` }} /><span className="meter-needle" style={{ left: `${liveVoltage / maxVoltage * 100}%` }} /></div>
      <div className="meter-captions"><span>{liveVoltage.toFixed(1)} V</span><span>SUELTA EN LA ZONA MARCADA</span></div>
      <div className="resistance-choices" aria-label="Elige resistencia">{[2, 4, 6].map((value) => <button type="button" key={value} aria-pressed={resistance === value} onClick={() => { setResistance(value); setVoltage(0); setFeedback(null) }} disabled={hold.charging || !!feedback?.correct}>{value} Ω</button>)}</div>
      <button type="button" className={`primary-mobile-button hold-button ${hold.charging ? 'is-holding' : ''}`} {...hold.buttonProps} disabled={!!feedback?.correct}>{hold.charging ? 'SUELTA PARA CONECTAR' : 'MANTÉN PARA CARGAR'}<span aria-hidden="true">ϟ</span></button>
      <p className={`arcade-message ${feedback && !feedback.correct ? 'is-miss' : ''}`} role="status">{feedback ? feedback.correct ? `Energía conectada. +${feedback.points}` : feedback.status === 'low' ? 'Faltó energía. Mantén un poco más.' : 'Demasiada energía. Suelta antes.' : 'Cuanto más preciso, más puntos. Margen de acierto: ±8 %.'}</p>
    </>}
  </ScreenLayout>
}
