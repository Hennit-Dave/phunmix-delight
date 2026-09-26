/**
 * Turns the palette in site.config.js into CSS variables, including the
 * derived tints (hover fills, lines, muted text).
 *
 * Tints are computed here as plain hex/rgba rather than with CSS color-mix(),
 * because html2canvas (used by the liquid-glass snapshot) cannot read
 * modern colour functions.
 */
const rgb = (hex) => {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const toHex = (c) => `#${c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`

/** Mix `a` into `b`; `t` is the share of `a` (0–1). Same as color-mix(in srgb, a t%, b). */
export const mix = (a, b, t) => {
  const A = rgb(a)
  const B = rgb(b)
  return toHex(A.map((v, i) => v * t + B[i] * (1 - t)))
}
export const alpha = (hex, a) => `rgba(${rgb(hex).join(', ')}, ${a})`

export function themeVars(c) {
  return {
    '--cream': c.cream,
    '--cream-deep': c.creamDeep,
    '--brand': c.brand,
    '--ink': c.ink,
    '--accent': c.accent,
    '--accent-soft': c.accentSoft,
    '--accent-text': c.accentText,
    '--highlight': c.highlight,
    '--brand-deep': mix(c.brand, '#000000', 0.8),
    '--muted': mix(c.ink, c.cream, 0.74),
    '--card': mix('#ffffff', c.cream, 0.6),
    '--line': alpha(c.brand, 0.14),
    '--brand-wash': alpha(c.brand, 0.08),
    '--brand-glow': alpha(c.brand, 0.08),
    '--brand-shadow': alpha(c.brand, 0.9),
    '--accent-glow': alpha(c.highlight, 0.35),
    '--accent-hover': mix(c.accent, c.accentSoft, 0.45),
    '--accent-bright': mix(c.accent, '#ffffff', 0.8),
    '--highlight-mark': alpha(c.highlight, 0.6),
    '--cream-soft': alpha(c.cream, 0.88),
  }
}

export function applyTheme(colors) {
  const root = document.documentElement.style
  Object.entries(themeVars(colors)).forEach(([k, v]) => root.setProperty(k, v))
}
