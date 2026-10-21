import MenuCard from '../components/MenuCard.jsx'
import ScreenLayout from '../components/ScreenLayout.jsx'

export default function SimulatorsMenu({ onBack, onElectricField, onOhmsLaw }) {
  return <ScreenLayout title="Simuladores" description="Un fenómeno. Muchas posibilidades." onBack={onBack} eyebrow="EXPERIMENTA">
    <div className="menu-card-list">
      <MenuCard title="CAMPO ELÉCTRICO" description="Explora cargas, fuerzas y campos eléctricos." icon="atom" onClick={onElectricField} />
      <MenuCard title="LEY DE OHM" description="Experimenta con voltaje, corriente y resistencia." icon="bolt" accent="amber" onClick={onOhmsLaw} />
    </div>
    <section className="upcoming-simulators" aria-label="Próximos simuladores">
      <p className="mobile-eyebrow">NUEVOS HORIZONTES</p>
      <div className="menu-card-list">
        <MenuCard title="LEY DE GAUSS" icon="atom" comingSoon />
        <MenuCard title="MAGNETISMO" icon="magnet" comingSoon />
      </div>
    </section>
  </ScreenLayout>
}
