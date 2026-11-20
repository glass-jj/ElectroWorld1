import MenuIcon from '../components/MenuIcon.jsx'
import MenuShell from '../components/MenuShell.jsx'

export default function MenuJuegos({ onBack, onPlay }) {
  return (
    <MenuShell title="Minijuego" onBack={onBack} backLabel="Volver al menú principal">
      <button className="opcion-menu" type="button" onClick={onPlay}>
        <MenuIcon name="game" /> Choque de Cargas
      </button>
    </MenuShell>
  )
}
