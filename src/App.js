import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Lightformer, ContactShadows, Cloud, Sky, Instances, Instance, OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { Effects } from './Effects'
import { useControls } from 'leva'
import { data } from './store'

export default function App() {
  const { range } = useControls({ range: { value: 100, min: 0, max: 300, step: 10 } })
  return (
    <Canvas
      gl={{ logarithmicDepthBuffer: true, antialias: false }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 20], fov: 50 }}
      performance={{ min: 0.1 }}>
      <color attach="background" args={['#15151a']} />
      <hemisphereLight intensity={0.5} />
      <ambientLight intensity={0.5} />
      <ContactShadows resolution={1024} frames={1} position={[0, -1.16, 0]} scale={15} blur={0.5} opacity={1} far={20} />
      <mesh scale={4} position={[3, -1.161, -1.5]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
        <ringGeometry args={[0.9, 1, 4, 1]} />
        <meshStandardMaterial color="white" roughness={0.75} />
      </mesh>
      <mesh scale={4} position={[-3, -1.161, -1]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
        <ringGeometry args={[0.9, 1, 3, 1]} />
        <meshStandardMaterial color="white" roughness={0.75} />
      </mesh>
      <directionalLight intensity={0.3} position={[5, 25, 20]} />
      <Shoes data={data} range={range} />
      {/*
      <Environment preset="city" />
      */}
      {/* We're building a cube-mapped environment declaratively.
          Anything you put in here will be filmed (once) by a cubemap-camera
          and applied to the scenes environment, and optionally background. */}
      <Environment resolution={512}>
        {/* Ceiling */}
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -9]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -3]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 3]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 6]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 9]} scale={[10, 1, 1]} />
        {/* Sides */}
        <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-50, 2, 0]} scale={[100, 2, 1]} />
        <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[50, 2, 0]} scale={[100, 2, 1]} />
        {/* Key */}
        <Lightformer form="ring" color="red" intensity={10} scale={2} position={[10, 5, 10]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </Environment>
      <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} />
      <Effects />
      <OrbitControls autoRotate autoRotateSpeed={1} />
    </Canvas>
  )
}

function Shoes({ data, range }) {
  const { nodes, materials } = useGLTF('/shoe.glb')
  return (
    <Instances range={range} material={materials.phong1SG} geometry={nodes.Shoe.geometry}>
      <group position={[0, 0, 0]}>
        {data.map((props, i) => (
          <Shoe key={i} {...props} />
        ))}
      </group>
    </Instances>
  )
}

function Shoe({ random, color = new THREE.Color(), ...props }) {
  const ref = useRef()
  const [hovered, setHover] = useState(false)
  useFrame((state) => {
    const t = state.clock.getElapsedTime() + random * 10000
    ref.current.rotation.set(Math.cos(t / 4) / 2, Math.sin(t / 4) / 2, Math.cos(t / 1.5) / 2)
    ref.current.position.y = Math.sin(t / 1.5) / 2
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 1.4 : 1, 0.1)
    ref.current.color.lerp(color.set(hovered ? 'red' : 'white'), hovered ? 1 : 0.1)
  })
  return (
    <group {...props}>
      <Instance ref={ref} onPointerOver={(e) => (e.stopPropagation(), setHover(true))} onPointerOut={(e) => setHover(false)} />
    </group>
  )
}
