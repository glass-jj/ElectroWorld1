import { useMemo, useState } from 'react'
import { distance, magnitude, MAX_CHARGE } from '../physics/electrostatics.js'
import { findSafePosition, POSITION_LIMIT } from '../lab/laboratory.js'
import { formatCharge, formatMeasurement, getChargeColor } from '../lab/visuals.js'

function NumericInput({ label, value, onChange, min, max, step = 0.1 }) {
  const [draft, setDraft] = useState({ source: value, text: String(value) })
  if (draft.source !== value) setDraft({ source: value, text: String(value) })
  return <label className="numeric-field">
    <span>{label}</span>
    <input type="number" value={draft.text} min={min} max={max} step={step} onBlur={() => setDraft({ source: value, text: String(value) })} onChange={(event) => {
      setDraft({ source: value, text: event.target.value })
      const number = event.target.valueAsNumber
      if (Number.isFinite(number)) onChange(number)
    }} />
  </label>
}

function VectorReadout({ vector, symbol, unit }) {
  return <div className="vector-readout">
    <div className="result-total"><span>|{symbol}|</span><output>{formatMeasurement(magnitude(vector))} <small>{unit}</small></output></div>
    <div className="result-components">
      <span>{symbol}x <output>{formatMeasurement(vector[0])}</output></span>
      <span>{symbol}y <output>{formatMeasurement(vector[1])}</output></span>
    </div>
  </div>
}

