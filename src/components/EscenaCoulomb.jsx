import { useMemo } from 'react'
import { OrbitControls } from '@react-three/drei'
import Carga from './Carga.jsx'
import VectorFuerza from './VectorFuerza.jsx'
import LineaDistancia from './LineaDistancia.jsx'
import PuntoPrueba from './PuntoPrueba.jsx'
import VectorCampo from './VectorCampo.jsx'
import CuadriculaCampo from './CuadriculaCampo.jsx'

function ReferencePlane() {
  const vertices = useMemo(() => {
    const points = []
    for (let i = -10; i <= 10; i++) points.push(-10, i, -0.4, 10, i, -0.4, i, -10, -0.4, i, 10, -0.4)
    return new Float32Array(points)
  }, [])
  return <group>
    <lineSegments>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[vertices, 3]} /></bufferGeometry>
      <lineBasicMaterial color="#193044" transparent opacity={0.65} />
    </lineSegments>
    <mesh position={[0, 0, -0.42]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial color="#07101c" side={2} />
    </mesh>
  </group>
}

export default function EscenaCoulomb({ lab, dispatch, forces, field, onDragChange, cameraResetKey }) {
  const pair = lab.charges.slice(0, 2)
  return <>
    <color attach="background" args={['#050c16']} />
    <ambientLight intensity={1.1} />
    <directionalLight position={[3, 5, 8]} intensity={2} />
    <ReferencePlane />
    {lab.visibility.field && <CuadriculaCampo charges={lab.charges} />}
    {lab.visibility.distances && pair.length === 2 && <LineaDistancia start={pair[0].position} end={pair[1].position} />}
    {lab.charges.map((charge) => <group key={charge.id}>
      <Carga charge={charge} selected={charge.id === lab.selectedId}
        onSelect={() => dispatch({ type: 'select', id: charge.id })}
        onMove={(position) => dispatch({ type: 'update', id: charge.id, position })} onDragChange={onDragChange} />
      {lab.visibility.forces && <VectorFuerza position={charge.position} vector={forces[charge.id]} />}
    </group>)}
    {lab.visibility.probe && <>
      <PuntoPrueba position={lab.probePosition} onMove={(position) => dispatch({ type: 'probe', position })} onDragChange={onDragChange} />
      <VectorCampo position={lab.probePosition} vector={field} />
    </>}
    <OrbitControls key={cameraResetKey} makeDefault minDistance={4} maxDistance={50}
      minPolarAngle={0.08} maxPolarAngle={Math.PI - 0.08} />
  </>
}
