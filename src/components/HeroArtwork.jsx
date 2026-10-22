import { useId } from 'react'

export default function HeroArtwork() {
  const id = useId().replaceAll(':', '')
  return <svg className="hero-artwork" viewBox="0 0 400 300" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id={`${id}-sphere`} cx="0.29" cy="0.22" r="0.86"><stop stopColor="#e0e1df" /><stop offset="0.32" stopColor="#8a8d8c" /><stop offset="0.65" stopColor="#35383b" /><stop offset="1" stopColor="#111215" /></radialGradient>
      <linearGradient id={`${id}-ring`} x1="73" y1="212" x2="310" y2="92" gradientUnits="userSpaceOnUse"><stop stopColor="#44474a" /><stop offset="0.38" stopColor="#d5d4cc" /><stop offset="0.63" stopColor="#8e908c" /><stop offset="1" stopColor="#282a2c" /></linearGradient>
      <radialGradient id={`${id}-light`}><stop stopColor="#65655c" stopOpacity="0.13" /><stop offset="1" stopColor="#65655c" stopOpacity="0" /></radialGradient>
    </defs>
    <ellipse cx="200" cy="158" rx="190" ry="135" fill={`url(#${id}-light)`} />
    <ellipse cx="205" cy="260" rx="94" ry="9" fill="#000" opacity="0.5" />
    <ellipse cx="200" cy="152" rx="145" ry="51" transform="rotate(-25 200 152)" stroke="#303236" strokeWidth="16" />
    <circle cx="200" cy="144" r="76" fill={`url(#${id}-sphere)`} stroke="#7c7e7b" strokeOpacity="0.25" />
    <path d="M69 201c13 26 81 12 153-22 72-34 122-73 109-100" stroke={`url(#${id}-ring)`} strokeWidth="16" strokeLinecap="round" />
    <path d="M70 197c14 24 81 9 151-24 72-34 122-71 109-97" stroke="#d6d5c9" strokeOpacity="0.27" strokeWidth="1" />
    <circle cx="302" cy="68" r="11" fill={`url(#${id}-sphere)`} />
    <circle cx="87" cy="228" r="5" fill="#94958e" />
    <path d="M36 42h28M36 42v28m328 160h-28m28 0v-28" stroke="#45464b" strokeWidth="1" />
    <text x="37" y="269" fill="#65666d" fontSize="8" letterSpacing="2">ESTUDIO DE CAMPO / 01</text>
  </svg>
}
