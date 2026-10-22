import { electricForce, magnitude } from '../physics/electrostatics.js'
import { calculateOhmsLaw } from '../physics/ohmsLaw.js'

export const CLASH_DURATION = 45000
export const POWER_MISSIONS = [2, 0.5, 3, 1, 1.5]
export const SHOT_TARGETS = [32, 52, 72, 44, 64]
export const SHOT_TOLERANCE = 6

export function createClashRound(random = Math.random) {
  const roll = random()
  const index = Number.isFinite(roll) ? Math.max(0, Math.min(3, Math.floor(roll * 4))) : 0
  return [...[[1, 1], [-1, -1], [1, -1], [-1, 1]][index]]
}

export function getChargeInteraction(first, second) {
  if (![1, -1].includes(first) || ![1, -1].includes(second)) throw new RangeError('Se necesitan dos signos + o −')
  return first === second ? 'repulsion' : 'attraction'
}

export function checkClashAnswer(signs, answer) {
  const interaction = getChargeInteraction(...signs)
  return { correct: interaction === answer, interaction }
}

export function evaluatePowerMission(voltage, resistance, target) {
  const { current } = calculateOhmsLaw(voltage, resistance)
  if (!Number.isFinite(target) || target <= 0) throw new RangeError('La corriente objetivo debe ser positiva')
  const correct = Math.abs(current - target) <= target * 0.05 + 1e-10
  return { current, correct, status: correct ? 'hit' : current < target ? 'low' : 'high' }
}

export function calculateShotForce(charge, distance) {
  const value = Number.isFinite(charge) ? Math.max(0, Math.min(10, charge)) : 0
  const separation = Number.isFinite(distance) ? Math.max(1.5, Math.min(8, distance)) : 4
  return magnitude(electricForce(
    { id: 'shot', value, position: [separation, 0, 0] },
    { id: 'source', value: 5, position: [0, 0, 0] },
  ))
}

// Arcade scale: 1 N corresponds to 1800% of the track. It is not a
// projectile integration or a real distance prediction. Cap at the track edge.
export function getShotReach(force) {
  return Number.isFinite(force) ? Math.max(0, Math.min(100, force * 1800)) : 0
}

export function evaluateShot(charge, distance, target) {
  if (!Number.isFinite(target) || target < 0 || target > 100) throw new RangeError('Objetivo fuera de la pista')
  const force = calculateShotForce(charge, distance)
  const reach = getShotReach(force)
  const correct = Math.abs(reach - target) <= SHOT_TOLERANCE + 1e-10
  return { force, reach, correct, status: correct ? 'hit' : reach < target ? 'short' : 'long' }
}
