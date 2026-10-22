import { getCircuitVisuals } from '../physics/ohmsLaw.js'
import './Circuit.css'

export default function Circuit({ current, power, solved = false }) {
  const { flowing, duration, brightness } = getCircuitVisuals(current, power)
  return <figure className={`circuit ${solved ? 'circuit--solved' : ''}`}>
    <svg viewBox="0 0 340 220" role="img" aria-label={`Circuito cerrado con fuente, resistencia y bombillo. Corriente ${current.toFixed(2)} amperios. Potencia ${power.toFixed(2)} vatios.`}>
      <path className="circuit-wire-shadow" d="M48 100V40H292V180H48Z" />
      <path className="circuit-wire" d="M48 100V40H292V180H48Z" />
      <path className="circuit-resistor" d="M135 40h8l5-9 9 18 9-18 9 18 9-18 9 18 5-9h8" />
      <rect x="27" y="88" width="42" height="37" rx="6" className="circuit-source-bg" />
      <path className="circuit-source" d="M31 100h34m-26 14h18" />
      <text x="21" y="95" className="circuit-sign">+</text><text x="23" y="124" className="circuit-sign">−</text>
      <text x="48" y="145" textAnchor="middle" className="circuit-label">FUENTE</text>
      <text x="170" y="20" textAnchor="middle" className="circuit-label">RESISTENCIA</text>
      <circle cx="292" cy="110" r="36" fill="#ffd76a" opacity={brightness * 0.14} />
      <circle className="circuit-bulb" cx="292" cy="110" r="23" fill={`rgba(255, 214, 111, ${0.04 + brightness * 0.85})`} style={{ filter: `drop-shadow(0 0 ${brightness * 7}px #f8cd74)` }} />
      <path className="circuit-filament" d="m283 101 18 18m0-18-18 18" style={{ opacity: 0.3 + brightness * 0.7 }} />
      {Array.from({ length: 10 }, (_, index) => <circle key={index} className="circuit-particle" r="3" fill="#91efd6" style={{ animationDuration: `${duration}s`, animationDelay: `${-duration * index / 10}s`, animationPlayState: flowing ? 'running' : 'paused' }} />)}
      <text x="167" y="104" textAnchor="middle" className="circuit-current">{current.toFixed(2)} A</text>
      <text x="167" y="125" textAnchor="middle" className="circuit-label">CORRIENTE</text>
    </svg>
    <figcaption>Animación simbólica del flujo de corriente.</figcaption>
  </figure>
}
