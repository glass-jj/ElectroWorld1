import { Html } from '@react-three/drei'
import { usePlanarDrag } from './usePlanarDrag.js'

export default function TestPoint({ position, onMove, onDragChange }) {
  const startDrag = usePlanarDrag({ position, onMove, onDragChange })
  return <group position={position}>
    <mesh onPointerDown={startDrag} rotation={[0, 0, Math.PI / 4]}>
      <octahedronGeometry args={[0.23]} />
      <meshStandardMaterial color="#bbffed" emissive="#50edc0" emissiveIntensity={0.8} roughness={0.2} />
    </mesh>
    <Html center position={[0, 0.57, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[20, 0]}>
      <span className="probe-label">P · punto de prueba</span>
    </Html>
  </group>
}
