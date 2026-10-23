import { useId, useRef } from 'react'
import FigmaAsset from './FigmaAsset.jsx'

export default function MenuShell({ section, title, onBack, backLabel = 'Volver al menú principal', onHome, onSimulators, onGames, children, className = '' }) {
  const infoRef = useRef(null)
  const infoId = useId()
  const isHome = section === 'home'
  const destinations = [
    { id: 'home', label: 'Inicio', icon: 'home', onClick: onHome },
    { id: 'simulators', label: 'Simuladores', icon: 'orbit', onClick: onSimulators },
    { id: 'games', label: 'Minijuegos', icon: 'game', onClick: onGames },
  ]
  return <main className={`menu-theme figma-screen ${className}`}>
    <div className="figma-screen-inner">
      <header className="figma-header">
        <button className="figma-header-button figma-back" type="button" onClick={onBack} aria-label={backLabel}><FigmaAsset name={isHome ? 'orbit-main' : 'back'} /></button>
        <div className="figma-header-identity"><span>{isHome ? 'LABORATORIO INTERACTIVO' : `ELECTROWORLD / ${section === 'games' ? 'DESAFIAR' : 'EXPLORAR'}`}</span><p>{title}</p></div>
        <button className="figma-header-button" type="button" onClick={() => infoRef.current.showModal()} aria-label="Información de ElectroWorld" aria-haspopup="dialog" aria-controls={infoId}><FigmaAsset name={isHome ? 'user' : 'help'} /></button>
      </header>
      <div className="figma-menu-content">{children}</div>
      <nav className="figma-bottom-nav" aria-label="Navegación principal">{destinations.map((destination) => {
        const active = destination.id === section
        return <button key={destination.id} type="button" onClick={destination.onClick} aria-current={active ? 'page' : undefined}>
          <span className="figma-nav-icon"><FigmaAsset name={`${destination.icon}${active ? '-active' : ''}`} /></span><span>{destination.label}</span>
        </button>
      })}</nav>
    </div>
    <dialog className="figma-info" id={infoId} ref={infoRef} aria-labelledby={`${infoId}-title`}>
      <h2 id={`${infoId}-title`}>Tu laboratorio de Física II</h2>
      <p>Explora Campo eléctrico y Ley de Ohm, o prueba tus reflejos y precisión en tres minijuegos. Puedes empezar sin crear una cuenta.</p>
      <p>Los récords se guardan durante esta sesión y se borran al recargar la aplicación.</p>
      <form method="dialog"><button className="figma-start-button" autoFocus>ENTENDIDO</button></form>
    </dialog>
  </main>
}
