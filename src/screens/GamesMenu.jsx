import MenuIcon from '../components/MenuIcon.jsx'
import ScreenLayout from '../components/ScreenLayout.jsx'

export default function GamesMenu({ onBack, onSimulators }) {
  return <ScreenLayout title="Minijuegos" description="Aprende resolviendo desafíos." onBack={onBack} eyebrow="APRENDE Y JUEGA">
    <section className="preview-panel preview-panel--violet" aria-label="Minijuegos próximamente">
      <span className="preview-icon"><MenuIcon name="game" /></span>
      <span className="coming-soon-badge">Próximamente</span>
      <h2>El siguiente desafío está por llegar.</h2>
      <p>Aquí encontrarás los futuros minijuegos de Física II. Mientras tanto, explora el laboratorio.</p>
    </section>
    <button type="button" className="secondary-mobile-button" onClick={onSimulators}>Explorar simuladores<MenuIcon name="arrow" /></button>
  </ScreenLayout>
}
