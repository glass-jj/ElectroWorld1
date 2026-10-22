import { useId } from 'react'
import './Circuit.css'

export default function OhmControls({ voltage, resistance, onVoltage, onResistance, maxResistance = 100, disabled = false }) {
  const prefix = useId()
  return <div className="ohm-controls">
    <div className="ohm-control">
      <div><label htmlFor={`${prefix}-v`}>Voltaje (V)</label><output>{voltage} V</output></div>
      <input id={`${prefix}-v`} type="range" min="0" max="24" step="1" value={voltage} disabled={disabled} onChange={(event) => onVoltage(Number(event.target.value))} />
      <div className="control-extents"><span>0 V</span><span>24 V</span></div>
    </div>
    <div className="ohm-control">
      <div><label htmlFor={`${prefix}-r`}>Resistencia (Ω)</label><output>{resistance} Ω</output></div>
      <input id={`${prefix}-r`} type="range" min="1" max={maxResistance} step="1" value={resistance} disabled={disabled} onChange={(event) => onResistance(Number(event.target.value))} />
      <div className="control-extents"><span>1 Ω</span><span>{maxResistance} Ω</span></div>
    </div>
  </div>
}
