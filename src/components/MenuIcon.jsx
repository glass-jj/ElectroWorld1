export default function MenuIcon({ name, className = '' }) {
  const paths = {
    back: <path d="m14 6-6 6 6 6M8 12h13" />,
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    flask: <><path d="M9 3h6m-5 0v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M8 15h8" /><path d="M10 18h.01M14 17h.01" /></>,
    game: <><path d="M8 7h8a4 4 0 0 1 3.9 3.1l1.4 6.1a2.3 2.3 0 0 1-3.9 2.1L15 16H9l-2.4 2.3a2.3 2.3 0 0 1-3.9-2.1l1.4-6.1A4 4 0 0 1 8 7Z" /><path d="M8 10v4m-2-2h4m5-1h.01M18 13h.01" /></>,
    bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />,
    atom: <><circle cx="12" cy="12" r="1.5" /><ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" /></>,
    magnet: <path d="M5 4v9a7 7 0 0 0 14 0V4h-5v9a2 2 0 0 1-4 0V4H5ZM5 8h5m4 0h5" />,
  }
  return <svg className={`menu-icon ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] ?? paths.atom}</svg>
}
