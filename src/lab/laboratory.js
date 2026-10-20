import { distance, finiteNumber, MAX_CHARGE } from '../physics/electrostatics.js'

export const POSITION_LIMIT = 10
export const DEFAULT_VISIBILITY = { forces: true, field: false, probe: true, distances: true }
export const clamp = (value, min, max) => Math.max(min, Math.min(max, finiteNumber(value)))
export const safePosition = (position) => [
  clamp(position[0], -POSITION_LIMIT, POSITION_LIMIT),
  clamp(position[1], -POSITION_LIMIT, POSITION_LIMIT),
  0,
]

export function createInitialLab() {
  return {
    charges: [
      { id: 'q1', value: 5, position: [-2, 0, 0] },
      { id: 'q2', value: -5, position: [2, 0, 0] },
    ],
    selectedId: 'q1',
    nextId: 3,
    probePosition: [0, 2, 0],
    visibility: { ...DEFAULT_VISIBILITY },
  }
}

export function findSafePosition(charges) {
  // Search a finite board for a free location; never stack a newly added charge.
  for (let ring = 0; ring <= POSITION_LIMIT; ring++) {
    for (let x = -ring; x <= ring; x++) {
      for (let y = -ring; y <= ring; y++) {
        if (Math.max(Math.abs(x), Math.abs(y)) !== ring) continue
        const candidate = [x, y, 0]
        if (charges.every((charge) => distance(candidate, charge.position) >= 1.2)) return candidate
      }
    }
  }
  return null
}

export function setPairDistance(charges, requestedDistance) {
  if (charges.length < 2) return charges
  const [a, b] = charges
  const length = distance(a.position, b.position)
  const half = clamp(requestedDistance, 1.5, 8) / 2
  const direction = length === 0 ? [1, 0] : [0, 1].map((axis) => (b.position[axis] - a.position[axis]) / length)
  const offset = direction.map((component) => component * half)
  // Move the midpoint only if needed to keep both charges within the board.
  const midpoint = [0, 1].map((axis) => clamp((a.position[axis] + b.position[axis]) / 2,
    -POSITION_LIMIT + Math.abs(offset[axis]), POSITION_LIMIT - Math.abs(offset[axis])))
  return charges.map((charge, index) => index > 1 ? charge : {
    ...charge,
    position: [...midpoint.map((component, axis) => component + (index === 0 ? -1 : 1) * offset[axis]), 0],
  })
}

export function labReducer(state, action) {
  switch (action.type) {
    case 'select':
      return { ...state, selectedId: state.charges.some((charge) => charge.id === action.id) ? action.id : null }
    case 'update':
      return { ...state, charges: state.charges.map((charge) => charge.id !== action.id ? charge : {
        ...charge,
        value: action.value === undefined ? charge.value : clamp(action.value, -MAX_CHARGE, MAX_CHARGE),
        position: action.position ? safePosition(action.position) : charge.position,
      }) }
    case 'add': {
      const position = findSafePosition(state.charges)
      if (!position) return state
      const charge = { id: `q${state.nextId}`, value: 5, position }
      return { ...state, charges: [...state.charges, charge], selectedId: charge.id, nextId: state.nextId + 1 }
    }
    case 'remove': {
      const charges = state.charges.filter((charge) => charge.id !== action.id)
      return { ...state, charges, selectedId: state.selectedId === action.id ? charges[0]?.id ?? null : state.selectedId }
    }
    case 'distance':
      return { ...state, charges: setPairDistance(state.charges, action.value) }
    case 'probe':
      return { ...state, probePosition: safePosition(action.position) }
    case 'toggle':
      if (!(action.key in DEFAULT_VISIBILITY)) return state
      return { ...state, visibility: { ...state.visibility, [action.key]: !state.visibility[action.key] } }
    case 'reset':
      return createInitialLab()
    default:
      return state
  }
}
