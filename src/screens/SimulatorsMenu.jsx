import MenuCard from '../components/MenuCard.jsx'
import ScreenLayout from '../components/ScreenLayout.jsx'

export default function SimulatorsMenu({ onBack, onElectricField, onOhmsLaw }) {
  return <ScreenLayout title="Observa. Ajusta. Comprende." description="Dos laboratorios para acercarte a la física." onBack={onBack} eyebrow="SIMULADORES" className="simulators-screen">
    <div className="menu-card-list">
      <MenuCard title="Campo eléctrico" description="Explora la interacción entre cargas, fuerzas y campos." icon="atom" index="01" meta="Electrostática · 3D" onClick={onElectricField} />
      <MenuCard title="Ley de Ohm" description="Encuentra el equilibrio entre voltaje, resistencia y corriente." icon="bolt" index="02" meta="Circuitos · Interactivo" accent="amber" onClick={onOhmsLaw} />
    </div>
    <section className="upcoming-simulators" aria-label="Próximos simuladores"><p className="mobile-eyebrow">EN EL HORIZONTE</p><div className="upcoming-list"><MenuCard title="Ley de Gauss" icon="atom" comingSoon /><MenuCard title="Magnetismo" icon="magnet" comingSoon /></div></section>
  </ScreenLayout>
}
