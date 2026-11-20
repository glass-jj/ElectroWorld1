import MenuIcon from '../components/MenuIcon.jsx'
import MenuShell from '../components/MenuShell.jsx'

export default function MenuSimuladores({ onBack, onElectricField, onOhmsLaw }) {
  return (
    <MenuShell title="Simuladores" onBack={onBack} backLabel="Volver al menú principal">
      <button className="opcion-menu" type="button" onClick={onElectricField}>
        <MenuIcon name="atom" /> Campo Eléctrico
      </button>
      <button className="opcion-menu" type="button" onClick={onOhmsLaw}>
        <MenuIcon name="bolt" /> Ley de Ohm
      </button>
    </MenuShell>
  )
}
