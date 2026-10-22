import MenuIcon from '../components/MenuIcon.jsx'
import SplineHero from '../components/SplineHero.jsx'

export default function WelcomeScreen({ onStart }) {
  return <main className="welcome-screen">
    <div className="welcome-inner">
      <header className="welcome-topbar"><span className="mobile-wordmark">ELECTRO<span>WORLD</span></span><span className="edition-label">FÍSICA II</span></header>
      <div className="welcome-copy">
        <p className="mobile-eyebrow">CURIOSIDAD EN MOVIMIENTO</p>
        <h1>Entiende<br />lo invisible<span>.</span></h1>
        <p className="welcome-subtitle">Tu laboratorio interactivo de Física II.<br />Un espacio para explorar a tu ritmo.</p>
      </div>
      <SplineHero />
      <div className="welcome-action">
        <p className="welcome-motto">Experimenta <span>/</span> Aprende <span>/</span> Juega</p>
        <button type="button" className="primary-mobile-button" onClick={onStart}>COMENZAR<MenuIcon name="arrow" /></button>
        <div className="welcome-bottom"><span>CIENCIA. EXPERIENCIA. DESCUBRIMIENTO.</span><span>01 — EW</span></div>
      </div>
    </div>
  </main>
}
