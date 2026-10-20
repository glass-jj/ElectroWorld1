// Positions are metres, interface charge values are microcoulombs.
export const COULOMB_CONSTANT = 8.99e9
export const MIN_DISTANCE = 0.75
export const MAX_CHARGE = 10000

export function finiteNumber(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback
}

export function microCoulombsToCoulombs(value) {
  return Math.max(-MAX_CHARGE, Math.min(MAX_CHARGE, finiteNumber(value))) * 1e-6
}

function coordinate(value) {
  return Math.max(-1e6, Math.min(1e6, finiteNumber(value)))
}

export function displacement(target, source) {
  return [0, 1, 2].map((axis) => coordinate(target[axis]) - coordinate(source[axis]))
}

export function magnitude(vector) {
  return Math.hypot(...vector)
}

export function distance(a, b) {
  return magnitude(displacement(a, b))
}

// Below MIN_DISTANCE, cap the inverse-square magnitude. At exact coincidence
// the radial direction is undefined; return zero and flag the region in the UI.
function radialVector(target, source, coefficient) {
  const delta = displacement(target, source)
  const radius = magnitude(delta)
  if (radius === 0 || coefficient === 0) return [0, 0, 0]
  const scale = coefficient / (Math.max(radius, MIN_DISTANCE) ** 2 * radius)
  return delta.map((component) => component * scale)
}

export function electricForce(target, source) {
  return radialVector(target.position, source.position,
    COULOMB_CONSTANT * microCoulombsToCoulombs(target.value) * microCoulombsToCoulombs(source.value))
}

export function netForce(target, charges) {
  return charges.reduce((total, source) => {
    if (source.id === target.id) return total
    const force = electricForce(target, source)
    return total.map((component, axis) => component + force[axis])
  }, [0, 0, 0])
}

export function electricField(position, source) {
  return radialVector(position, source.position,
    COULOMB_CONSTANT * microCoulombsToCoulombs(source.value))
}

export function totalElectricField(position, charges) {
  return charges.reduce((total, source) => {
    const field = electricField(position, source)
    return total.map((component, axis) => component + field[axis])
  }, [0, 0, 0])
}
