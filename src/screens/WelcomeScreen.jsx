import MenuIcon from '../components/MenuIcon.jsx'

export default function WelcomeScreen({ onStart }) {
  return <main className="welcome-screen">
    <div className="welcome-inner">
      <p className="welcome-eyebrow"><span className="footer-dot" />FÍSICA II · LABORATORIO MÓVIL</p>
      <div className="welcome-illustration" aria-hidden="true">
        <div className="orbital-ring orbital-ring--one" />
        <div className="orbital-ring orbital-ring--two" />
        <div className="orbital-ring orbital-ring--three" />
        <div className="orbital-core"><MenuIcon name="bolt" /></div>
        <span className="orbital-particle orbital-particle--one" />
        <span className="orbital-particle orbital-particle--two" />
        <span className="orbital-plus">+</span><span className="orbital-minus">−</span>
      </div>
      <div className="welcome-copy">
        <h1>ELECTRO<span>WORLD</span></h1>
        <p className="welcome-subtitle">Laboratorio interactivo de Física II</p>
        <p className="welcome-motto">Experimenta <span>·</span> Aprende <span>·</span> Juega</p>
      </div>
      <div className="welcome-action">
        <button type="button" className="primary-mobile-button" onClick={onStart}>COMENZAR<MenuIcon name="arrow" /></button>
        <p>La física, en tus manos.</p>
      </div>
    </div>
  </main>
}
