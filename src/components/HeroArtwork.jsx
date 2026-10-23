import { useId } from 'react'

export default function HeroArtwork() {
  const id = useId().replaceAll(':', '')
  return <svg className="hero-artwork" viewBox="0 0 400 300" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id={`${id}-sphere`} cx="0.29" cy="0.22" r="0.86"><stop stopColor="#b4e5e4" /><stop offset="0.27" stopColor="#4a7e8b" /><stop offset="0.62" stopColor="#162e46" /><stop offset="0.86" stopColor="#101826" /><stop offset="1" stopColor="#4a4373" /></radialGradient>
      <linearGradient id={`${id}-ring`} x1="73" y1="212" x2="310" y2="92" gradientUnits="userSpaceOnUse"><stop stopColor="#214550" /><stop offset="0.38" stopColor="#94e8db" /><stop offset="0.63" stopColor="#497f8c" /><stop offset="1" stopColor="#4a426e" /></linearGradient>
      <radialGradient id={`${id}-light`}><stop stopColor="#63e6d2" stopOpacity="0.08" /><stop offset="1" stopColor="#63e6d2" stopOpacity="0" /></radialGradient>
    </defs>
    <ellipse cx="200" cy="158" rx="190" ry="135" fill={`url(#${id}-light)`} />
    <ellipse cx="205" cy="260" rx="94" ry="9" fill="#000" opacity="0.5" />
    <ellipse cx="200" cy="152" rx="165" ry="64" transform="rotate(-25 200 152)" stroke="#8d7cff" strokeOpacity="0.16" strokeDasharray="2 7" />
    <ellipse cx="200" cy="152" rx="145" ry="51" transform="rotate(-25 200 152)" stroke="#1c3443" strokeWidth="13" />
    <circle cx="200" cy="144" r="76" fill={`url(#${id}-sphere)`} stroke="#93c3d4" strokeOpacity="0.3" />
    <path d="M144 122a59 59 0 0 1 39-35" stroke="#caefed" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M69 201c13 26 81 12 153-22 72-34 122-73 109-100" stroke={`url(#${id}-ring)`} strokeWidth="13" strokeLinecap="round" />
    <path d="M70 197c14 24 81 9 151-24 72-34 122-71 109-97" stroke="#b2f7ea" strokeOpacity="0.5" strokeWidth="1" />
    <circle cx="302" cy="68" r="11" fill={`url(#${id}-sphere)`} />
    <circle cx="87" cy="228" r="5" fill="#8d7cff" />
    <path d="M36 42h28M36 42v28m328 160h-28m28 0v-28" stroke="#365064" strokeWidth="1" />
    <text x="37" y="269" fill="#8294a9" fontSize="8" letterSpacing="2">ESTUDIO DE CAMPO / 01</text>
  </svg>
}
