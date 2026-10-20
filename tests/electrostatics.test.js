import { test } from 'node:test'
import assert from 'node:assert/strict'
import { COULOMB_CONSTANT, MIN_DISTANCE, distance, electricForce, electricField, magnitude, microCoulombsToCoulombs, netForce, totalElectricField } from '../src/physics/electrostatics.js'
import { getForceDisplayLength, getFieldDisplayLength, getGridDisplayLength } from '../src/lab/visuals.js'
const charge = (id, value, position) => ({ id, value, position })
const origin = charge('a', 5, [0, 0, 0])
const right = charge('b', 5, [2, 0, 0])
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) <= Math.max(1e-12, Math.abs(expected) * 1e-10), `${actual} ≠ ${expected}`)

test('converts microcoulombs and measures three-dimensional distance', () => {
  close(microCoulombsToCoulombs(5), 5e-6)
  close(distance([0, 0, 0], [2, 3, 6]), 7)
})
test('positive charges repel with the expected Coulomb magnitude', () => {
  const f = electricForce(origin, right)
  assert.ok(f[0] < 0)
  close(magnitude(f), COULOMB_CONSTANT * 25e-12 / 4)
})
test('opposite charges attract', () => assert.ok(electricForce(origin, { ...right, value: -5 })[0] > 0))
test('doubling distance divides force by four', () => close(magnitude(electricForce(origin, right)) / magnitude(electricForce(origin, { ...right, position: [4, 0, 0] })), 4))
test('a zero target or source produces zero force', () => {
  assert.deepEqual(electricForce({ ...origin, value: 0 }, right), [0, 0, 0])
  assert.deepEqual(electricForce(origin, { ...right, value: 0 }), [0, 0, 0])
})
test('net force adds vectors, including cancellation and diagonals', () => {
  const left = charge('c', 5, [-2, 0, 0])
  assert.deepEqual(netForce(origin, [origin, right, left]), [0, 0, 0])
  const up = charge('d', 5, [0, 2, 0])
  const f = netForce(origin, [origin, right, up])
  close(f[0], -COULOMB_CONSTANT * 25e-12 / 4)
  close(f[1], f[0])
  close(magnitude(f), Math.sqrt(2) * Math.abs(f[0]))
})
test('forces obey action and reaction at arbitrary 3D positions', () => {
  const other = charge('b', -3, [2, -4, 1])
  electricForce(origin, other).forEach((v, i) => close(v, -electricForce(other, origin)[i]))
})
test('positive source field points outward and negative inward', () => {
  assert.ok(electricField([2, 0, 0], origin)[0] > 0)
  assert.ok(electricField([2, 0, 0], { ...origin, value: -5 })[0] < 0)
  close(electricField([2, 0, 0], origin)[0], COULOMB_CONSTANT * 5e-6 / 4)
})
test('multiple-source fields add vectorially and cancel at a symmetric midpoint', () => {
  assert.deepEqual(totalElectricField([1, 0, 0], [origin, right]), [0, 0, 0])
  close(totalElectricField([1, 0, 0], [origin, { ...right, value: -5 }])[0], COULOMB_CONSTANT * 10e-6)
  assert.deepEqual(totalElectricField([1, 0, 0], []), [0, 0, 0])
})
test('field and force agree through F = qE', () => {
  const e = totalElectricField(origin.position, [right])
  const f = netForce(origin, [origin, right])
  f.forEach((v, i) => close(v, microCoulombsToCoulombs(origin.value) * e[i]))
})
test('coincident and near-coincident positions stay finite and capped', () => {
  const same = { ...right, position: [0, 0, 0] }
  assert.deepEqual(electricForce(origin, same), [0, 0, 0])
  assert.deepEqual(electricField(origin.position, same), [0, 0, 0])
  const near = { ...right, position: [1e-10, 0, 0] }
  close(magnitude(electricForce(origin, near)), COULOMB_CONSTANT * 25e-12 / MIN_DISTANCE ** 2)
  assert.ok(electricField([1e-10, 0, 0], origin).every(Number.isFinite))
})
test('invalid and extreme inputs cannot inject non-finite vectors', () => {
  const invalid = charge('bad', Infinity, [NaN, Infinity, -Infinity])
  assert.ok(electricForce(origin, invalid).every(Number.isFinite))
  assert.ok(electricField([1e308, 0, 0], { ...origin, value: 1e308 }).every(Number.isFinite))
})
test('visual scales hide zeros, stay bounded, and grow monotonically', () => {
  for (const scale of [getForceDisplayLength, getFieldDisplayLength, getGridDisplayLength]) {
    assert.equal(scale(0), 0)
    assert.equal(scale(Infinity), 0)
    assert.ok(scale(1e-6) > 0)
    assert.ok(scale(1e9) >= scale(1))
    assert.ok(scale(1e100) <= 1.8)
  }
})
