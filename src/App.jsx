import { lazy, Suspense, useEffect, useReducer, useRef, useState } from 'react'
import WelcomeScreen from './screens/WelcomeScreen.jsx'
import MainMenu from './screens/MainMenu.jsx'
import SimulatorsMenu from './screens/SimulatorsMenu.jsx'
import GamesMenu from './screens/GamesMenu.jsx'
import OhmsLawLab from './screens/OhmsLawLab.jsx'
import ScreenLayout from './components/ScreenLayout.jsx'
import { createInitialLab, labReducer } from './lab/laboratory.js'
import './App.css'

// Load Three.js only when the electric field laboratory is opened.
const ElectricFieldLab = lazy(() => import('./screens/ElectricFieldLab.jsx'))
const SCREEN_TITLES = {
  welcome: 'Bienvenida',
  'main-menu': 'Menú principal',
  simulators: 'Simuladores',
  games: 'Minijuegos',
  'electric-field': 'Campo eléctrico',
  'ohms-law': 'Ley de Ohm',
}

export default function App() {
  const [screen, setScreen] = useState('welcome')
  // Keep the laboratory data when its canvas is unmounted on another screen.
  const [lab, dispatch] = useReducer(labReducer, undefined, createInitialLab)
  const screenRef = useRef(null)
  useEffect(() => {
    document.title = `ElectroWorld · ${SCREEN_TITLES[screen]}`
    window.scrollTo(0, 0)
    screenRef.current?.focus({ preventScroll: true })
  }, [screen])
  const openSimulators = () => setScreen('simulators')
  let content
  switch (screen) {
    case 'main-menu':
      content = <MainMenu onBack={() => setScreen('welcome')} onSimulators={openSimulators} onGames={() => setScreen('games')} />
      break
    case 'simulators':
      content = <SimulatorsMenu onBack={() => setScreen('main-menu')} onElectricField={() => setScreen('electric-field')} onOhmsLaw={() => setScreen('ohms-law')} />
      break
    case 'games':
      content = <GamesMenu onBack={() => setScreen('main-menu')} onSimulators={openSimulators} />
      break
    case 'electric-field':
      content = <Suspense fallback={<ScreenLayout title="Campo eléctrico" onBack={openSimulators} backLabel="Volver a simuladores"><p className="screen-loading" role="status">Abriendo laboratorio…</p></ScreenLayout>}>
        <ElectricFieldLab lab={lab} dispatch={dispatch} onBack={openSimulators} />
      </Suspense>
      break
    case 'ohms-law':
      content = <OhmsLawLab onBack={openSimulators} />
      break
    default:
      content = <WelcomeScreen onStart={() => setScreen('main-menu')} />
  }
  return <div className="screen-host" ref={screenRef} tabIndex={-1} aria-label={SCREEN_TITLES[screen]}>{content}</div>
}
