export function getChargeColor(value) {
  return value > 0 ? '#3982ff' : value < 0 ? '#ff4b63' : '#87909f'
}

function displayLength(value, reference, min, max) {
  if (!Number.isFinite(value) || value <= 1e-12) return 0
  return Math.min(max, min + Math.log1p(value / reference) * 0.35)
}

export const getForceDisplayLength = (value) => displayLength(value, 0.005, 0.24, 1.6)
export const getFieldDisplayLength = (value) => displayLength(value, 2000, 0.25, 1.8)
export const getGridDisplayLength = (value) => displayLength(value, 5000, 0.16, 0.65)
export const formatCharge = (value) => `${value > 0 ? '+' : ''}${value} μC`
export function formatMeasurement(value) {
  if (!Number.isFinite(value)) return '—'
  if (Math.abs(value) < 1e-12) return '0'
  return Math.abs(value) < 0.001 || Math.abs(value) >= 10000 ? value.toExponential(3) : value.toLocaleString('es-CO', { maximumSignificantDigits: 5 })
}
