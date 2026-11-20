import { magnitude } from '../physics/electrostatics.js'
import { getForceDisplayLength } from '../lab/visuals.js'
import FlechaVectorial from './FlechaVectorial.jsx'

export default function VectorFuerza({ position, vector }) {
  return <FlechaVectorial position={position} vector={vector} length={getForceDisplayLength(magnitude(vector))} color="#ffc26b" offset={0.44} />
}
