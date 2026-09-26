/**
 * React wrapper around dashersw/liquid-glass-js.
 *
 * How it works
 * - Every glass surface is first styled as plain CSS frosted glass
 *   (backdrop-filter). That is what visitors see on phones, with reduced
 *   motion, without WebGL, or while the effect loads.
 * - Where allowed, the engine (./glass-engine.js, loaded on demand) mounts a
 *   liquid-glass canvas under the element's content. It refracts one shared
 *   snapshot of the page (html2canvas), refreshed when images load or the
 *   layout changes, and only once scrolling has settled.
 * - Glass surfaces are excluded from the snapshot (data-html2canvas-ignore),
 *   so they never refract themselves. Glass is only used on the nav, the
 *   enquiry button and the lightbox frame; it never sits over product photos.
 */
import { useEffect, useRef, useState } from 'react'
import { hasWebGL, isConstrainedDevice, isSmallOrTouch, prefersReducedMotion } from './env.js'
import { site } from '../site.config.js'

let engine = null
const loadEngine = () => (engine ??= import('./glass-engine.js'))

/** Should the WebGL glass run here? Otherwise the CSS version is used. */
export function glassAllowed({ onMobile = false } = {}) {
  if (!site.effects?.liquidGlass) return false
  if (prefersReducedMotion() || !hasWebGL()) return false
  if (isSmallOrTouch()) return onMobile && !isConstrainedDevice()
  return true
}

/** Call after a layout change (e.g. a banner closes) so the glass refracts the new page. */
export function invalidateGlass() {
  engine?.then((m) => m.invalidate())
}

/**
 * <LiquidGlass shape="pill"> … </LiquidGlass>
 * Renders children on a frosted surface; upgrades to liquid glass where allowed.
 */
export function LiquidGlass({
  as: Tag = 'div',
  shape = 'pill',
  radius = 28,
  tint = 0.22,
  onMobile = false,
  active = true,
  className = '',
  children,
  ...rest
}) {
  const hostRef = useRef(null)
  const layerRef = useRef(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!active || !glassAllowed({ onMobile })) return undefined
    let cleanup = null
    let cancelled = false
    loadEngine()
      .then((m) => m.mountGlass(layerRef.current, hostRef.current, { shape, radius, tint }))
      .then((fn) => {
        if (cancelled) return fn()
        cleanup = fn
        setLive(true)
      })
      .catch((err) => {
        // Stay on the CSS version.
        if (import.meta.env.DEV) console.warn('[glass] using CSS fallback:', err)
      })
    return () => {
      cancelled = true
      cleanup?.()
      setLive(false)
    }
  }, [active, onMobile, shape, radius, tint])

  return (
    <Tag
      ref={hostRef}
      className={`glass glass--${shape}${live ? ' glass--live' : ''} ${className}`}
      data-html2canvas-ignore="true"
      {...rest}
    >
      <span ref={layerRef} className="glass__layer" aria-hidden="true" />
      {children}
    </Tag>
  )
}
