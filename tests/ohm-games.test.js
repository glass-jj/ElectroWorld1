import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculateOhmsLaw, getCircuitVisuals } from '../src/physics/ohmsLaw.js'
import { createClashRound, getChargeInteraction, checkClashAnswer } from '../src/components/choqueCargas/logica.js'

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
