import { useEffect } from 'react'
import MenuIcon from '../MenuIcon.jsx'
import './ChoqueCargas.css'

export function GameHud({ score, label, value, extraLabel, extraValue }) {
  return <dl className="game-hud">
    <div><dt>Puntos</dt><dd>{score}</dd></div>
    <div><dt>{label}</dt><dd>{value}</dd></div>
    <div><dt>{extraLabel}</dt><dd>{extraValue}</dd></div>
  </dl>
}

export function GameSummary({ score, detail, onReplay, onBack }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return <section className="game-summary" aria-label="Resultado de la partida">
    <h2>Resultado</h2>
    <p className="summary-score">{score}<span>puntos</span></p>
    <p className="summary-detail">{detail}</p>
    <button type="button" className="primary-mobile-button" onClick={onReplay}>JUGAR DE NUEVO<MenuIcon name="arrow" /></button>
    <button type="button" className="game-text-button" onClick={onBack}>Volver</button>
  </section>
}
