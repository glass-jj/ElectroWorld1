import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculateOhmsLaw, getCircuitVisuals } from '../src/physics/ohmsLaw.js'
import { electricForce, magnitude } from '../src/physics/electrostatics.js'
import { createClashRound, getChargeInteraction, checkClashAnswer, evaluatePowerMission, POWER_MISSIONS, calculateShotForce, evaluateShot, getShotReach, SHOT_TARGETS } from '../src/games/gameLogic.js'

test('Ohm: 12 V and 6 Ω produce 2 A and 24 W', () => {
  assert.deepEqual(calculateOhmsLaw(12, 6), { voltage: 12, resistance: 6, current: 2, power: 24 })
})
test('Ohm: zero voltage stops current and power', () => {
  const result = calculateOhmsLaw(0, 6)
  assert.equal(result.current, 0)
  assert.equal(result.power, 0)
  assert.equal(getCircuitVisuals(result.current, result.power).flowing, false)
})
test('Ohm: resistance and non-finite inputs cannot cause division by zero', () => {
  for (const v of [NaN, Infinity, -1, 24]) for (const r of [0, -1, Infinity, NaN, 100]) {
    assert.ok(Object.values(calculateOhmsLaw(v, r)).every(Number.isFinite))
    assert.ok(calculateOhmsLaw(v, r).resistance >= 1)
  }
})
test('Ohm: larger voltage raises current; larger resistance reduces it', () => {
  assert.equal(calculateOhmsLaw(24, 6).current, 2 * calculateOhmsLaw(12, 6).current)
  assert.equal(calculateOhmsLaw(12, 12).current, calculateOhmsLaw(12, 6).current / 2)
})
test('circuit visuals are bounded and respond to current and power', () => {
  assert.ok(getCircuitVisuals(2, 24).duration < getCircuitVisuals(1, 12).duration)
  assert.ok(getCircuitVisuals(2, 24).brightness > getCircuitVisuals(1, 12).brightness)
  assert.equal(getCircuitVisuals(0, 0).brightness, 0)
  assert.ok(getCircuitVisuals(1e99, 1e99).brightness <= 1)
})
test('Clash: all four random pairs obey the attraction/repulsion rule', () => {
  const pairs = [[1, 1], [-1, -1], [1, -1], [-1, 1]]
  for (let i = 0; i < 4; i++) {
    const signs = createClashRound(() => i / 4)
    assert.deepEqual(signs, pairs[i])
    const answer = i < 2 ? 'repulsion' : 'attraction'
    assert.equal(checkClashAnswer(signs, answer).correct, true)
    assert.equal(checkClashAnswer(signs, answer === 'repulsion' ? 'attraction' : 'repulsion').correct, false)
  }
})
test('Clash: generator boundaries stay valid, invalid signs are rejected', () => {
  for (const roll of [-1, 0, 0.999999, 1, NaN]) {
    const signs = createClashRound(() => roll)
    assert.ok(['attraction', 'repulsion'].includes(getChargeInteraction(...signs)))
  }
  assert.throws(() => getChargeInteraction(0, 1), RangeError)
})
test('Power Up: target tolerance is inclusive at ±5% and rejects outside', () => {
  assert.equal(evaluatePowerMission(19, 10, 2).correct, true)
  assert.equal(evaluatePowerMission(21, 10, 2).correct, true)
  assert.equal(evaluatePowerMission(18, 10, 2).status, 'low')
  assert.equal(evaluatePowerMission(22, 10, 2).status, 'high')
})
test('Power Up: five targets are achievable with the available controls', () => {
  assert.equal(POWER_MISSIONS.length, 5)
  for (const target of POWER_MISSIONS) assert.equal(evaluatePowerMission(target * 6, 6, target).correct, true)
})
test('Shot: force exactly reuses the existing Coulomb function', () => {
  const expected = magnitude(electricForce({ id: 'a', value: 6, position: [4, 0, 0] }, { id: 'b', value: 5, position: [0, 0, 0] }))
  assert.equal(calculateShotForce(6, 4), expected)
  assert.equal(calculateShotForce(0, 4), 0)
})
test('Shot: reach grows with charge and follows inverse-square distance', () => {
  assert.ok(getShotReach(calculateShotForce(8, 4)) > getShotReach(calculateShotForce(4, 4)))
  assert.equal(calculateShotForce(4, 2), 4 * calculateShotForce(4, 4))
  assert.equal(getShotReach(0), 0)
  assert.equal(getShotReach(Infinity), 0)
  assert.equal(getShotReach(1000), 100)
})
test('Shot: short, hit, and long outcomes are consistent', () => {
  assert.equal(evaluateShot(1, 8, 32).status, 'short')
  assert.equal(evaluateShot(6, 4, 32).status, 'hit')
  assert.equal(evaluateShot(10, 1.5, 32).status, 'long')
})
test('Shot: every round can be hit with the sliders', () => {
  for (const target of SHOT_TARGETS) {
    let reachable = false
    for (let q = 1; q <= 10; q++) for (let step = 15; step <= 80; step++) {
      if (evaluateShot(q, step / 10, target).correct) reachable = true
    }
    assert.equal(reachable, true, `Target ${target} cannot be reached`)
  }
})
