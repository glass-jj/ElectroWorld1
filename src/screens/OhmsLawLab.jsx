import MenuIcon from '../components/MenuIcon.jsx'
import ScreenLayout from '../components/ScreenLayout.jsx'

export default function OhmsLawLab({ onBack }) {
  return <ScreenLayout title="Ley de Ohm" description="Voltaje, resistencia y corriente en un mismo lugar." onBack={onBack} backLabel="Volver a simuladores" eyebrow="SIMULADORES">
    <section className="ohm-preview" aria-label="Estructura del laboratorio de Ley de Ohm">
      <div className="ohm-preview-heading"><span className="preview-icon"><MenuIcon name="bolt" /></span><span className="coming-soon-badge">En preparación</span></div>
      <p className="ohm-preview-intro">Tu próximo laboratorio</p>
      <dl className="ohm-quantities">
        <div><dt><span className="quantity-symbol">V</span>Voltaje</dt><dd>Voltios <span>V</span></dd></div>
        <div><dt><span className="quantity-symbol">R</span>Resistencia</dt><dd>Ohmios <span>Ω</span></dd></div>
        <div><dt><span className="quantity-symbol">I</span>Corriente</dt><dd>Amperios <span>A</span></dd></div>
      </dl>
      <p className="ohm-preview-note">Esta pantalla está preparada para el futuro simulador. Los controles y cálculos se añadirán más adelante.</p>
    </section>
  </ScreenLayout>
}
