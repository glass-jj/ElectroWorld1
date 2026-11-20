import { useMemo, useState } from 'react'
import { distance as distancia, magnitude as magnitud, MAX_CHARGE } from '../physics/electrostatics.js'
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
    <div className="result-total"><span>|{symbol}|</span><output>{formatMeasurement(magnitud(vector))} <small>{unit}</small></output></div>
    <div className="result-components">
      <span>{symbol}x <output>{formatMeasurement(vector[0])}</output></span>
      <span>{symbol}y <output>{formatMeasurement(vector[1])}</output></span>
    </div>
  </div>
}

export default function ControlesCoulomb({ lab, dispatch, fuerzas, campo, nearCharges, probeNearCharge }) {
  const { charges: cargas, selectedId, probePosition, visibility } = lab
  const sePuedeAnadirCarga = useMemo(() => findSafePosition(cargas) !== null, [cargas])
  const cargaSeleccionada = cargas.find((carga) => carga.id === selectedId)
  const pareja = cargas.slice(0, 2)
  const distanciaEntreCargas = pareja.length === 2 ? distancia(pareja[0].position, pareja[1].position) : null
  const cambiarPosicion = (axis, value) => {
    const position = [...cargaSeleccionada.position]
    position[axis] = value
    dispatch({ type: 'update', id: cargaSeleccionada.id, position })
  }
  const moverPuntoPrueba = (axis, value) => {
    const position = [...probePosition]
    position[axis] = value
    dispatch({ type: 'probe', position })
  }

  function reiniciar() {
    dispatch({ type: 'reset' })
  }

  return <aside className="control-panel" aria-label="Panel del laboratorio">
    <section className="panel-section">
      <div className="section-heading"><h2>Cargas</h2></div>
      <button className="add-button" onClick={() => dispatch({ type: 'add' })} disabled={!sePuedeAnadirCarga}>+ Añadir carga</button>
      {!sePuedeAnadirCarga && <p className="notice">No queda espacio libre para añadir otra carga.</p>}
      <div className="charge-list" aria-label="Seleccionar carga">
        {cargas.map((carga) => <button key={carga.id} className={`charge-chip ${carga.id === selectedId ? 'active' : ''}`} aria-pressed={carga.id === selectedId} onClick={() => dispatch({ type: 'select', id: carga.id })}>
          <span className="charge-dot" style={{ backgroundColor: getChargeColor(carga.value) }} />
          <span>{carga.id.toUpperCase()}</span><small>{formatCharge(carga.value)}</small>
        </button>)}
      </div>
      {cargaSeleccionada ? <div className="selected-editor" key={cargaSeleccionada.id}>
        <div className="editor-heading"><h3>Carga seleccionada · {cargaSeleccionada.id.toUpperCase()}</h3></div>
        <NumericInput label="Valor (μC)" value={cargaSeleccionada.value} min={-MAX_CHARGE} max={MAX_CHARGE} onChange={(value) => dispatch({ type: 'update', id: cargaSeleccionada.id, value })} />
        <div className="coordinate-fields">
          <NumericInput label="Posición X (m)" value={cargaSeleccionada.position[0]} min={-POSITION_LIMIT} max={POSITION_LIMIT} onChange={(value) => cambiarPosicion(0, value)} />
          <NumericInput label="Posición Y (m)" value={cargaSeleccionada.position[1]} min={-POSITION_LIMIT} max={POSITION_LIMIT} onChange={(value) => cambiarPosicion(1, value)} />
        </div>
        <button className="delete-button" onClick={() => dispatch({ type: 'remove', id: cargaSeleccionada.id })}>Eliminar {cargaSeleccionada.id.toUpperCase()}</button>
      </div> : <p className="empty-state">{cargas.length ? 'Selecciona una carga.' : 'Añade una carga.'}</p>}
    </section>

    <section className="panel-section">

      <label className="distance-control" htmlFor="pair-distance">Distancia entre {pareja.length === 2 ? `${pareja[0].id.toUpperCase()} y ${pareja[1].id.toUpperCase()}` : 'cargas'}<output>{distanciaEntreCargas === null ? '—' : `${distanciaEntreCargas.toFixed(2)} m`}</output></label>
      <input id="pair-distance" type="range" min="1.5" max="8" step="0.1" disabled={distanciaEntreCargas === null} value={distanciaEntreCargas === null ? 4 : Math.max(1.5, Math.min(8, distanciaEntreCargas))} aria-valuetext={distanciaEntreCargas === null ? 'Se necesitan dos cargas' : `${distanciaEntreCargas.toFixed(2)} metros`} onChange={(event) => dispatch({ type: 'distance', value: Number(event.target.value) })} />
      <div className="range-labels"><span>1,5 m</span><span>8 m</span></div>
      {distanciaEntreCargas !== null && (distanciaEntreCargas < 1.5 || distanciaEntreCargas > 8) && <p className="notice">El deslizador ajusta la distancia entre 1,5 y 8 m.</p>}
      {nearCharges && <p className="notice" role="status">Fuerza limitada por debajo de 0,75 m y cero si las cargas coinciden.</p>}
    </section>

    <section className="panel-section results-section">
      <div className="section-heading"><h2>Resultados</h2></div>
      {cargaSeleccionada && <div className="result-card force-result">
        <h3>Fuerza resultante · {cargaSeleccionada.id.toUpperCase()}</h3>
        <VectorReadout vector={fuerzas[cargaSeleccionada.id]} symbol="F" unit="N" />
      </div>}
      {visibility.probe && <div className="result-card field-result">
        <h3>Campo eléctrico total · P</h3>
        <VectorReadout vector={campo} symbol="E" unit="N/C" />
        {probeNearCharge && <p className="notice" role="status">Campo limitado por debajo de 0,75 m y cero en el punto de la carga.</p>}
      </div>}
      {!cargaSeleccionada && !visibility.probe && <p className="helper-text">Selecciona una carga o activa el punto de prueba para ver resultados.</p>}
    </section>
    <details className="panel-section opciones-visualizacion">
      <summary>Opciones de visualización</summary>
      {[
        ['forces', 'Mostrar fuerzas', 'force'],
        ['field', 'Mostrar campo', 'field'],
        ['probe', 'Mostrar punto de prueba', 'probe'],
        ['distances', 'Mostrar línea / distancias', 'distance'],
      ].map(([key, label, color]) => <label className="toggle-row" key={key}>
        <span><i className={`legend-dot ${color}`} />{label}</span>
        <input type="checkbox" checked={visibility[key]} onChange={() => dispatch({ type: 'toggle', key })} />
      </label>)}
      {visibility.probe && (
        <div className="coordinate-fields probe-coordinates">
          <NumericInput label="Punto P · X (m)" value={probePosition[0]} min={-POSITION_LIMIT} max={POSITION_LIMIT} onChange={(value) => moverPuntoPrueba(0, value)} />
          <NumericInput label="Punto P · Y (m)" value={probePosition[1]} min={-POSITION_LIMIT} max={POSITION_LIMIT} onChange={(value) => moverPuntoPrueba(1, value)} />
        </div>
      )}
    </details>

    <div className="panel-footer"><button className="reset-button" onClick={reiniciar}>Reiniciar</button></div>
  </aside>
}
