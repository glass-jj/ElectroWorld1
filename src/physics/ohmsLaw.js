export const OHM_LIMITS = { voltage: [0, 24], resistance: [1, 100] }

export function calculateOhmsLaw(voltage, resistance) {
  const v = Number.isFinite(voltage) ? Math.max(0, Math.min(24, voltage)) : 0
  const r = Number.isFinite(resistance) ? Math.max(1, Math.min(100, resistance)) : 1
  const current = v / r
  return { voltage: v, resistance: r, current, power: v * current }
}

// Display scales do not alter the physical readings.
export function getCircuitVisuals(current, power) {
  const flow = Number.isFinite(current) ? Math.max(0, current) : 0
  const watts = Number.isFinite(power) ? Math.max(0, power) : 0
  return {
    flowing: flow > 0,
    duration: Math.max(0.45, 4.2 / (1 + Math.sqrt(flow))),
    brightness: Math.min(1, Math.log1p(watts) / Math.log1p(576)),
  }
}
