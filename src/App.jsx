import { lazy, Suspense, useEffect, useReducer, useRef, useState } from 'react'
import WelcomeScreen from './screens/WelcomeScreen.jsx'
import MainMenu from './screens/MainMenu.jsx'
import SimulatorsMenu from './screens/SimulatorsMenu.jsx'
import GamesMenu from './screens/GamesMenu.jsx'
import OhmsLawLab from './screens/OhmsLawLab.jsx'
import ScreenLayout from './components/ScreenLayout.jsx'
import ChargeClash from './games/ChargeClash.jsx'
import PowerUp from './games/PowerUp.jsx'
import CoulombShot from './games/CoulombShot.jsx'
import { createInitialLab, labReducer } from './lab/laboratory.js'
import './App.css'
import './styles/MenuTheme.css'

// Load Three.js only when the electric field laboratory is opened.
const ElectricFieldLab = lazy(() => import('./screens/ElectricFieldLab.jsx'))
const SCREEN_TITLES = {
  welcome: 'Bienvenida',
  'main-menu': 'Menú principal',
  simulators: 'Simuladores',
  games: 'Minijuegos',
  'charge-clash': 'Carga Clash',
  'power-up': 'Power Up',
  'coulomb-shot': 'Coulomb Shot',
  'electric-field': 'Campo eléctrico',
  'ohms-law': 'Ley de Ohm',
}

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [highScores, setHighScores] = useState({ 'charge-clash': 0, 'power-up': 0, 'coulomb-shot': 0 })
  // Keep the laboratory data when its canvas is unmounted on another screen.
  const [lab, dispatch] = useReducer(labReducer, undefined, createInitialLab)
  const screenRef = useRef(null)
  useEffect(() => {
    document.title = `ElectroWorld · ${SCREEN_TITLES[screen]}`
    window.scrollTo(0, 0)
    screenRef.current?.focus({ preventScroll: true })
  }, [screen])
  const openSimulators = () => setScreen('simulators')
  const openGames = () => setScreen('games')
  const recordScore = (game, score) => setHighScores((previous) => ({ ...previous, [game]: Math.max(previous[game], score) }))
  let content
  switch (screen) {
    case 'main-menu':
      content = <MainMenu onBack={() => setScreen('welcome')} onSimulators={openSimulators} onGames={openGames} onOhmsLaw={() => setScreen('ohms-law')} />
      break
    case 'simulators':
      content = <SimulatorsMenu onBack={() => setScreen('main-menu')} onElectricField={() => setScreen('electric-field')} onOhmsLaw={() => setScreen('ohms-law')} onGames={openGames} />
      break
    case 'games':
      content = <GamesMenu onBack={() => setScreen('main-menu')} onPlay={setScreen} highScores={highScores} onSimulators={openSimulators} />
      break
    case 'charge-clash':
      content = <ChargeClash onBack={openGames} onRecord={(score) => recordScore('charge-clash', score)} />
      break
    case 'power-up':
      content = <PowerUp onBack={openGames} onRecord={(score) => recordScore('power-up', score)} />
      break
    case 'coulomb-shot':
      content = <CoulombShot onBack={openGames} onRecord={(score) => recordScore('coulomb-shot', score)} />
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
