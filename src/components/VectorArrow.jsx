import { useMemo } from 'react'
import { Quaternion, Vector3 } from 'three'
import { magnitude } from '../physics/electrostatics.js'

export default function VectorArrow({ position, vector, length, color, offset = 0, thin = false }) {
  const orientation = useMemo(() => {
    const size = magnitude(vector)
    if (!Number.isFinite(size) || size < 1e-12 || length <= 0) return null
    const direction = new Vector3(...vector).divideScalar(size)
    return {
      rotation: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction),
      start: direction.multiplyScalar(offset).add(new Vector3(...position)),
    }
  }, [position, vector, length, offset])
  if (!orientation) return null
  const head = Math.min(thin ? 0.14 : 0.22, length * 0.4)
  const shaft = length - head
  return <group position={orientation.start} quaternion={orientation.rotation}>
    <mesh position={[0, shaft / 2, 0]}>
      <cylinderGeometry args={[thin ? 0.012 : 0.025, thin ? 0.012 : 0.025, shaft, 6]} />
      <meshBasicMaterial color={color} />
    </mesh>
    <mesh position={[0, shaft + head / 2, 0]}>
      <coneGeometry args={[head * 0.38, head, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  </group>
}
