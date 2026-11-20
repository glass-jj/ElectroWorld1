export default function Inicio({ onStart }) {
  return (
    <main className="welcome-screen menu-theme">
      <div className="inicio">
        <h1>ElectroWorld</h1>
        <p>Simulador de Física II</p>
        <button type="button" className="figma-start-button" onClick={onStart}>Iniciar</button>
      </div>
    </main>
  )
}
