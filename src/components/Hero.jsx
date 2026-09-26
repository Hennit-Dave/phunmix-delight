import { lazy, Suspense, useEffect, useState } from 'react'
import { site } from '../site.config.js'
import { goToSection, instagramUrl } from '../lib/links.js'
import { hasWebGL, isConstrainedDevice, isSmallOrTouch, useReducedMotion } from '../lib/env.js'
import { Media } from './Media.jsx'
import { ArrowDown, ArrowOut } from './Icons.jsx'

// three.js + R3F load in their own chunk, after the page is interactive.
const Accent3D = lazy(() => import('./HeroAccent3D.jsx'))

function HeroAccent() {
  const reduce = useReducedMotion()
  const [load, setLoad] = useState(false)
  const [ready, setReady] = useState(false)
  const can = !!site.effects?.hero3D && !reduce && hasWebGL()

  useEffect(() => {
    if (!can) return undefined
    const start = () => setLoad(true)
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(start, { timeout: 2000 })
      return () => cancelIdleCallback(id)
    }
    const t = setTimeout(start, 600)
    return () => clearTimeout(t)
  }, [can])

  const showing3D = can && ready
  return (
    <div className="hero__accent" aria-hidden="true" data-html2canvas-ignore="true">
      {/* Plain-CSS garnish: shown with reduced motion, without WebGL, and while the 3D loads */}
      <div className={`accent-css${showing3D ? ' is-hidden' : ''}`}>
        <span className="accent-css__wheel accent-css__wheel--a" />
        <span className="accent-css__wheel accent-css__wheel--b" />
        <span className="accent-css__berry accent-css__berry--a" />
        <span className="accent-css__berry accent-css__berry--b" />
        <span className="accent-css__berry accent-css__berry--c" />
      </div>
      {can && load && (
        <Suspense fallback={null}>
          <Accent3D lite={isSmallOrTouch() || isConstrainedDevice()} onReady={() => setReady(true)} />
        </Suspense>
      )}
    </div>
  )
}

export function Hero() {
  const { headline, headlineHighlight } = site.hero
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">
            Cocktails · Mocktails · Finger foods
          </p>
          <h1 id="hero-title" className="hero__title">
            {headline}{' '}
            {headlineHighlight && <span className="hero__title-accent">{headlineHighlight}</span>}
          </h1>
          <p className="hero__lede">{site.hero.text}</p>
          <div className="hero__actions" id="hero-actions">
            <a className="btn btn--primary" href="#delights" onClick={(e) => goToSection('delights', e)}>
              Explore our delights <ArrowDown />
            </a>
            <a className="btn btn--ghost" href={instagramUrl} target="_blank" rel="noopener noreferrer">
              Enquire on Instagram <ArrowOut />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <div className="hero__visual">
          <HeroAccent />
          <figure className="hero__photo">
            <Media
              image={site.hero.image}
              illustration="duo"
              tint="citrus"
              alt={site.hero.image?.alt || 'Placeholder illustration of a mocktail and a cocktail'}
              eager
              sizes="(min-width: 900px) 460px, 90vw"
            />
          </figure>
        </div>
      </div>
    </section>
  )
}
