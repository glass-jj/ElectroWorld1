import { test } from 'node:test'
import assert from 'node:assert/strict'
import { captureCharge, getCapturePoints, getWaveDuration } from '../src/components/choqueCargas/logica.js'
import { getSplineSceneUrl } from '../src/config/spline.js'

test('capture needs both opposite signs and correct timing', () => {
  assert.equal(captureCharge(1, -1, .65).correct, true)
  assert.equal(captureCharge(-1, 1, .65).correct, true)
  assert.equal(captureCharge(1, 1, .65).status, 'repelled')
  assert.equal(captureCharge(1, -1, .3).status, 'early')
  assert.equal(captureCharge(1, -1, .9).status, 'late')
})
test('capture difficulty and combo rewards stay bounded', () => {
  assert.equal(getCapturePoints(0), 100)
  assert.equal(getCapturePoints(100), 200)
  assert.ok(getWaveDuration(5) < getWaveDuration(0))
  assert.equal(getWaveDuration(100), 1500)
})
test('Spline configuration accepts exported scenes and rejects invalid URLs', () => {
  assert.equal(getSplineSceneUrl(''), null)
  assert.equal(getSplineSceneUrl(undefined), null)
  assert.equal(getSplineSceneUrl('/scenes/study.splinecode'), '/scenes/study.splinecode')
  assert.equal(getSplineSceneUrl('https://prod.spline.design/example/scene.splinecode'), 'https://prod.spline.design/example/scene.splinecode')
  for (const url of ['javascript:alert(1)', '//evil/scene.splinecode', 'http://example.com/scene.splinecode', 'https://example.com/project', 'https://user:pass@example.com/a.splinecode']) assert.equal(getSplineSceneUrl(url), null)
})
