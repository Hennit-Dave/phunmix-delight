import { site } from '../site.config.js'

export function whatsappUrl() {
  const digits = (site.contact.whatsappNumber || '').replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(site.contact.whatsappMessage)}`
}

export const instagramUrl = site.links.instagram

/** Smooth-scrolls to a section and moves focus there for keyboard and screen-reader users. */
export function goToSection(id, event) {
  const el = document.getElementById(id)
  if (!el) return
  event?.preventDefault()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
  try {
    history.replaceState(null, '', `#${id}`)
  } catch {
    /* sandboxed previews may block history */
  }
}
