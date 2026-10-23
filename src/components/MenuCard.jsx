import FigmaAsset from './FigmaAsset.jsx'

export default function MenuCard({ title, description, onClick, category, artwork, variant = 'lab', accent = 'cyan' }) {
  return <button type="button" className={`figma-card figma-card--${variant} figma-card--${accent}`} onClick={onClick}>
    <span className="figma-card-category">{variant === 'feature' ? <span className="figma-availability"><FigmaAsset name="available-dot" />{category}</span> : <span>{category}</span>}<FigmaAsset name="arrow-up" /></span>
    <span className={`figma-illustration figma-illustration--${variant}`}><FigmaAsset name={artwork} /></span>
    <span className="figma-card-copy"><span className="figma-card-title">{title}</span><span className="figma-card-description">{description}</span></span>
  </button>
}
