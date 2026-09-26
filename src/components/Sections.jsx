import { useEffect, useState } from 'react'
import { isDraft, missingDetails, site } from '../site.config.js'
import { instagramUrl, goToSection, whatsappUrl } from '../lib/links.js'
import { LiquidGlass, invalidateGlass } from '../lib/glass.jsx'
import { ArrowOut, Chat, Close, Mail, Phone } from './Icons.jsx'
import { Wordmark } from './Nav.jsx'

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container about">
        <h2 id="about-title">{site.about.heading}</h2>
        <div className="about__body">
          <p className="about__text">{site.about.text}</p>
          <dl className="facts">
            <div>
              <dt>Based in</dt>
              <dd>{site.business.city}</dd>
            </div>
            <div>
              <dt>Serving</dt>
              <dd>Cocktails, mocktails, finger foods</dd>
            </div>
            <div>
              <dt>Find us on</dt>
              <dd>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                  Instagram {site.links.instagramHandle}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

export function Contact({ interest }) {
  const wa = whatsappUrl()
  const { phone, email } = site.contact
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact__card">
          <h2 id="contact-title">{site.enquiry.heading}</h2>
          <p className="contact__text">{site.enquiry.text}</p>
          {interest && (
            <p className="contact__interest" role="status">
              Asking about <strong>{interest.toLowerCase()}</strong>? Mention it in your message.
            </p>
          )}
          <div className="contact__actions">
            <a className="btn btn--primary btn--lg" href={instagramUrl} target="_blank" rel="noopener noreferrer">
              Message us on Instagram <ArrowOut />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            {wa && (
              <a className="btn btn--ghost btn--lg" href={wa} target="_blank" rel="noopener noreferrer">
                <Chat /> Enquire on WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
          <p className="contact__handle">{site.links.instagramHandle} on Instagram</p>
          {(phone || email) && (
            <ul className="contact__more" role="list">
              {phone && (
                <li>
                  <Phone /> <a href={site.contact.phoneLink || `tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
                </li>
              )}
              {email && (
                <li>
                  <Mail /> <a href={`mailto:${email}`}>{email}</a>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__row">
        <div className="footer__brand">
          <Wordmark />
          <span>
            {site.business.tagline && <em>{site.business.tagline}</em>}
          </span>
        </div>
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
          Instagram {site.links.instagramHandle}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <small>
          © {new Date().getFullYear()} {site.business.name}
        </small>
      </div>
    </footer>
  )
}

/** Compact enquiry button for phones. Hidden while the hero buttons or the contact section are on screen. */
export function MobileEnquiry() {
  const [heroVisible, setHeroVisible] = useState(true)
  const [contactVisible, setContactVisible] = useState(false)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero-actions')
    const contact = document.getElementById('contact')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) setHeroVisible(e.isIntersecting)
        if (e.target === contact) setContactVisible(e.isIntersecting)
      })
    })
    hero && io.observe(hero)
    contact && io.observe(contact)
    return () => io.disconnect()
  }, [])

  const show = !heroVisible && !contactVisible
  useEffect(() => {
    if (show) setSeen(true)
  }, [show])

  return (
    <div className={`mobile-cta${show ? ' is-shown' : ''}`} aria-hidden={!show} data-html2canvas-ignore="true">
      {/* Liquid glass mounts only once the button has appeared, so the page loads light. */}
      <LiquidGlass shape="pill" onMobile active={seen} tint={0.2} className="mobile-cta__glass">
        <a className="btn btn--primary" href="#contact" tabIndex={show ? 0 : -1} onClick={(e) => goToSection('contact', e)}>
          <Chat /> Make an enquiry
        </a>
      </LiquidGlass>
    </div>
  )
}

export function ReviewBanner() {
  const [open, setOpen] = useState(isDraft)
  if (!open) return null
  const missing = missingDetails()
  return (
    <aside className="review" aria-label="Review notes">
      <div className="container review__row">
        <p>
          <strong>Review draft.</strong> Real photos, logo and contact details are in. A few items still need the owner’s confirmation.
        </p>
        <details>
          <summary>{missing.length} details needed before publishing</summary>
          <ul>
            {missing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <p className="review__hint">
            Add them in <code>src/site.config.js</code>, then set <code>mode: 'publish'</code>.
          </p>
        </details>
        <button
          type="button"
          className="icon-btn icon-btn--on-dark"
          aria-label="Hide review notes"
          onClick={() => {
            setOpen(false)
            invalidateGlass()
          }}
        >
          <Close />
        </button>
      </div>
    </aside>
  )
}
