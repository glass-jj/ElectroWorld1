import { useMemo } from 'react'
import { distance, magnitude, totalElectricField } from '../physics/electrostatics.js'
import { getGridDisplayLength } from '../lab/visuals.js'
import VectorArrow from './VectorArrow.jsx'

const SAMPLE_POINTS = Array.from({ length: 81 }, (_, index) => [
  (index % 9 - 4) * 1.5, (Math.floor(index / 9) - 4) * 1.5, 0,
])

export default function FieldGrid({ charges }) {
  const samples = useMemo(() => SAMPLE_POINTS.flatMap((position, index) => {
    if (charges.some((charge) => distance(position, charge.position) < 0.9)) return []
    const vector = totalElectricField(position, charges)
    return [{ index, position, vector, length: getGridDisplayLength(magnitude(vector)) }]
  }), [charges])
  return <group>{samples.map(({ index, ...sample }) => <VectorArrow key={index} {...sample} color="#4a948e" thin />)}</group>
}
