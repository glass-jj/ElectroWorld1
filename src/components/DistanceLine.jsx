import { Html, Line } from '@react-three/drei'
import { distance } from '../physics/electrostatics.js'

export default function DistanceLine({ start, end }) {
  const length = distance(start, end)
  if (length < 1e-8) return null
  const points = [start, end].map((p) => [p[0], p[1], -0.12])
  const midpoint = start.map((v, axis) => (v + end[axis]) / 2)
  return <group>
    <Line points={points} color="#74849c" dashed dashSize={0.1} gapSize={0.1} lineWidth={1} />
    <Html center position={[midpoint[0], midpoint[1] - 0.45, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[10, 0]}>
      <span className="distance-label">{length.toFixed(2)} m</span>
    </Html>
  </group>
}
