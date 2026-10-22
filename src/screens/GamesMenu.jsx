import MenuIcon from '../components/MenuIcon.jsx'
import ScreenLayout from '../components/ScreenLayout.jsx'
import '../games/Games.css'

const GAMES = [
  { id: 'charge-clash', title: 'CARGA CLASH', icon: 'atom', description: '¿Se atraen o se repelen? Acierta y encadena tu racha.' },
  { id: 'power-up', title: 'POWER UP', icon: 'bolt', description: 'Ajusta el circuito y enciende cinco victorias.' },
  { id: 'coulomb-shot', title: 'COULOMB SHOT', icon: 'arrow', description: 'Carga, apunta y lanza. ¡Aterriza en la zona!' },
]

export default function GamesMenu({ onBack, onPlay, highScores }) {
  return <ScreenLayout title="Minijuegos" description="Partidas cortas. Mucha energía. ¿Cuál juegas?" onBack={onBack} eyebrow="APRENDE Y JUEGA" className="interactive-screen">
    <div className="games-catalog">
      {GAMES.map((game) => <article className={`game-menu-card game-menu-card--${game.id}`} key={game.id}>
        <div className="game-card-heading"><span className="menu-card-icon"><MenuIcon name={game.icon} /></span><h2>{game.title}</h2></div>
        <p>{game.description}</p>
        <div className="game-card-bottom"><span className="game-record">Récord de sesión<strong>{highScores[game.id]} pts</strong></span><button type="button" className="game-play-button" onClick={() => onPlay(game.id)} aria-label={`Jugar ${game.title}`}>JUGAR<MenuIcon name="arrow" /></button></div>
      </article>)}
    </div>
  </ScreenLayout>
}
