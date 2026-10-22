import { getChargeInteraction, evaluateShot } from './gameLogic.js'
import { calculateOhmsLaw } from '../physics/ohmsLaw.js'

export function oscillatingLevel(elapsed, halfCycle = 2200) {
  if (!Number.isFinite(elapsed) || elapsed < 0) return 0
  const phase = (elapsed / halfCycle) % 2
  return phase <= 1 ? phase : 2 - phase
}

export function captureCharge(incoming, collector, progress) {
  const attraction = getChargeInteraction(incoming, collector) === 'attraction'
  const timed = progress >= 0.55 && progress <= 0.82
  return { correct: attraction && timed, status: !timed ? progress < 0.55 ? 'early' : 'late' : attraction ? 'hit' : 'repelled' }
}

export function getCapturePoints(streak) { return 100 + Math.min(5, Math.max(0, streak)) * 20 }
export function getWaveDuration(hits) { return Math.max(1500, 2800 - Math.max(0, hits) * 90) }

export function powerVoltage(level, resistance, target) {
  return Math.max(0, Math.min(1, level)) * Math.min(24, 2 * target * resistance)
}

export function judgePowerRelease(level, resistance, target) {
  const voltage = powerVoltage(level, resistance, target)
  const { current, power } = calculateOhmsLaw(voltage, resistance)
  const error = Math.abs(current - target) / target
  const correct = error <= 0.08 + 1e-10
  return { voltage, current, power, correct, status: correct ? 'hit' : current < target ? 'low' : 'high', points: correct ? 300 + Math.round(200 * Math.max(0, 1 - error / 0.08)) : 0 }
}

export function movingShotTarget(base, elapsed, reducedMotion = false) {
  return base + (reducedMotion ? 0 : Math.sin(elapsed / 1050) * 8)
}

export function judgeArcadeShot(level, distance, target, attempt) {
  const charge = 1 + Math.max(0, Math.min(1, level)) * 9
  const result = evaluateShot(charge, distance, target)
  const precision = Math.max(0, 1 - Math.abs(result.reach - target) / 6)
  return { ...result, charge, points: result.correct ? 500 + Math.round(precision * 250) + Math.max(0, 3 - attempt) * 50 : 0 }
}
