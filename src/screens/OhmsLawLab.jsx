import { useState } from 'react'
import ScreenLayout from '../components/ScreenLayout.jsx'
import Circuit from '../components/Circuit.jsx'
import OhmControls from '../components/OhmControls.jsx'
import { calculateOhmsLaw } from '../physics/ohmsLaw.js'

export default function OhmsLawLab({ onBack }) {
  const [voltage, setVoltage] = useState(12)
  const [resistance, setResistance] = useState(6)
  const [message, setMessage] = useState('Mueve los controles y observa el circuito.')
  const values = calculateOhmsLaw(voltage, resistance)
  function changeVoltage(next) {
    setVoltage(next)
    setMessage(next === 0 ? 'Sin diferencia de potencial no circula corriente.' : next > voltage ? 'Más voltaje → más corriente.' : 'Menos voltaje → menos corriente.')
  }
  function changeResistance(next) {
    setResistance(next)
    setMessage(voltage === 0 ? 'Sin diferencia de potencial no circula corriente.' : next > resistance ? 'Más resistencia → menos corriente.' : 'Menos resistencia → más corriente.')
  }
  return <ScreenLayout title="Ley de Ohm" description="Ajusta la energía. Mira cómo responde el circuito." onBack={onBack} backLabel="Volver a simuladores" eyebrow="LABORATORIO" className="interactive-screen">
    <Circuit current={values.current} power={values.power} />
    <p className="ohm-explanation" role="status">{message}</p>
    <OhmControls voltage={voltage} resistance={resistance} onVoltage={changeVoltage} onResistance={changeResistance} />
    <dl className="ohm-readings" aria-label="Resultados del circuito">
      <div><dt>Voltaje</dt><dd>{values.voltage} <small>V</small></dd></div>
      <div><dt>Resistencia</dt><dd>{values.resistance} <small>Ω</small></dd></div>
      <div><dt>Corriente</dt><dd>{values.current.toFixed(2)} <small>A</small></dd></div>
      <div><dt>Potencia</dt><dd>{Number(values.power.toFixed(2))} <small>W</small></dd></div>
    </dl>
    <p className="ohm-formula">I = V / R &nbsp; · &nbsp; P = V × I</p>
  </ScreenLayout>
}
