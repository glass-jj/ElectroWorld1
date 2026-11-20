export default function MenuShell({ title, onBack, backLabel, children }) {
  return (
    <main className="menu-theme figma-screen">
      <div className="figma-screen-inner">
        <header className="menu-encabezado">
          <h1>{title}</h1>
          <button type="button" className="boton-volver" onClick={onBack} aria-label={backLabel}>Volver</button>
        </header>
        <div className="figma-menu-content">{children}</div>
      </div>
    </main>
  )
}
