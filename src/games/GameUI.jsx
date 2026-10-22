import { useEffect, useRef } from 'react'
import MenuIcon from '../components/MenuIcon.jsx'
import './Games.css'

export function GameHud({ score, label, value, extraLabel, extraValue }) {
  return <dl className="game-hud">
    <div><dt>Puntos</dt><dd>{score}</dd></div>
    <div><dt>{label}</dt><dd>{value}</dd></div>
    <div><dt>{extraLabel}</dt><dd>{extraValue}</dd></div>
  </dl>
}

export function GameFeedback({ status, title, children }) {
  const feedbackRef = useRef(null)
  useEffect(() => { feedbackRef.current?.scrollIntoView({ block: 'nearest' }) }, [title])
  return <div ref={feedbackRef} className={`game-feedback game-feedback--${status}`} role="status">
    <strong>{title}</strong>{children && <span>{children}</span>}
  </div>
}

export function GameSummary({ score, detail, onReplay, onBack }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return <section className="game-summary" aria-label="Resultado de la partida">
    <div className="summary-icon"><MenuIcon name="bolt" /></div>
    <p className="mobile-eyebrow">PARTIDA COMPLETADA</p>
    <h2>¡Buen juego!</h2>
    <p className="summary-score">{score}<span>puntos</span></p>
    <p className="summary-detail">{detail}</p>
    <button type="button" className="primary-mobile-button" onClick={onReplay}>JUGAR DE NUEVO<MenuIcon name="arrow" /></button>
    <button type="button" className="game-text-button" onClick={onBack}>Volver a minijuegos</button>
  </section>
}
