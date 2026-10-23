import assets from '../assets/figmaManifest.json'

// Original SVG exports with their intrinsic aspect ratios; no remote URLs.
export default function FigmaAsset({ name, className = '' }) {
  const asset = assets[name]
  return <img className={`figma-asset ${className}`} src={`${import.meta.env.BASE_URL}figma/${asset.file}`} width={asset.intrinsicWidth} height={asset.intrinsicHeight} alt="" aria-hidden="true" draggable="false" data-figma-node={asset.nodeId} />
}
