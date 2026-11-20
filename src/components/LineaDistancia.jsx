import { Html, Line } from '@react-three/drei'
import { distance as medirDistancia } from '../physics/electrostatics.js'

export default function LineaDistancia({ start, end }) {
  const distancia = medirDistancia(start, end)
  if (distancia < 1e-8) return null
  const puntos = [start, end].map((p) => [p[0], p[1], -0.12])
  const puntoMedio = start.map((v, axis) => (v + end[axis]) / 2)
  return <group>
    <Line points={puntos} color="#74849c" dashed dashSize={0.1} gapSize={0.1} lineWidth={1} />
    <Html center position={[puntoMedio[0], puntoMedio[1] - 0.45, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[10, 0]}>
      <span className="distance-label">{distancia.toFixed(2)} m</span>
    </Html>
  </group>
}
