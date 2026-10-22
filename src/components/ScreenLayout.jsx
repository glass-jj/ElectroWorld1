import MenuIcon from './MenuIcon.jsx'

export default function ScreenLayout({ title, description, onBack, backLabel = 'Volver al menú principal', eyebrow = 'FÍSICA II', className = '', children }) {
  return <main className={`mobile-screen ${className}`}>
    <div className="mobile-screen-inner">
      <header className="mobile-topbar">
        <button type="button" className="screen-back-button" onClick={onBack} aria-label={backLabel}><MenuIcon name="back" /></button>
        <span className="mobile-wordmark">ELECTRO<span>WORLD</span></span>
        <span className="edition-label">FÍSICA II</span>
      </header>
      <div className="mobile-screen-heading">
        <p className="mobile-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="mobile-description">{description}</p>}
      </div>
      {children}
      <footer className="mobile-screen-footer"><span>ELECTROWORLD</span><span>APRENDE EXPLORANDO</span></footer>
    </div>
  </main>
}
