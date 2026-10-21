import MenuIcon from './MenuIcon.jsx'

export default function ScreenLayout({ title, description, onBack, backLabel = 'Volver al menú principal', eyebrow = 'FÍSICA II', children }) {
  return <main className="mobile-screen">
    <div className="mobile-screen-inner">
      <header className="mobile-topbar">
        <button type="button" className="screen-back-button" onClick={onBack} aria-label={backLabel}><MenuIcon name="back" /></button>
        <span className="mobile-wordmark">ELECTRO<span>WORLD</span></span>
        <span className="topbar-spark" aria-hidden="true"><MenuIcon name="bolt" /></span>
      </header>
      <div className="mobile-screen-heading">
        <p className="mobile-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="mobile-description">{description}</p>}
      </div>
      {children}
      <footer className="mobile-screen-footer"><span className="footer-dot" />Un universo por descubrir.</footer>
    </div>
  </main>
}
