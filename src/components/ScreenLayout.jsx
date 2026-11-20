export default function ScreenLayout({ title, description, onBack, backLabel, className = '', children }) {
  return (
    <main className={`mobile-screen ${className}`}>
      <div className="mobile-screen-inner">
        <header className="menu-encabezado">
          <h1>{title}</h1>
          <button type="button" className="boton-volver" onClick={onBack} aria-label={backLabel}>Volver</button>
        </header>
        {description && <p className="descripcion-pantalla">{description}</p>}
        {children}
      </div>
    </main>
  )
}
