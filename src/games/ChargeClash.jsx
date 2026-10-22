import { useRef, useState } from 'react'
import ScreenLayout from '../components/ScreenLayout.jsx'
import { GameFeedback, GameHud, GameSummary } from './GameUI.jsx'
import { checkClashAnswer, CLASH_DURATION, createClashRound } from './gameLogic.js'
import useCountdown from './useCountdown.js'
import useGameTimeout from './useGameTimeout.js'

export default function ChargeClash({ onBack, onRecord }) {
  const [signs, setSigns] = useState(createClashRound)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const locked = useRef(false)
  const timer = useCountdown(CLASH_DURATION)
  const { schedule, cancel } = useGameTimeout()
  function start() {
    cancel()
    locked.current = false
    setSigns(createClashRound())
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setFeedback(null)
    timer.start()
  }
  function answer(choice) {
    if (!timer.active || timer.hasExpired() || locked.current) return
    locked.current = true
    const result = checkClashAnswer(signs, choice)
    setFeedback(result)
    if (result.correct) {
      const nextScore = score + 100
      setScore(nextScore)
      setStreak(streak + 1)
      setBestStreak(Math.max(bestStreak, streak + 1))
      onRecord(nextScore)
    } else setStreak(0)
    schedule(() => {
      setSigns(createClashRound())
      setFeedback(null)
      locked.current = false
    }, 850)
  }
  return <ScreenLayout title="Carga Clash" description="Dos cargas. Una decisión. ¡Haz crecer tu racha!" onBack={onBack} backLabel="Volver a minijuegos" eyebrow="ATRACCIÓN O REPULSIÓN" className="interactive-screen game-screen">
    {timer.finished ? <GameSummary score={score} detail={`Mejor racha: ${bestStreak} · 45 segundos de energía`} onReplay={start} onBack={onBack} /> : <>
      <GameHud score={score} label="Tiempo" value={`${timer.seconds} s`} extraLabel="Racha" extraValue={`×${streak}`} />
      <div className="game-timer-track" role="progressbar" aria-label="Tiempo restante" aria-valuemin={0} aria-valuemax={45} aria-valuenow={timer.seconds}><span style={{ width: `${timer.seconds / 45 * 100}%` }} /></div>
      <div className={`clash-arena ${feedback ? `clash-${feedback.interaction}` : ''}`}>
        <p className="arena-kicker">¿ATRACCIÓN O REPULSIÓN?</p>
        <div className="clash-charges">
          {signs.map((sign, index) => <span key={index} className={`clash-charge ${sign > 0 ? 'positive' : 'negative'}`} aria-label={`Carga ${index + 1} ${sign > 0 ? 'positiva' : 'negativa'}`}>{sign > 0 ? '+' : '−'}</span>)}
        </div>
        <span className="clash-direction" aria-hidden="true">{feedback ? feedback.interaction === 'attraction' ? '→ ←' : '← →' : '· · ·'}</span>
      </div>
      {!timer.active ? <>
        <p className="game-tip">Acierta para sumar +100. Tienes 45 segundos.</p>
        <button type="button" className="primary-mobile-button" onClick={start}>EMPEZAR · 45 s<span aria-hidden="true">→</span></button>
      </> : <>
        <div className="clash-actions">
          <button type="button" onClick={() => answer('attraction')} disabled={!!feedback}>ATRACCIÓN<span aria-hidden="true">→ ←</span></button>
          <button type="button" onClick={() => answer('repulsion')} disabled={!!feedback}>REPULSIÓN<span aria-hidden="true">← →</span></button>
        </div>
        {feedback ? <GameFeedback status={feedback.correct ? 'hit' : 'miss'} title={feedback.correct ? '¡Correcto! +100' : 'Casi.'}>{feedback.interaction === 'repulsion' ? 'Cargas iguales se repelen.' : 'Cargas distintas se atraen.'}</GameFeedback> : <p className="game-tip">Toca tu respuesta. ¡Cada acierto cuenta!</p>}
      </>}
    </>}
  </ScreenLayout>
}
