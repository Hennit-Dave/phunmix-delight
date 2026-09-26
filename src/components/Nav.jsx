import { useEffect, useRef, useState } from 'react'
import { site } from '../site.config.js'
import { goToSection } from '../lib/links.js'
import { LiquidGlass } from '../lib/glass.jsx'
import { Close, Menu } from './Icons.jsx'

const LINKS = [
  ['delights', 'Our Delights'],
  ['about', 'About'],
  ['contact', 'Contact'],
]

export function Wordmark() {
  const { logo, name } = site.business
  if (logo?.src)
    return (
      <img
        className="wordmark__logo"
        src={logo.src}
        srcSet={logo.srcSet}
        sizes="120px"
        width={logo.width}
        height={logo.height}
        alt={logo.alt || name}
        decoding="async"
      />
    )
  const [first, ...rest] = name.split(' ')
  return (
    <span className="wordmark__text">
      <span className="wordmark__dot" aria-hidden="true" />
      {first} <span className="wordmark__soft">{rest.join(' ')}</span>
    </span>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const toggleRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onClick = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onClick)
    }
  }, [open])

  const go = (id) => (e) => {
    setOpen(false)
    goToSection(id, e)
  }

  return (
    <header className="nav-wrap" ref={wrapRef} data-html2canvas-ignore="true">
      <LiquidGlass as="nav" className="nav" aria-label="Main" tint={0.28}>
        <a className="wordmark" href="#top" onClick={go('top')} aria-label={`${site.business.name}, back to top`}>
          <Wordmark />
        </a>
        <ul className="nav__links">
          {LINKS.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={go(id)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a className="btn btn--primary btn--sm nav__cta" href="#contact" onClick={go('contact')}>
          Make an enquiry
        </a>
        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <Close /> : <Menu />}
          <span>{open ? 'Close' : 'Menu'}</span>
        </button>
      </LiquidGlass>
      <div id="site-menu" className="nav__menu" hidden={!open}>
        <ul>
          {LINKS.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={go(id)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a className="btn btn--primary" href="#contact" onClick={go('contact')}>
          Make an enquiry
        </a>
      </div>
    </header>
  )
}
