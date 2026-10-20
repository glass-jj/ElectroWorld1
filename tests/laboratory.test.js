import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createInitialLab, labReducer, setPairDistance } from '../src/lab/laboratory.js'
import { distance } from '../src/physics/electrostatics.js'

test('add selects a unique charge at a safe position', () => {
  let state = createInitialLab()
  for (let i = 0; i < 12; i++) state = labReducer(state, { type: 'add' })
  assert.equal(new Set(state.charges.map((q) => q.id)).size, 14)
  assert.equal(state.selectedId, 'q14')
  for (const a of state.charges) for (const b of state.charges) if (a.id !== b.id) assert.ok(distance(a.position, b.position) >= 1.2)
})
test('deleting down to zero is safe and IDs are not reused', () => {
  let state = createInitialLab()
  state = labReducer(state, { type: 'remove', id: 'q1' })
  assert.equal(state.selectedId, 'q2')
  assert.equal(setPairDistance(state.charges, 4), state.charges)
  state = labReducer(state, { type: 'remove', id: 'q2' })
  assert.equal(state.selectedId, null)
  state = labReducer(state, { type: 'add' })
  assert.equal(state.charges[0].id, 'q3')
})
test('distance slider keeps midpoint and axis on a diagonal pair', () => {
  const pair = [{ id: 'a', position: [-1, -1, 0] }, { id: 'b', position: [1, 1, 0] }, { id: 'c', position: [4, 3, 0] }]
  const result = setPairDistance(pair, 8)
  assert.ok(Math.abs(distance(result[0].position, result[1].position) - 8) < 1e-10)
  assert.deepEqual(result[2], pair[2])
  assert.equal(result[0].position[0], -result[1].position[0])
  assert.equal(result[0].position[0], result[0].position[1])
})
test('slider resolves coincident positions and respects board boundaries', () => {
  const pair = [{ position: [10, 10, 0] }, { position: [10, 10, 0] }]
  const result = setPairDistance(pair, 8)
  assert.equal(distance(result[0].position, result[1].position), 8)
  assert.ok(result.every((q) => q.position.every((v) => Math.abs(v) <= 10)))
})
test('edits constrain XY, charge values and non-finite numbers', () => {
  const state = labReducer(createInitialLab(), { type: 'update', id: 'q1', value: Infinity, position: [1e99, NaN, 10] })
  assert.deepEqual(state.charges[0].position, [10, 0, 0])
  assert.equal(state.charges[0].value, 0)
})
test('reset restores charges, selection, probe and visibility independently', () => {
  let state = labReducer(createInitialLab(), { type: 'add' })
  state = labReducer(state, { type: 'toggle', key: 'field' })
  state = labReducer(state, { type: 'probe', position: [4, 4, 0] })
  assert.deepEqual(labReducer(state, { type: 'reset' }), createInitialLab())
})
