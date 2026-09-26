/**
 * Liquid-glass engine: page snapshot + WebGL panels.
 * Loaded on demand (with html2canvas) only when a glass surface is allowed,
 * so phones and reduced-motion visitors never download it.
 */
import html2canvas from 'html2canvas'
import { Container } from '../vendor/liquid-glass/container.js'
import { isSmallOrTouch } from './env.js'

// Shader settings read by the library. Kept gentle so text behind stays calm.
window.glassControls = {
  edgeIntensity: 0.012,
  rimIntensity: 0.05,
  baseIntensity: 0.01,
  edgeDistance: 0.15,
  rimDistance: 0.8,
  baseDistance: 0.1,
  cornerBoost: 0.02,
  rippleEffect: 0.06,
  blurRadius: 7,
}

/* ---------- shared page snapshot ---------- */

let snapshot = null // { canvas, cssW, cssH }
let pending = null
let dirty = false
let listening = false
let recaptureTimer = 0
let lastScroll = 0
let maxTexture = 0

function getMaxTexture() {
  if (maxTexture) return maxTexture
  try {
    const gl = document.createElement('canvas').getContext('webgl')
    maxTexture = gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 4096
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    maxTexture = 4096
  }
  return maxTexture
}

const idle = () =>
  new Promise((r) => ('requestIdleCallback' in window ? requestIdleCallback(r, { timeout: 1500 }) : setTimeout(r, 200)))

async function capture() {
  const doc = document.documentElement
  const cssW = doc.clientWidth
  const cssH = Math.max(document.body.scrollHeight, doc.scrollHeight)
  const max = getMaxTexture()
  // Phones capture at half resolution: 4x cheaper, and the glass blurs it anyway.
  const scale = Math.min(isSmallOrTouch() ? 0.5 : 1, max / cssH, max / cssW)
  if (scale < 0.2) throw new Error('Page too tall for a glass texture')
  const shot = html2canvas(document.body, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: getComputedStyle(document.body).backgroundColor,
    x: 0,
    y: 0,
    width: cssW,
    height: cssH,
    windowWidth: cssW,
    windowHeight: window.innerHeight,
    scrollX: 0,
    scrollY: 0,
  })
  // Never wait forever (e.g. a slow font or image host): fall back to CSS glass instead.
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Snapshot timed out')), 8000))
  const canvas = await Promise.race([shot, timeout])
  return { canvas, cssW, cssH }
}

function applySnapshot(inst) {
  const r = inst.gl_refs
  const gl = r?.gl
  if (!gl || !snapshot) return
  gl.bindTexture(gl.TEXTURE_2D, r.texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, snapshot.canvas)
  gl.uniform2f(r.textureSizeLoc, snapshot.cssW, snapshot.cssH)
  inst.render?.()
}

function recapture() {
  if (pending) return pending
  pending = (async () => {
    if (document.fonts?.ready) await document.fonts.ready
    await idle()
    const snap = await capture()
    snapshot = snap
    Container.pageSnapshot = snap.canvas
    dirty = false
    Container.instances.forEach(applySnapshot)
    return snap
  })().finally(() => {
    pending = null
  })
  return pending
}

function ensureSnapshot() {
  startListening()
  if (snapshot && !dirty) return Promise.resolve(snapshot)
  return recapture()
}

/** Call after a layout change (e.g. a banner closes) so the glass refracts the new page. */
export function invalidate() {
  dirty = true
  if (!Container.instances.length) return
  clearTimeout(recaptureTimer)
  const wait = () => {
    // Wait until scrolling has settled so the capture never interrupts a swipe.
    const since = performance.now() - lastScroll
    if (since < 700) recaptureTimer = setTimeout(wait, 700 - since)
    else recapture().catch(() => {})
  }
  recaptureTimer = setTimeout(wait, 400)
}

function startListening() {
  if (listening) return
  listening = true
  let width = document.documentElement.clientWidth
  window.addEventListener('scroll', () => (lastScroll = performance.now()), { passive: true })
  window.addEventListener('resize', () => {
    const w = document.documentElement.clientWidth
    if (w !== width) {
      width = w
      invalidate()
    }
  })
  // Lazy images that finish loading change what the glass should show.
  document.addEventListener(
    'load',
    (e) => {
      if (e.target instanceof HTMLImageElement) invalidate()
    },
    true,
  )
}

/* ---------- glass surface ---------- */

class GlassPanel extends Container {
  // Use the shared snapshot canvas directly (the library re-encodes it as a PNG per instance).
  initWebGL() {
    if (!snapshot || !this.gl) return
    this.setupShader(snapshot.canvas)
    this.gl.uniform2f(this.gl_refs.textureSizeLoc, snapshot.cssW, snapshot.cssH)
    this.webglInitialized = true
  }

  // Same render as the library, throttled to one frame and removable on unmount.
  startRenderLoop() {
    const render = () => {
      const r = this.gl_refs
      const gl = r.gl
      if (!gl) return
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(r.scrollYLoc, window.scrollY)
      const p = this.getPosition()
      gl.uniform2f(r.containerPositionLoc, p.x, p.y)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    this.render = render
    this._onScroll = () => {
      if (this._raf) return
      this._raf = requestAnimationFrame(() => {
        this._raf = 0
        render()
      })
    }
    window.addEventListener('scroll', this._onScroll, { passive: true })
    window.addEventListener('resize', this._onScroll)
    render()
  }

  destroy() {
    window.removeEventListener('scroll', this._onScroll)
    window.removeEventListener('resize', this._onScroll)
    cancelAnimationFrame(this._raf)
    const i = Container.instances.indexOf(this)
    if (i > -1) Container.instances.splice(i, 1)
    this.gl_refs?.gl?.getExtension('WEBGL_lose_context')?.loseContext()
    this.gl_refs = {}
    this.gl = null
    this.element?.remove()
  }
}


/** Mounts a liquid-glass canvas into `layer`, sized to `host`. Returns a cleanup function. */
export async function mountGlass(layer, host, { shape, radius, tint }) {
  await ensureSnapshot()
  if (!layer.isConnected) return () => {}
  Container.pageSnapshot = snapshot.canvas // prevents the library starting its own capture
  const panel = new GlassPanel({ type: shape, borderRadius: radius, tintOpacity: tint })
  layer.appendChild(panel.element)
  const refresh = () => {
    panel.updateSizeFromDOM()
    requestAnimationFrame(() => requestAnimationFrame(() => panel.render?.()))
  }
  refresh()
  const ro = new ResizeObserver(refresh)
  ro.observe(host)
  return () => {
    ro.disconnect()
    panel.destroy()
  }
}
