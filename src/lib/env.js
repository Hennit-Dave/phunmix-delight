import { useEffect, useState } from 'react'

const mq = (q) => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q) : null)

export function prefersReducedMotion() {
  return !!mq('(prefers-reduced-motion: reduce)')?.matches
}

/** Phones and small tablets: keep effects light. */
export function isSmallOrTouch() {
  return !!(mq('(max-width: 767px)')?.matches || mq('(pointer: coarse)')?.matches)
}

let webglCache
export function hasWebGL() {
  if (webglCache !== undefined) return webglCache
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    webglCache = !!gl
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    webglCache = false
  }
  return webglCache
}

/** Visitors on data-saver or low-memory devices get the CSS-only versions. */
export function isConstrainedDevice() {
  const n = typeof navigator !== 'undefined' ? navigator : {}
  if (n.connection?.saveData) return true
  if (n.deviceMemory && n.deviceMemory < 4) return true
  if (n.hardwareConcurrency && n.hardwareConcurrency < 4) return true
  return false
}

export function useMediaQuery(query) {
  const [match, setMatch] = useState(() => !!mq(query)?.matches)
  useEffect(() => {
    const m = mq(query)
    if (!m) return
    const on = () => setMatch(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return match
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
