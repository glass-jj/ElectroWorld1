import { magnitude } from '../physics/electrostatics.js'
import { getForceDisplayLength } from '../lab/visuals.js'
import VectorArrow from './VectorArrow.jsx'

export default function ForceVector({ position, vector }) {
  return <VectorArrow position={position} vector={vector} length={getForceDisplayLength(magnitude(vector))} color="#ffc26b" offset={0.44} />
}
