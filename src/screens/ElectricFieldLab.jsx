import { Component, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import ControlPanel from '../components/ControlPanel.jsx'
import LaboratoryScene from '../components/LaboratoryScene.jsx'
import { distance, MIN_DISTANCE, netForce, totalElectricField } from '../physics/electrostatics.js'
import MenuIcon from '../components/MenuIcon.jsx'
import './ElectricFieldLab.css'

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <div className="scene-error" role="alert">No se pudo iniciar la escena 3D. Activa WebGL en tu navegador y recarga la página. Los controles y los cálculos siguen disponibles.</div> : this.props.children
  }
}

export default function ElectricFieldLab({ lab, dispatch, onBack }) {
  const [dragging, setDragging] = useState(false)
  const [cameraResetKey, setCameraResetKey] = useState(0)
  const forces = useMemo(() => Object.fromEntries(lab.charges.map((charge) => [charge.id, netForce(charge, lab.charges)])), [lab.charges])
  const field = useMemo(() => totalElectricField(lab.probePosition, lab.charges), [lab.probePosition, lab.charges])
  const nearCharges = lab.charges.some((charge, index) => lab.charges.slice(index + 1).some((other) => distance(charge.position, other.position) < MIN_DISTANCE))
  const probeNearCharge = lab.charges.some((charge) => distance(lab.probePosition, charge.position) < MIN_DISTANCE)

  return <div className="electric-field-lab">
    <header className="app-header">
      <div className="lab-heading"><button type="button" className="lab-back-button" onClick={onBack} aria-label="Volver a simuladores"><MenuIcon name="back" /></button><div className="brand"><div><h1>Campo eléctrico</h1><p>ELECTROWORLD · FÍSICA II</p></div></div></div>
      <div className="header-status"><i /><span>Laboratorio interactivo</span><span className="header-version">01 / COULOMB</span></div>
    </header>
    <div className="laboratory-layout">
      <ControlPanel lab={lab} dispatch={dispatch} forces={forces} field={field} nearCharges={nearCharges} probeNearCharge={probeNearCharge} />
      <main className="scene-container" aria-label="Laboratorio 3D de cargas eléctricas">
        <div className="scene-heading"><div><span className="eyebrow">EXPLORACIÓN LIBRE</span><h2>Todo empieza con una carga.</h2><p>Añade, mueve y observa cómo interactúan.</p></div><button className="camera-button" onClick={() => setCameraResetKey((key) => key + 1)}>Vista XY ↗</button></div>
        <div className="canvas-container">
          <SceneBoundary key={cameraResetKey}>
            <Canvas key={cameraResetKey} camera={{ position: [0, 0, 20], fov: 50, near: 0.1, far: 100 }} dpr={[1, 1.5]} frameloop="demand" onPointerMissed={() => dispatch({ type: 'select', id: null })}>
              <LaboratoryScene lab={lab} dispatch={dispatch} forces={forces} field={field} onDragChange={setDragging} cameraResetKey={cameraResetKey} />
            </Canvas>
          </SceneBoundary>
        </div>
        <div className="scene-axis" aria-hidden="true"><span>↑ Y</span><span>→ X</span><small>m</small></div>
        <div className="scene-footer"><div className="interaction-help"><span className={dragging ? 'drag-active' : ''}>{dragging ? '● Moviendo sobre XY' : '↔ Arrastra las cargas o el punto P'}</span><span>Fondo: orbitar · Rueda: zoom · Clic derecho: mover</span></div><div className="scene-legend"><span><i className="legend-dot force" />Fuerza</span><span><i className="legend-dot probe" />Campo en P</span></div></div>
      </main>
    </div>
  </div>
}
