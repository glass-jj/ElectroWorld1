import * as THREE from 'three'
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'

function Charge({ position, color, value }) {
  return (
    <group position={position}>

      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>

      <Text
        position={[0, 0.8, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value > 0 ? "+" : ""}{value} μC
      </Text>

    </group>
  )
}

// The distance marker joins the charge centers below the force vectors.
function DottedLine({ start, end }) {
  const segments = Math.ceil(start.distanceTo(end) / 0.15)

  return (
    <group>
      {Array.from({ length: segments + 1 }, (_, index) => (
        <mesh key={index} position={start.clone().lerp(end, index / segments)}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}
    </group>
  )
}

function ForceVector({ position, direction, length }) {

  if (length <= 0) {
    return null
  }

  const arrowSize = Math.min(0.18, length / 2)
  const lineLength = length - arrowSize * 2

  return (
    <group position={position}>

      {/* Línea del vector */}
      <mesh
  position={[
    direction * (lineLength / 2),
    0,
    0
  ]}
  rotation={[0, 0, Math.PI / 2]}
>

        <cylinderGeometry
          args={[0.025, 0.025, lineLength, 8]}
        />

        <meshBasicMaterial color="red" />

      </mesh>


      {/* Punta de la flecha */}
      <mesh
        position={[
          direction * (lineLength + arrowSize),
          0,
          0
        ]}
        rotation={[
          0,
          0,
          direction === 1
            ? -Math.PI / 2
            : Math.PI / 2
        ]}
      >

        <coneGeometry
          args={[arrowSize, arrowSize * 2, 8]}
        />

        <meshBasicMaterial color="red" />

      </mesh>

    </group>
  )
}

function App() {

  const [q1, setQ1] = useState(5)
  const [q2, setQ2] = useState(-5)
  const [distance, setDistance] = useState(4)
  const charge1 = q1 * 1e-6
  const charge2 = q2 * 1e-6
  const position1 = new THREE.Vector3(-distance / 2, 0, 0)
  const position2 = new THREE.Vector3(distance / 2, 0, 0)
  const forceDirection1 = charge1 * charge2 < 0 ? 1 : -1
  const forceDirection2 = -forceDirection1
  const getChargeColor = (charge) => {
    if (charge > 0) return 'blue'
    if (charge < 0) return 'red'
    return 'gray'
  }

  const k = 8.99e9
  const force = k * Math.abs(charge1 * charge2) / distance ** 2
  // Keep attraction arrows apart at short distances; length is a visual scale.
  const forceLength = force === 0
    ? 0
    : Math.min(1.5, 0.5 + Math.sqrt(force) * 5, (distance - 1) / 2)
  const vectorPosition1 = position1.clone().add(new THREE.Vector3(forceDirection1 * 0.5, 0, 0))
  const vectorPosition2 = position2.clone().add(new THREE.Vector3(forceDirection2 * 0.5, 0, 0))


  return (
  <div className="app">

    <div className="panel">

      <h1>ElectroWorld </h1>

      <label htmlFor="charge-1">
        Carga 1 (μC)
      </label>

      <input
        id="charge-1"
        type="number"
        value={q1}
        onChange={(e) => setQ1(Number(e.target.value))}
      />

      <label htmlFor="charge-2">
        Carga 2 (μC)
      </label>

      <input
        id="charge-2"
        type="number"
        value={q2}
        onChange={(e) => setQ2(Number(e.target.value))}
      />

      <label htmlFor="distance">Distancia entre cargas (m)</label>
      <input
        id="distance"
        type="range"
        min="1.5"
        max="8"
        step="0.1"
        value={distance}
        aria-valuetext={`${distance.toFixed(2)} metros`}
        onChange={(event) => setDistance(Number(event.target.value))}
      />

      <p>
        Distancia: {distance.toFixed(2)} m
      </p>

      <p>
        Fuerza: {force.toFixed(4)} N
      </p>

    </div>

    <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>



      <ambientLight intensity={0.5} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
      />

      <Charge
        position={position1}
        color={getChargeColor(q1)}
        value={q1}
      />







      <Charge
        position={position2}
       color={getChargeColor(q2)}
        value={q2}
      />

      <DottedLine
        start={position1.clone().add(new THREE.Vector3(0, -0.8, 0))}
        end={position2.clone().add(new THREE.Vector3(0, -0.8, 0))}
      />

<ForceVector
  position={vectorPosition1}
  direction={forceDirection1}
  length={forceLength}
/>

<ForceVector
  position={vectorPosition2}
  direction={forceDirection2}
  length={forceLength}
/>

<OrbitControls />

    </Canvas>
      </div>

  )
}

export default App
