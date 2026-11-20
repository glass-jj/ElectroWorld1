export const CLASH_DURATION = 45000

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

export function captureCharge(incoming, collector, progress) {
  const attraction = getChargeInteraction(incoming, collector) === 'attraction'
  const timed = progress >= 0.55 && progress <= 0.82
  return { correct: attraction && timed, status: !timed ? progress < 0.55 ? 'early' : 'late' : attraction ? 'hit' : 'repelled' }
}

export function getCapturePoints(streak) { return 100 + Math.min(5, Math.max(0, streak)) * 20 }
export function getWaveDuration(hits) { return Math.max(1500, 2800 - Math.max(0, hits) * 90) }
