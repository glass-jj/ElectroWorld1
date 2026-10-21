import MenuIcon from './MenuIcon.jsx'

export default function MenuCard({ title, description, icon, onClick, comingSoon = false, accent = 'mint' }) {
  return <button type="button" className={`menu-card menu-card--${accent}`} onClick={onClick} disabled={comingSoon}>
    <span className="menu-card-icon"><MenuIcon name={icon} /></span>
    <span className="menu-card-copy">
      <span className="menu-card-title">{title}</span>
      {description && <span className="menu-card-description">{description}</span>}
      {comingSoon && <span className="coming-soon-badge">Próximamente</span>}
    </span>
    {!comingSoon && <MenuIcon name="arrow" className="menu-card-arrow" />}
  </button>
}
