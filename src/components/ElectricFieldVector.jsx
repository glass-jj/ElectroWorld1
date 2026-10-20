import { magnitude } from '../physics/electrostatics.js'
import { getFieldDisplayLength } from '../lab/visuals.js'
import VectorArrow from './VectorArrow.jsx'

export default function ElectricFieldVector({ position, vector }) {
  return <VectorArrow position={position} vector={vector} length={getFieldDisplayLength(magnitude(vector))} color="#50edc0" offset={0.25} />
}
