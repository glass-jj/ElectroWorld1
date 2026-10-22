import MenuCard from '../components/MenuCard.jsx'
import ScreenLayout from '../components/ScreenLayout.jsx'

export default function MainMenu({ onBack, onSimulators, onGames }) {
  return <ScreenLayout title="Tu curiosidad. Tu laboratorio." description="Elige una forma de descubrir cómo funciona el mundo." onBack={onBack} backLabel="Volver a la bienvenida" eyebrow="BIENVENIDO A ELECTROWORLD" className="dashboard-screen">
    <div className="dashboard-intro"><span>EXPLORAR</span><span>02 EXPERIENCIAS</span></div>
    <div className="menu-card-list main-menu-cards">
      <MenuCard title="Simuladores" description="Cambia una variable. Descubre lo que sucede." icon="flask" index="01" meta="2 laboratorios interactivos" onClick={onSimulators} />
      <MenuCard title="Minijuegos" description="Reflejos, precisión y una dosis de física." icon="game" index="02" meta="3 desafíos para superarte" accent="violet" onClick={onGames} />
    </div>
    <p className="dashboard-note">Sin prisa para aprender.<br /><span>Con espacio para experimentar.</span></p>
  </ScreenLayout>
}
