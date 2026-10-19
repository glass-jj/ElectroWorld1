import * as THREE from 'three'
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls,Text } from '@react-three/drei'

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

function DottedLine({ direction }) {

  const points = []

  for (let i = 0; i < 20; i++) {

    const x = -1.2 + (2.65 / 20) * i

    points.push(x)
  }

 return (
  <group>

    {points.map((x, index) => (

      <mesh
        key={index}
        position={[x, 0, 0]}
      >

        <sphereGeometry args={[0.04, 8, 8]} />

        <meshBasicMaterial color="white" />

      </mesh>

    ))}

    <mesh
  position={[1.3 * direction, 0, 0]}
  rotation={[
    0,
    0,
    direction === 1
      ? -Math.PI / 2
      : Math.PI / 2
  ]}
>

      <coneGeometry args={[0.12, 0.3, 8]} />

      <meshBasicMaterial color="white" />

    </mesh>

  </group>
)
}
function ForceVector({ position, direction, length }) {

  if (length <= 0) {
    return null
  }

  const arrowSize = 0.18
  const lineLength = length - arrowSize

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
          direction * lineLength,
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
  const charge1 = q1 * 1e-6
  const charge2 = q2 * 1e-6
  const position1 = new THREE.Vector3(-2, 0, 0)
  const position2 = new THREE.Vector3(2, 0, 0)
  const distance = position1.distanceTo(position2)
  const direction = charge1 * charge2 > 0 ? -1 : 1
  const forceDirection1 = charge1 * charge2 < 0 ? 1 : -1
  const forceDirection2 = -forceDirection1
  const getChargeColor = (charge) => {
  if (charge > 0) {
    return "blue"
  }

  if (charge < 0) {
    return "red"
  }

  return "gray"
}
  

  const k = 8.99e9
  

  const force =
  k * Math.abs(charge1 * charge2) / Math.pow(distance, 2)
  const forceLength =
  Math.min(
    1.5,
    0.5 + Math.sqrt(force) * 5
  )

console.log("Dirección:", direction)


  return (
  <div className="app">

    <div className="panel">

      <h1>ElectroWorld </h1>

      <label>
        Carga 1 (μC)
      </label>

      <input
        type="number"
        value={q1}
        onChange={(e) => setQ1(Number(e.target.value))}
      />

      <label>
        Carga 2 (μC)
      </label>

      <input
        type="number"
        value={q2}
        onChange={(e) => setQ2(Number(e.target.value))}
      />

      <p>
        Distancia: {distance.toFixed(2)} m
      </p>

      <p>
        Fuerza: {force.toFixed(4)} N
      </p>

    </div>

    <Canvas>
      
      

      <ambientLight intensity={0.5} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
      />

      <Charge
        position={[-2, 0, 0]} 
        color={getChargeColor(q1)}
        value={q1}
      />







      <Charge
        position={[2, 0, 0]}
       color={getChargeColor(q2)}
        value={q2}
      />

      <DottedLine direction={direction} />

<ForceVector
  position={[-2.5, 0, 0]}
  direction={forceDirection1}
  length={forceLength}
/>

<ForceVector
  position={[2.5, 0, 0]}
  direction={forceDirection2}
  length={forceLength}
/>

<OrbitControls />

      <OrbitControls />

    </Canvas>
      </div>

  )
}

export default App