export function getSplineSceneUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null
  const scene = value.trim()
  if (/^\/(?!\/)[^?#]+\.splinecode$/.test(scene)) return scene
  try {
    const url = new URL(scene)
    return url.protocol === 'https:' && url.pathname.endsWith('.splinecode') && !url.username && !url.password ? url.href : null
  } catch { return null }
}
