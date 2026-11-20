import { useId } from 'react'
import './Circuito.css'

export default function ControlesOhm({ voltaje, resistencia, cambiarVoltaje, cambiarResistencia }) {
  const prefix = useId()
  return <div className="ohm-controls">
    <div className="ohm-control">
      <div><label htmlFor={`${prefix}-v`}>Voltaje (V)</label><output>{voltaje} V</output></div>
      <input id={`${prefix}-v`} type="range" min="0" max="24" step="1" value={voltaje} onChange={(event) => cambiarVoltaje(Number(event.target.value))} />
      <div className="control-extents"><span>0 V</span><span>24 V</span></div>
    </div>
    <div className="ohm-control">
      <div><label htmlFor={`${prefix}-r`}>Resistencia (Ω)</label><output>{resistencia} Ω</output></div>
      <input id={`${prefix}-r`} type="range" min="1" max="100" step="1" value={resistencia} onChange={(event) => cambiarResistencia(Number(event.target.value))} />
      <div className="control-extents"><span>1 Ω</span><span>100 Ω</span></div>
    </div>
  </div>
}
