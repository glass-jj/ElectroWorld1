import { useRef, useState } from 'react'
import Circuit from '../components/Circuit.jsx'
import OhmControls from '../components/OhmControls.jsx'
import ScreenLayout from '../components/ScreenLayout.jsx'
import { calculateOhmsLaw } from '../physics/ohmsLaw.js'
import { GameFeedback, GameHud, GameSummary } from './GameUI.jsx'
import { evaluatePowerMission, POWER_MISSIONS } from './gameLogic.js'
import useGameTimeout from './useGameTimeout.js'

export default function PowerUp({ onBack, onRecord }) {
  const [mission, setMission] = useState(0)
  const [voltage, setVoltage] = useState(6)
  const [resistance, setResistance] = useState(6)
  const [score, setScore] = useState(0)
  const [hits, setHits] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const locked = useRef(false)
  const { schedule, cancel } = useGameTimeout()
  const values = calculateOhmsLaw(voltage, resistance)
  const finished = mission >= POWER_MISSIONS.length
  function replay() {
    cancel()
    locked.current = false
    setMission(0); setVoltage(6); setResistance(6)
    setScore(0); setHits(0); setAttempts(0); setFeedback(null)
    window.scrollTo(0, 0)
  }
  function attempt() {
    if (finished || locked.current) return
    const result = evaluatePowerMission(voltage, resistance, POWER_MISSIONS[mission])
    setAttempts(attempts + 1)
    setFeedback(result.status)
    if (!result.correct) return
    locked.current = true
    const nextScore = score + 300
    setScore(nextScore); setHits(hits + 1); onRecord(nextScore)
    schedule(() => {
      setMission(mission + 1)
      setFeedback(null)
      locked.current = false
      window.scrollTo(0, 0)
    }, 950)
  }
  const change = (setter, value) => { setter(value); setFeedback(null) }
  return <ScreenLayout title="Power Up" description="Ajusta el circuito. Enciende tu próxima victoria." onBack={onBack} backLabel="Volver a minijuegos" eyebrow="RETO DE CORRIENTE" className="interactive-screen game-screen power-up-screen">
    {finished ? <GameSummary score={score} detail={`${hits} aciertos de 5 misiones · ${attempts} intentos`} onReplay={replay} onBack={onBack} /> : <>
      <GameHud score={score} label="Misión" value={`${mission + 1}/5`} extraLabel="Aciertos" extraValue={hits} />
      <div className="power-mission"><span>TU MISIÓN</span><h2>Consigue {POWER_MISSIONS[mission].toLocaleString('es-CO')} A</h2><p>Margen de acierto: ±5 %</p></div>
      <Circuit current={values.current} power={values.power} solved={feedback === 'hit'} />
      <OhmControls voltage={voltage} resistance={resistance} onVoltage={(value) => change(setVoltage, value)} onResistance={(value) => change(setResistance, value)} maxResistance={24} disabled={feedback === 'hit'} />
      <button type="button" className="primary-mobile-button" onClick={attempt} disabled={feedback === 'hit'}>PROBAR<span aria-hidden="true">ϟ</span></button>
      {feedback && <GameFeedback status={feedback === 'hit' ? 'hit' : 'miss'} title={feedback === 'hit' ? '¡Bombillo encendido! +300' : feedback === 'low' ? 'Poca corriente.' : 'Demasiada corriente.'}>
        {feedback === 'hit' ? '¡Siguiente misión!' : feedback === 'low' ? 'Necesitas más voltaje o menos resistencia.' : 'Prueba aumentar la resistencia.'}
      </GameFeedback>}
    </>}
  </ScreenLayout>
}
