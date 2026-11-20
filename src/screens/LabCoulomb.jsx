import { Component, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import ControlesCoulomb from '../components/ControlesCoulomb.jsx'
import EscenaCoulomb from '../components/EscenaCoulomb.jsx'
import { distance as distancia, MIN_DISTANCE, netForce as calcularFuerzaResultante, totalElectricField as calcularCampoTotal } from '../physics/electrostatics.js'
import './LabCoulomb.css'

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <div className="scene-error" role="alert">Escena 3D no disponible. Los controles y las lecturas siguen activos.</div> : this.props.children
  }
}

export default function LabCoulomb({ lab, dispatch, onBack }) {
  const [arrastrando, cambiarArrastre] = useState(false)
  const [cameraResetKey, setCameraResetKey] = useState(0)
  const fuerzas = useMemo(() => Object.fromEntries(lab.charges.map((carga) => [carga.id, calcularFuerzaResultante(carga, lab.charges)])), [lab.charges])
  const campo = useMemo(() => calcularCampoTotal(lab.probePosition, lab.charges), [lab.probePosition, lab.charges])
  const nearCharges = lab.charges.some((carga, index) => lab.charges.slice(index + 1).some((other) => distancia(carga.position, other.position) < MIN_DISTANCE))
  const probeNearCharge = lab.charges.some((carga) => distancia(lab.probePosition, carga.position) < MIN_DISTANCE)

  return <div className="electric-field-lab">
    <header className="app-header">
      <div className="brand"><h1>Lab Coulomb</h1></div>
      <button type="button" className="boton-volver" onClick={onBack} aria-label="Volver a simuladores">Volver</button>
    </header>
    <div className="laboratory-layout">
      <ControlesCoulomb lab={lab} dispatch={dispatch} fuerzas={fuerzas} campo={campo} nearCharges={nearCharges} probeNearCharge={probeNearCharge} />
      <main className="scene-container" aria-label="Laboratorio 3D de cargas eléctricas">
        <div className="scene-heading"><button type="button" className="camera-button" onClick={() => setCameraResetKey((key) => key + 1)}>Vista XY</button></div>
        <div className="canvas-container">
          <SceneBoundary key={cameraResetKey}>
            <Canvas key={cameraResetKey} camera={{ position: [0, 0, 20], fov: 50, near: 0.1, far: 100 }} dpr={[1, 1.5]} frameloop="demand" onPointerMissed={() => dispatch({ type: 'select', id: null })}>
              <EscenaCoulomb lab={lab} dispatch={dispatch} forces={fuerzas} field={campo} onDragChange={cambiarArrastre} cameraResetKey={cameraResetKey} />
            </Canvas>
          </SceneBoundary>
        </div>
        <div className="scene-axis" aria-hidden="true"><span>↑ Y</span><span>→ X</span><small>m</small></div>
        <div className="scene-footer"><div className="interaction-help"><span className={arrastrando ? 'drag-active' : ''}>{arrastrando ? 'Moviendo sobre XY' : 'Arrastra cargas o el punto P'}</span></div><div className="scene-legend"><span><i className="legend-dot force" />Fuerza</span><span><i className="legend-dot probe" />Campo en P</span></div></div>
      </main>
    </div>
  </div>
}
