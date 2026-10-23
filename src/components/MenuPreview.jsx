import { useId } from 'react'

// Decorative menu artwork only. No canvas, runtime, or simulation state.
function Particle({ id, x, y, sign, tone, className = '' }) {
  return <g className={className}>
    <ellipse cx={x} cy={y + 38} rx="32" ry="5" fill="#000" opacity="0.3" />
    <circle cx={x} cy={y} r="29" fill={`url(#${id}-${tone})`} stroke={tone === 'coral' ? '#FF6F86' : '#63E6D2'} strokeOpacity="0.5" />
    <path d={`M${x - 20} ${y - 5}a22 22 0 0 1 18-17`} stroke="#FFF" strokeOpacity="0.4" strokeLinecap="round" />
    <text x={x} y={y + 9} textAnchor="middle" fill="#F1FBFF" fontSize="29" fontFamily="system-ui, sans-serif" fontWeight="400">{sign}</text>
  </g>
}

function FieldPreview({ id, clash }) {
  return <>
    <ellipse cx="180" cy="115" rx="125" ry="22" stroke="#8D7CFF" strokeOpacity="0.14" />
    {clash ? <g fill="none" strokeWidth="1.5">
      <path d="M147 58h65m-7-5 7 5-7 5" stroke="#63E6D2" strokeOpacity="0.75" />
      <path d="M213 88h-65m7-5-7 5 7 5" stroke="#FF6F86" strokeOpacity="0.65" />
      <path d="M90 29c30-17 150-17 180 0M90 118c30 17 150 17 180 0" stroke="#8D7CFF" strokeOpacity="0.2" strokeDasharray="3 6" />
    </g> : <g fill="none" strokeWidth="1.2" stroke="#63E6D2" strokeOpacity="0.35">
      <path d="M105 69C137 20 223 20 255 69M105 73C143 41 217 41 255 73M105 78C145 111 215 111 255 78M105 83C133 139 227 139 255 83M105 75h150" />
      <path d="M102 58C80-3 280-3 258 58M102 92c-22 61 178 61 156 0" stroke="#8D7CFF" strokeOpacity="0.45" />
      <path d="m177 31 6 3-6 3m0 83 6-3-6-3m-1-43 6 3-6 3" strokeOpacity="0.8" />
    </g>}
    <Particle id={id} x={99} y={75} sign="+" tone="cyan" className="preview-particle preview-particle--positive" />
    <Particle id={id} x={261} y={75} sign="−" tone="coral" className="preview-particle preview-particle--negative" />
    <circle cx="183" cy="34" r="2" fill="#63E6D2" opacity="0.8" />
    <circle cx="181" cy="118" r="2" fill="#8D7CFF" opacity="0.7" />
  </>
}

function CircuitPreview({ id, power }) {
  return <>
    <ellipse cx="180" cy="116" rx="128" ry="20" stroke="#8D7CFF" strokeOpacity="0.12" />
    <path d="M72 62V36h72m72 0h59v15m0 45v24H72V87" fill="none" stroke="#263E50" strokeWidth="3" strokeLinejoin="round" />
    <path d="M72 62V36h72m72 0h59v15m0 45v24H72V87" fill="none" stroke={power ? '#FFB85C' : '#63E6D2'} strokeOpacity="0.55" strokeWidth="1" />
    <path className="preview-current" d="M72 63V36h203v84H72V87" fill="none" stroke={power ? '#FFB85C' : '#63E6D2'} strokeWidth="3" strokeLinecap="round" strokeDasharray="1 38" />
    <rect x="144" y="25" width="72" height="22" rx="6" fill="#181B30" stroke="#8D7CFF" strokeOpacity="0.65" />
    <path d="m153 36 6-5 7 10 7-10 7 10 7-10 7 10 7-10 6 5" stroke="#A99BFF" fill="none" strokeWidth="1.4" />
    <path d="M57 67h30M62 80h20M72 62v5m0 13v7" stroke="#63E6D2" strokeWidth="2.5" strokeLinecap="round" />
    <text x="46" y="63" fill="#92B8C2" fontSize="10">+</text>
    <text x="49" y="87" fill="#92B8C2" fontSize="10">−</text>
    <circle cx="275" cy="71" r="46" fill={`url(#${id}-warm)`} />
    <path d="M260 88c0-9-9-10-9-23a24 24 0 0 1 48 0c0 13-9 14-9 23" fill={`url(#${id}-bulb)`} stroke="#FFCF86" strokeOpacity="0.75" strokeWidth="1.5" />
    <path d="m265 67 6 6 4-6 4 6 6-6m-14 6 2 14m6-14-2 14" fill="none" stroke="#FFE4B1" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M262 89h26m-25 5h24m-20 5h16" stroke="#9D9DB0" strokeWidth="3" strokeLinecap="round" />
    <circle cx="72" cy="120" r="3" fill="#63E6D2" />
    <circle cx="275" cy="36" r="3" fill="#8D7CFF" />
  </>
}

