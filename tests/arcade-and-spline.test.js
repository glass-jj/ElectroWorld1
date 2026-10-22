import { test } from 'node:test'
import assert from 'node:assert/strict'
import { oscillatingLevel, captureCharge, getCapturePoints, getWaveDuration, judgePowerRelease, movingShotTarget, judgeArcadeShot } from '../src/games/arcadeLogic.js'
import { getSplineSceneUrl } from '../src/config/spline.js'

test('hold charge rises and falls at predictable times', () => {
  assert.equal(oscillatingLevel(0, 3000), 0)
  assert.equal(oscillatingLevel(1500, 3000), 0.5)
  assert.equal(oscillatingLevel(3000, 3000), 1)
  assert.equal(oscillatingLevel(4500, 3000), 0.5)
  assert.equal(oscillatingLevel(6000, 3000), 0)
})
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
test('power release rewards precision and accepts the 8% boundary', () => {
  assert.equal(judgePowerRelease(.5, 4, 2).points, 500)
  assert.equal(judgePowerRelease(.54, 4, 2).correct, true)
  assert.equal(judgePowerRelease(.55, 4, 2).correct, false)
  assert.equal(judgePowerRelease(.2, 4, 2).status, 'low')
  assert.equal(judgePowerRelease(.9, 4, 2).status, 'high')
})
test('all five current missions work with each resistance preset', () => {
  for (const target of [2, .5, 3, 1, 1.5]) for (const resistance of [2, 4, 6]) {
    const level = target * resistance / Math.min(24, 2 * target * resistance)
    assert.equal(judgePowerRelease(level, resistance, target).correct, true)
  }
})
test('moving targets stay in their lanes and reduced motion fixes their position', () => {
  for (let t = 0; t < 20000; t += 100) assert.ok(Math.abs(movingShotTarget(50, t) - 50) <= 8)
  assert.equal(movingShotTarget(50, 1000, true), 50)
})
test('shot rewards accuracy and fewer attempts without awarding misses', () => {
  const target = 32
  const distance = 2.5
  const forceForChargeOne = 8.99e9 * 1e-6 * 5e-6 / distance ** 2
  const charge = target / (forceForChargeOne * 1800)
  const level = (charge - 1) / 9
  assert.equal(judgeArcadeShot(level, distance, target, 1).correct, true)
  assert.ok(judgeArcadeShot(level, distance, target, 1).points > judgeArcadeShot(level, distance, target, 3).points)
  assert.equal(judgeArcadeShot(0, 5.5, target, 1).points, 0)
})
test('Spline configuration accepts exported scenes and rejects invalid URLs', () => {
  assert.equal(getSplineSceneUrl(''), null)
  assert.equal(getSplineSceneUrl(undefined), null)
  assert.equal(getSplineSceneUrl('/scenes/study.splinecode'), '/scenes/study.splinecode')
  assert.equal(getSplineSceneUrl('https://prod.spline.design/example/scene.splinecode'), 'https://prod.spline.design/example/scene.splinecode')
  for (const url of ['javascript:alert(1)', '//evil/scene.splinecode', 'http://example.com/scene.splinecode', 'https://example.com/project', 'https://user:pass@example.com/a.splinecode']) assert.equal(getSplineSceneUrl(url), null)
})
