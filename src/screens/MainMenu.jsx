import MenuCard from '../components/MenuCard.jsx'
import ScreenLayout from '../components/ScreenLayout.jsx'

export default function MainMenu({ onBack, onSimulators, onGames }) {
  return <ScreenLayout title="¿Qué quieres hacer?" description="Elige tu forma de explorar la física." onBack={onBack} backLabel="Volver a la bienvenida" eyebrow="TU LABORATORIO">
    <div className="menu-card-list main-menu-cards">
      <MenuCard title="SIMULADORES" description="Experimenta con fenómenos físicos." icon="flask" onClick={onSimulators} />
      <MenuCard title="MINIJUEGOS" description="Aprende resolviendo desafíos." icon="game" accent="violet" onClick={onGames} />
    </div>
  </ScreenLayout>
}
