import MenuIcon from '../components/MenuIcon.jsx'
import ScreenLayout from '../components/ScreenLayout.jsx'
import MenuPreview from '../components/MenuPreview.jsx'
import '../games/Games.css'

const GAMES = [
  { id: 'charge-clash', title: 'Carga Clash', icon: 'atom', scene: 'clash', style: 'Reflejos', description: 'Cambia tu polaridad. Captura la carga en el instante preciso.' },
  { id: 'power-up', title: 'Power Up', icon: 'bolt', scene: 'power', style: 'Precisión', description: 'Mantén, carga y suelta. Encuentra el punto de energía perfecta.' },
  { id: 'coulomb-shot', title: 'Coulomb Shot', icon: 'arrow', scene: 'shot', style: 'Puntería', description: 'Una zona móvil, tres tiros. Alinea la carga y consigue el impacto.' },
]

export default function GamesMenu({ onBack, onPlay, highScores }) {
  return <ScreenLayout title="Un poco de física. Mucho instinto." description="Tres formas de poner a prueba tus reflejos y tu precisión." onBack={onBack} eyebrow="MINIJUEGOS" className="interactive-screen games-menu-screen menu-theme">
    <div className="games-catalog">{GAMES.map((game) => <article className={`game-menu-card game-menu-card--${game.id}`} key={game.id}>
      <MenuPreview scene={game.scene} />
      <div className="game-card-heading"><span className="menu-card-icon"><MenuIcon name={game.icon} /></span><div><span className="game-style-tag">{game.style}</span><h2>{game.title}</h2></div></div>
      <p>{game.description}</p>
      <div className="game-card-bottom"><span className="game-record">Tu mejor partida<strong>{highScores[game.id]} pts</strong></span><button type="button" className="game-play-button" onClick={() => onPlay(game.id)} aria-label={`Jugar ${game.title}`}>JUGAR<MenuIcon name="arrow" /></button></div>
    </article>)}</div>
  </ScreenLayout>
}
