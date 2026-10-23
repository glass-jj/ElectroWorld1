import MenuShell from '../components/MenuShell.jsx'
import FigmaAsset from '../components/FigmaAsset.jsx'

const GAMES = [
  { id: 'charge-clash', title: 'Carga Clash', category: 'ATRACCIÓN Y REPULSIÓN', artwork: 'clash-preview', accent: 'cyan', description: 'Elige polaridad y captura la carga en el momento justo.', detail: '45 s · 3 vidas' },
  { id: 'power-up', title: 'Power Up', category: 'POTENCIA ELÉCTRICA', artwork: 'power-preview', accent: 'amber', description: 'Mantén para cargar y suelta en la corriente justa.', detail: '5 misiones' },
  { id: 'coulomb-shot', title: 'Coulomb Shot', category: 'FUERZA DE COULOMB', artwork: 'shot-preview', accent: 'violet', description: 'Ajusta la carga y lanza hacia el objetivo móvil.', detail: '5 rondas' },
]

export default function GamesMenu({ onBack, onPlay, highScores, onSimulators }) {
  return <MenuShell title="Minijuegos" section="games" onBack={onBack} onHome={onBack} onSimulators={onSimulators} onGames={() => {}} className="figma-games-menu">
    <div className="figma-heading"><h1>La intuición<br />también se entrena.</h1><p className="figma-introduction">Tres formas de jugar con lo que aprendes.</p></div>
    <div className="figma-games-catalog">{GAMES.map((game) => <button type="button" className={`figma-card figma-game-card figma-card--${game.accent} game-menu-card--${game.id}`} key={game.id} onClick={() => onPlay(game.id)} aria-label={`Jugar ${game.title}`}>
      <span className="figma-game-copy"><span className="figma-kicker">{game.category}</span><span className="figma-game-title">{game.title}</span><span className="figma-card-description">{game.description}</span><span className="figma-game-meta">{game.detail} · Récord <strong>{highScores[game.id]}</strong></span></span>
      <span className="figma-game-art"><FigmaAsset name={game.artwork} /></span>
    </button>)}</div>
    <p className="figma-menu-tip"><FigmaAsset name="bulb" /><span>Experimentar también es equivocarse. Cada intento te enseña algo.</span></p>
  </MenuShell>
}
