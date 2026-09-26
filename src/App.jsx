import { useLayoutEffect, useState } from 'react'
import { site } from './site.config.js'
import { applyTheme } from './lib/theme.js'
import { Nav } from './components/Nav.jsx'
import { Hero } from './components/Hero.jsx'
import { Delights } from './components/Delights.jsx'
import { Gallery } from './components/Gallery.jsx'
import { About, Contact, Footer, MobileEnquiry, ReviewBanner } from './components/Sections.jsx'

export default function App() {
  const [interest, setInterest] = useState(null)

  // Colours come from site.config.js so they can be changed in one place.
  useLayoutEffect(() => {
    applyTheme(site.theme.colors)
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ReviewBanner />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Delights onAsk={setInterest} />
        <Gallery />
        <About />
        <Contact interest={interest} />
      </main>
      <Footer />
      <MobileEnquiry />
    </>
  )
}
