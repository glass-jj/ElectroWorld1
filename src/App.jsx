import { lazy, Suspense, useEffect, useReducer, useRef, useState } from 'react'
import Inicio from './screens/Inicio.jsx'
import MenuPrincipal from './screens/MenuPrincipal.jsx'
import MenuSimuladores from './screens/MenuSimuladores.jsx'
import MenuJuegos from './screens/MenuJuegos.jsx'
import LabOhm from './screens/LabOhm.jsx'
import ScreenLayout from './components/ScreenLayout.jsx'
import ChoqueCargas from './games/ChoqueCargas.jsx'
import { createInitialLab, labReducer } from './lab/laboratory.js'
import './App.css'
import './styles/MenuTheme.css'

// Carga la escena 3D al abrir el laboratorio.
const LabCoulomb = lazy(() => import('./screens/LabCoulomb.jsx'))
const TITULOS_PANTALLA = {
  welcome: 'Inicio',
  'main-menu': 'Menú principal',
  simulators: 'Simuladores',
  games: 'Minijuego',
  'charge-clash': 'Choque de Cargas',
  'electric-field': 'Lab Coulomb',
  'ohms-law': 'Ley de Ohm',
}

export default function App() {
  const [pantalla, cambiarPantalla] = useState('welcome')
  // Conserva las cargas al salir del laboratorio.
  const [lab, dispatch] = useReducer(labReducer, undefined, createInitialLab)
  const pantallaRef = useRef(null)
  useEffect(() => {
    document.title = `ElectroWorld · ${TITULOS_PANTALLA[pantalla]}`
    window.scrollTo(0, 0)
    pantallaRef.current?.focus({ preventScroll: true })
  }, [pantalla])
  const abrirSimuladores = () => cambiarPantalla('simulators')
  const abrirMinijuego = () => cambiarPantalla('games')
  let contenido
  switch (pantalla) {
    case 'main-menu':
      contenido = <MenuPrincipal onBack={() => cambiarPantalla('welcome')} onSimulators={abrirSimuladores} onGames={abrirMinijuego} />
      break
    case 'simulators':
      contenido = <MenuSimuladores onBack={() => cambiarPantalla('main-menu')} onElectricField={() => cambiarPantalla('electric-field')} onOhmsLaw={() => cambiarPantalla('ohms-law')} />
      break
    case 'games':
      contenido = <MenuJuegos onBack={() => cambiarPantalla('main-menu')} onPlay={() => cambiarPantalla('charge-clash')} />
      break
    case 'charge-clash':
      contenido = <ChoqueCargas onBack={abrirMinijuego} />
      break
    case 'electric-field':
      contenido = <Suspense fallback={<ScreenLayout title="Lab Coulomb" onBack={abrirSimuladores} backLabel="Volver a simuladores"><p className="screen-loading" role="status">Abriendo laboratorio…</p></ScreenLayout>}>
        <LabCoulomb lab={lab} dispatch={dispatch} onBack={abrirSimuladores} />
      </Suspense>
      break
    case 'ohms-law':
      contenido = <LabOhm onBack={abrirSimuladores} />
      break
    default:
      contenido = <Inicio onStart={() => cambiarPantalla('main-menu')} />
  }
  return <div className="screen-host" ref={pantallaRef} tabIndex={-1} aria-label={TITULOS_PANTALLA[pantalla]}>{contenido}</div>
}
