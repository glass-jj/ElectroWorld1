import MenuIcon from './MenuIcon.jsx'

export default function MenuCard({ title, description, icon, onClick, comingSoon = false, accent = 'mint', index, meta }) {
  return <button type="button" className={`menu-card menu-card--${accent}`} onClick={onClick} disabled={comingSoon}>
    <span className="menu-card-top"><MenuIcon name={icon} /><span className="card-index">{index}</span></span>
    <span className="menu-card-copy"><span className="menu-card-title">{title}</span>{description && <span className="menu-card-description">{description}</span>}</span>
    <span className="menu-card-bottom">{comingSoon ? <span className="coming-soon-badge">Próximamente</span> : <><span>{meta ?? 'Explorar laboratorio'}</span><MenuIcon name="arrow" className="menu-card-arrow" /></>}</span>
  </button>
}
