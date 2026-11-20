import { useState } from 'react'
import ScreenLayout from '../components/ScreenLayout.jsx'
import Circuito from '../components/Circuito.jsx'
import ControlesOhm from '../components/ControlesOhm.jsx'
import { calculateOhmsLaw as calcularLeyDeOhm } from '../physics/ohmsLaw.js'

const VOLTAJE_INICIAL = 12
const RESISTENCIA_INICIAL = 6

export default function LabOhm({ onBack }) {
  const [voltaje, cambiarVoltaje] = useState(VOLTAJE_INICIAL)
  const [resistencia, cambiarResistencia] = useState(RESISTENCIA_INICIAL)
  const { current: corriente, power: potencia } = calcularLeyDeOhm(voltaje, resistencia)

  function reiniciar() {
    cambiarVoltaje(VOLTAJE_INICIAL)
    cambiarResistencia(RESISTENCIA_INICIAL)
  }

  return (
    <ScreenLayout title="Ley de Ohm" onBack={onBack} backLabel="Volver a simuladores" className="interactive-screen">
      <Circuito corriente={corriente} potencia={potencia} />
      <ControlesOhm voltaje={voltaje} resistencia={resistencia} cambiarVoltaje={cambiarVoltaje} cambiarResistencia={cambiarResistencia} />
      <dl className="ohm-readings" aria-label="Resultados del circuito">
        <div><dt>Corriente</dt><dd>{corriente.toFixed(2)} <small>A</small></dd></div>
        <div><dt>Potencia</dt><dd>{Number(potencia.toFixed(2))} <small>W</small></dd></div>
      </dl>
      <button type="button" className="secondary-mobile-button" onClick={reiniciar}>Reiniciar</button>
    </ScreenLayout>
  )
}
