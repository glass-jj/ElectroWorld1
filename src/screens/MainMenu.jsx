import MenuCard from '../components/MenuCard.jsx'
import MenuShell from '../components/MenuShell.jsx'
import FigmaAsset from '../components/FigmaAsset.jsx'

export default function MainMenu({ onBack, onSimulators, onGames, onOhmsLaw }) {
  return <MenuShell title="ELECTROWORLD" section="home" onBack={onBack} backLabel="Volver a la bienvenida" onHome={() => {}} onSimulators={onSimulators} onGames={onGames} className="figma-dashboard">
    <div className="figma-heading"><p className="figma-kicker">APRENDER ES EXPLORAR</p><h1>Explora lo<br />invisible.</h1><p className="figma-introduction">Tu siguiente descubrimiento empieza aquí.</p></div>
    <MenuCard title="Simuladores" description="Cambia una variable. Descubre una ley." category="2 laboratorios" artwork="dashboard-field" variant="feature" onClick={onSimulators} />
    <button className="figma-card figma-games-access" type="button" onClick={onGames}><span><span className="figma-kicker">3 RETOS · UNA NUEVA PERSPECTIVA</span><span className="figma-card-title">Minijuegos</span><span className="figma-card-description">Pon a prueba tu intuición<br />con cada partida.</span></span><FigmaAsset name="game-large" /></button>
    <section className="figma-suggested" aria-label="Experimento sugerido"><h2>EXPERIMENTO SUGERIDO</h2><button type="button" onClick={onOhmsLaw}><FigmaAsset name="bolt" /><span><strong>Ley de Ohm</strong><span>12 V · 6 Ω · 2 A</span></span><FigmaAsset name="arrow-right-light" /></button></section>
    <div className="figma-exploration"><div><p>Tu curiosidad, en marcha</p><p>2 laboratorios · 3 minijuegos para explorar</p></div><span className="figma-exploration-bars" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</span></div>
  </MenuShell>
}
