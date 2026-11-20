import MenuIcon from '../components/MenuIcon.jsx'
import MenuShell from '../components/MenuShell.jsx'

export default function MenuPrincipal({ onBack, onSimulators, onGames }) {
  return (
    <MenuShell title="ElectroWorld" onBack={onBack} backLabel="Volver al inicio">
      <button className="opcion-menu" type="button" onClick={onSimulators}>
        <MenuIcon name="flask" /> Simuladores
      </button>
      <button className="opcion-menu" type="button" onClick={onGames}>
        <MenuIcon name="game" /> Minijuego
      </button>
    </MenuShell>
  )
}