export default function ControlPanel({ lab, dispatch, forces, field, nearCharges, probeNearCharge }) {
  const { charges, selectedId, probePosition, visibility } = lab
  const canAddCharge = useMemo(() => findSafePosition(charges) !== null, [charges])
  const selected = charges.find((charge) => charge.id === selectedId)
  const pair = charges.slice(0, 2)
  const pairDistance = pair.length === 2 ? distance(pair[0].position, pair[1].position) : null
  const updatePosition = (axis, value) => {
    const position = [...selected.position]
    position[axis] = value
    dispatch({ type: 'update', id: selected.id, position })
  }
  const updateProbe = (axis, value) => {
    const position = [...probePosition]
    position[axis] = value
    dispatch({ type: 'probe', position })
  }

  return <aside className="control-panel" aria-label="Panel del laboratorio">
    <section className="panel-section">
      <div className="section-heading"><h2>Cargas</h2><span className="count-badge">{charges.length} en escena</span></div>
      <button className="add-button" onClick={() => dispatch({ type: 'add' })} disabled={!canAddCharge}>+ Añadir carga</button>
      {!canAddCharge && <p className="notice">No queda espacio libre para añadir otra carga.</p>}
      <div className="charge-list" aria-label="Seleccionar carga">
        {charges.map((charge) => <button key={charge.id} className={`charge-chip ${charge.id === selectedId ? 'active' : ''}`} aria-pressed={charge.id === selectedId} onClick={() => dispatch({ type: 'select', id: charge.id })}>
          <span className="charge-dot" style={{ backgroundColor: getChargeColor(charge.value) }} />
          <span>{charge.id.toUpperCase()}</span><small>{formatCharge(charge.value)}</small>
        </button>)}
      </div>
      {selected ? <div className="selected-editor" key={selected.id}>
        <div className="editor-heading"><h3>Carga seleccionada · {selected.id.toUpperCase()}</h3><span className="selection-dot" /></div>
        <NumericInput label="Valor (μC)" value={selected.value} min={-MAX_CHARGE} max={MAX_CHARGE} onChange={(value) => dispatch({ type: 'update', id: selected.id, value })} />
        <div className="coordinate-fields">
          <NumericInput label="Posición X (m)" value={selected.position[0]} min={-POSITION_LIMIT} max={POSITION_LIMIT} onChange={(value) => updatePosition(0, value)} />
          <NumericInput label="Posición Y (m)" value={selected.position[1]} min={-POSITION_LIMIT} max={POSITION_LIMIT} onChange={(value) => updatePosition(1, value)} />
        </div>
        <button className="delete-button" onClick={() => dispatch({ type: 'remove', id: selected.id })}>Eliminar {selected.id.toUpperCase()}</button>
      </div> : <p className="empty-state">{charges.length ? 'Selecciona una carga en la escena o en la lista.' : 'Añade una carga para comenzar a explorar.'}</p>}
    </section>

    <section className="panel-section">
      <div className="section-heading"><h2>Simulación</h2><span className="unit-tag">PLANO XY</span></div>
      <label className="distance-control" htmlFor="pair-distance">Distancia entre {pair.length === 2 ? `${pair[0].id.toUpperCase()} y ${pair[1].id.toUpperCase()}` : 'cargas'}<output>{pairDistance === null ? '—' : `${pairDistance.toFixed(2)} m`}</output></label>
      <input id="pair-distance" type="range" min="1.5" max="8" step="0.1" disabled={pairDistance === null} value={pairDistance === null ? 4 : Math.max(1.5, Math.min(8, pairDistance))} aria-valuetext={pairDistance === null ? 'Se necesitan dos cargas' : `${pairDistance.toFixed(2)} metros`} onChange={(event) => dispatch({ type: 'distance', value: Number(event.target.value) })} />
      <div className="range-labels"><span>1,5 m</span><span>8 m</span></div>
      <p className="helper-text">El slider ajusta la primera pareja. Arrastra libremente cualquier carga sobre XY.</p>
      {pairDistance !== null && (pairDistance < 1.5 || pairDistance > 8) && <p className="notice">La pareja está fuera del rango del slider; al usarlo volverá a 1,5–8 m.</p>}
      {nearCharges && <p className="notice" role="status">Cargas a menos de 0,75 m: cálculo limitado. En coincidencia exacta la dirección es indefinida y se muestra cero.</p>}
    </section>

    <section className="panel-section">
      <div className="section-heading"><h2>Visualización</h2><span className="unit-tag">CAPAS</span></div>
      {[
        ['forces', 'Mostrar fuerzas', 'force'],
        ['field', 'Mostrar campo', 'field'],
        ['probe', 'Mostrar punto de prueba', 'probe'],
        ['distances', 'Mostrar línea / distancias', 'distance'],
      ].map(([key, label, color]) => <label className="toggle-row" key={key}>
        <span><i className={`legend-dot ${color}`} />{label}</span>
        <input type="checkbox" checked={visibility[key]} onChange={() => dispatch({ type: 'toggle', key })} />
      </label>)}
    </section>

    <section className="panel-section results-section">
      <div className="section-heading"><h2>Resultados</h2><span className="live-badge"><i />EN VIVO</span></div>
      {selected && <div className="result-card force-result">
        <h3>Fuerza resultante · {selected.id.toUpperCase()}</h3>
        <VectorReadout vector={forces[selected.id]} symbol="F" unit="N" />
      </div>}
      {visibility.probe && <div className="result-card field-result">
        <h3>Campo eléctrico total · P</h3>
        <VectorReadout vector={field} symbol="E" unit="N/C" />
        <div className="coordinate-fields probe-coordinates">
          <NumericInput label="Punto P · X (m)" value={probePosition[0]} min={-POSITION_LIMIT} max={POSITION_LIMIT} onChange={(value) => updateProbe(0, value)} />
          <NumericInput label="Punto P · Y (m)" value={probePosition[1]} min={-POSITION_LIMIT} max={POSITION_LIMIT} onChange={(value) => updateProbe(1, value)} />
        </div>
        {probeNearCharge && <p className="notice" role="status">P está a menos de 0,75 m de una carga. Campo limitado; cero en coincidencia exacta.</p>}
      </div>}
      {!selected && !visibility.probe && <p className="helper-text">Selecciona una carga o activa el punto de prueba para ver resultados.</p>}
      <p className="helper-text">Suma vectorial por superposición. Las flechas usan una escala visual limitada; las lecturas muestran el valor físico.</p>
    </section>
    <div className="panel-footer"><button className="reset-button" onClick={() => dispatch({ type: 'reset' })}>↺ Reiniciar laboratorio</button><span>k = 8,99 × 10⁹ N·m²/C²</span></div>
  </aside>
}
