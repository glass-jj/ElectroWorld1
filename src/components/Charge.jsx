import { Html } from '@react-three/drei'
import { formatCharge, getChargeColor } from '../lab/visuals.js'
import { usePlanarDrag } from './usePlanarDrag.js'

export default function Charge({ charge, selected, onSelect, onMove, onDragChange }) {
  const color = getChargeColor(charge.value)
  const startDrag = usePlanarDrag({ position: charge.position, onSelect, onMove, onDragChange })
  return (
    <group position={charge.position}>
      <mesh onPointerDown={startDrag}>
        <sphereGeometry args={[0.34, 28, 28]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.65} roughness={0.28} metalness={0.25} />
      </mesh>
      {selected && <mesh>
        <torusGeometry args={[0.47, 0.025, 8, 48]} />
        <meshBasicMaterial color="#e8f4ff" />
      </mesh>}
      <Html center position={[0, 0.84, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[20, 0]}>
        <span className={`charge-label ${selected ? 'is-selected' : ''}`}>
          <span className="charge-label-id">{charge.id.toUpperCase()}</span> {formatCharge(charge.value)}
        </span>
      </Html>
    </group>
  )
}
