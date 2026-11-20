import { magnitude } from '../physics/electrostatics.js'
import { getFieldDisplayLength } from '../lab/visuals.js'
import FlechaVectorial from './FlechaVectorial.jsx'

export default function VectorCampo({ position, vector }) {
  return <FlechaVectorial position={position} vector={vector} length={getFieldDisplayLength(magnitude(vector))} color="#50edc0" offset={0.25} />
}
