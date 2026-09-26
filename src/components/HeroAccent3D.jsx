/**
 * Subtle React Three Fiber accent: lime and orange wheels, berries and bubbles drifting
 * behind the hero photo. It sits under the photo (never on top of it), pauses
 * when scrolled out of view, and uses fewer objects and a lower pixel ratio on phones.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { site } from '../site.config.js'

function citrusTexture(peel, pith, flesh) {
  const s = 256
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d')
  g.translate(s / 2, s / 2)
  const disc = (r, color) => {
    g.fillStyle = color
    g.beginPath()
    g.arc(0, 0, r, 0, Math.PI * 2)
    g.fill()
  }
  disc(128, peel)
  disc(114, pith)
  const n = 10
  const step = (Math.PI * 2) / n
  for (let i = 0; i < n; i++) {
    const a0 = i * step + 0.06
    const a1 = (i + 1) * step - 0.06
    g.fillStyle = flesh
    g.beginPath()
    g.moveTo(Math.cos((a0 + a1) / 2) * 14, Math.sin((a0 + a1) / 2) * 14)
    g.arc(0, 0, 104, a0, a1)
    g.closePath()
    g.fill()
  }
  disc(12, pith)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const pointer = { x: 0, y: 0 }

function Drift({ position, speed = 1, amp = 0.18, spin = [0.2, 0.3, 0], phase = 0, children }) {
  const ref = useRef()
  useFrame((state, delta) => {
    const o = ref.current
    if (!o) return
    const t = state.clock.elapsedTime * speed + phase
    o.position.y = position[1] + Math.sin(t) * amp
    o.position.x = position[0] + Math.cos(t * 0.6) * amp * 0.4
    o.rotation.x += spin[0] * delta
    o.rotation.y += spin[1] * delta
    o.rotation.z += spin[2] * delta
  })
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  )
}

function Wheel({ tex, peel, scale = 1, tilt = [1.2, 0, 0.3] }) {
  return (
    <mesh scale={scale} rotation={tilt}>
      <cylinderGeometry args={[1, 1, 0.16, 48]} />
      <meshStandardMaterial attach="material-0" color={peel} roughness={0.55} />
      <meshStandardMaterial attach="material-1" map={tex} roughness={0.4} />
      <meshStandardMaterial attach="material-2" map={tex} roughness={0.4} />
    </mesh>
  )
}

function Berry({ color, r = 0.3 }) {
  return (
    <mesh scale={r}>
      <sphereGeometry args={[1, 32, 20]} />
      <meshStandardMaterial color={color} roughness={0.28} />
    </mesh>
  )
}

function Bubble({ r = 0.2 }) {
  return (
    <mesh scale={r}>
      <sphereGeometry args={[1, 24, 16]} />
      <meshStandardMaterial color="#ffffff" roughness={0.08} transparent opacity={0.55} />
    </mesh>
  )
}

function Leaf({ color }) {
  return (
    <mesh scale={[0.55, 0.08, 0.26]}>
      <sphereGeometry args={[1, 24, 12]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
  )
}

function Scene({ lite }) {
  // Garnishes that appear in the Phunmix photos: lime (the logo), orange, blueberries, strawberries, mint
  const { accent } = site.theme.colors
  const lime = useMemo(() => citrusTexture('#5FA82A', '#F3F9D9', accent), [accent])
  const orange = useMemo(() => citrusTexture('#F47B20', '#FFF1D6', '#FFB24D'), [])
  const group = useRef()
  useEffect(() => () => [lime, orange].forEach((t) => t.dispose()), [lime, orange])

  useFrame(() => {
    const g = group.current
    if (!g) return
    // Gentle parallax that follows the mouse (desktop only; phones have no hover pointer)
    g.rotation.y += (pointer.x * 0.12 - g.rotation.y) * 0.04
    g.rotation.x += (-pointer.y * 0.08 - g.rotation.x) * 0.04
  })

  return (
    <group ref={group}>
      <Drift position={[-2.4, 2.15, -0.4]} speed={0.7} spin={[0.1, 0.25, 0]}>
        <Wheel tex={lime} peel="#5FA82A" scale={0.8} />
      </Drift>
      <Drift position={[2.45, -2.05, -0.8]} speed={0.55} phase={2} spin={[0.15, -0.2, 0]}>
        <Wheel tex={orange} peel="#F47B20" scale={0.68} tilt={[1.4, 0, -0.4]} />
      </Drift>
      <Drift position={[2.45, 2.35, 0]} speed={0.9} phase={1}>
        <Berry color="#3F4A8A" r={0.3} />
      </Drift>
      <Drift position={[-2.5, -2.3, 0.2]} speed={0.8} phase={3}>
        <Berry color="#C8243A" r={0.3} />
      </Drift>
      <Drift position={[-2.55, 0.2, 0.4]} speed={1.1} phase={4}>
        <Bubble r={0.2} />
      </Drift>
      {!lite && (
        <>
          <Drift position={[2.6, 0.35, 0.3]} speed={0.6} phase={5} spin={[0.2, 0.4, 0.1]}>
            <Leaf color="#4F8A1E" />
          </Drift>
          <Drift position={[-2.1, -2.75, -0.6]} speed={0.9} phase={6}>
            <Berry color="#3F4A8A" r={0.24} />
          </Drift>
          <Drift position={[2.2, 1.2, -0.3]} speed={1.2} phase={0.5}>
            <Bubble r={0.14} />
          </Drift>
          <Drift position={[-2.2, 2.9, 0.1]} speed={1} phase={2.5}>
            <Bubble r={0.12} />
          </Drift>
        </>
      )}
    </group>
  )
}

export default function HeroAccent3D({ lite = false, onReady }) {
  const wrap = useRef(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = wrap.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' })
    io.observe(el)
    const onVis = () => setVisible(!document.hidden && el.getBoundingClientRect().bottom > 0)
    document.addEventListener('visibilitychange', onVis)
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    if (!lite) window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onMove)
    }
  }, [lite])

  return (
    <div ref={wrap} className="accent-3d">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={lite ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 40 }}
        gl={{ antialias: !lite, alpha: true, powerPreference: 'low-power' }}
        onCreated={() => requestAnimationFrame(() => onReady?.())}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 5, 6]} intensity={2.2} />
        <directionalLight position={[-4, -2, 3]} intensity={0.6} color="#F3F9D9" />
        <Scene lite={lite} />
      </Canvas>
    </div>
  )
}
