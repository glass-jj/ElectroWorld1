import FigmaAsset from '../components/FigmaAsset.jsx'
import SplineHero from '../components/SplineHero.jsx'

export default function WelcomeScreen({ onStart }) {
  return <main className="welcome-screen menu-theme figma-welcome">
    <div className="figma-welcome-inner">
      <header className="figma-welcome-brand"><span><FigmaAsset name="orbit-brand" />ELECTROWORLD</span><span>FÍSICA II</span></header>
      <SplineHero poster={<FigmaAsset name="welcome-instrument" />} />
      <div className="figma-welcome-copy">
        <p className="figma-kicker">OBSERVA · EXPERIMENTA · COMPRENDE</p>
        <h1>La física, en<br />tus manos.</h1>
        <p className="figma-introduction">Un laboratorio para explorar lo invisible.<br />Simula, juega y descubre cómo funciona.</p>
      </div>
      <div className="figma-welcome-action">
        <button type="button" className="figma-start-button" onClick={onStart}>Comenzar a explorar<FigmaAsset name="arrow-right" /></button>
        <p>Sin cuenta · A tu ritmo · Desde el primer experimento</p>
      </div>
    </div>
  </main>
}