function ShotPreview({ id }) {
  return <>
    <path d="M37 118h279" stroke="#284251" strokeDasharray="3 6" />
    <path d="M65 93Q172-20 278 78" fill="none" stroke="#8D7CFF" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="3 5" />
    <path className="preview-current preview-current--shot" d="M65 93Q172-20 278 78" fill="none" stroke="#63E6D2" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 320" />
    <ellipse cx="276" cy="118" rx="37" ry="7" fill="#8D7CFF" opacity="0.08" />
    <g transform="translate(276 77) rotate(-12)">
      <ellipse rx="28" ry="37" fill="#16182F" stroke="#8D7CFF" strokeWidth="2" />
      <ellipse rx="19" ry="26" stroke="#AC9FFF" strokeOpacity="0.65" />
      <ellipse rx="9" ry="13" fill="#8D7CFF" fillOpacity="0.25" stroke="#C3B9FF" />
      <circle r="3" fill="#DDD6FF" />
    </g>
    <Particle id={id} x={65} y={87} sign="+" tone="cyan" />
    <path d="m117 51 8-5-1 9" fill="none" stroke="#63E6D2" strokeOpacity="0.8" />
  </>
}

export default function MenuPreview({ scene }) {
  const id = useId().replaceAll(':', '')
  return <span className={`menu-preview menu-preview--${scene}`} aria-hidden="true">
    <svg viewBox="0 0 360 150" fill="none" focusable="false">
      <defs>
        <radialGradient id={`${id}-cyan`} cx="0.28" cy="0.2" r="0.85"><stop stopColor="#A5F8EB" /><stop offset="0.34" stopColor="#35A59F" /><stop offset="0.75" stopColor="#10414D" /><stop offset="1" stopColor="#091722" /></radialGradient>
        <radialGradient id={`${id}-coral`} cx="0.28" cy="0.2" r="0.85"><stop stopColor="#FFBEC8" /><stop offset="0.34" stopColor="#C55470" /><stop offset="0.75" stopColor="#60263E" /><stop offset="1" stopColor="#211525" /></radialGradient>
        <radialGradient id={`${id}-warm`}><stop stopColor="#FFB85C" stopOpacity="0.16" /><stop offset="1" stopColor="#FFB85C" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${id}-bulb`} x1="253" y1="45" x2="297" y2="91" gradientUnits="userSpaceOnUse"><stop stopColor="#FFDA99" stopOpacity="0.4" /><stop offset="1" stopColor="#FFB85C" stopOpacity="0.05" /></linearGradient>
      </defs>
      {(scene === 'field' || scene === 'clash') && <FieldPreview id={id} clash={scene === 'clash'} />}
      {(scene === 'circuit' || scene === 'power') && <CircuitPreview id={id} power={scene === 'power'} />}
      {scene === 'shot' && <ShotPreview id={id} />}
    </svg>
  </span>
}
