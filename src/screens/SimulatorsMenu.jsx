import MenuCard from '../components/MenuCard.jsx'
import MenuShell from '../components/MenuShell.jsx'
import FigmaAsset from '../components/FigmaAsset.jsx'

export default function SimulatorsMenu({ onBack, onElectricField, onOhmsLaw, onGames }) {
  return <MenuShell title="Simuladores" section="simulators" onBack={onBack} onHome={onBack} onSimulators={() => {}} onGames={onGames} className="figma-simulators">
    <div className="figma-heading"><h1>Experimenta.<br />Comprende.</h1><p className="figma-introduction">Mueve los controles y observa la física.<br />Cada cambio tiene una explicación.</p></div>
    <MenuCard title="Campo eléctrico" description="Explora cargas, líneas de campo y la fuerza eléctrica en cada punto." category="01 / ELECTROSTÁTICA" artwork="field-preview" onClick={onElectricField} />
    <MenuCard title="Ley de Ohm" description="Relaciona voltaje, resistencia y corriente en un circuito de corriente continua." category="02 / CIRCUITOS ELÉCTRICOS" artwork="ohm-preview" accent="amber" onClick={onOhmsLaw} />
    <p className="figma-menu-tip"><FigmaAsset name="sliders" /><span>Sin riesgo, sin prisa. Reinicia y prueba de nuevo.</span></p>
  </MenuShell>
}
