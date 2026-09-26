import { site } from '../site.config.js'
import { goToSection } from '../lib/links.js'
import { Media } from './Media.jsx'

const TINTS = ['berry', 'citrus', 'cream', 'citrus']

export function Delights({ onAsk }) {
  return (
    <section id="delights" className="section section--deep" aria-labelledby="delights-title">
      <div className="container">
        <header className="section__head">
          <h2 id="delights-title">Our Delights</h2>
          <p>Cocktails, mocktails, and finger foods.</p>
        </header>
        <ul className="delights" role="list">
          {site.categories.map((cat, i) => (
            <li key={cat.id} className="delight">
              <Media
                image={cat.image}
                illustration={cat.illustration}
                tint={TINTS[i % TINTS.length]}
                alt={cat.image?.alt || `Placeholder illustration for ${cat.name.toLowerCase()}`}
                sizes="(min-width: 700px) 45vw, 92vw"
                className="delight__media"
              />
              <div className="delight__body">
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
                <a
                  className="btn btn--soft btn--sm"
                  href="#contact"
                  aria-label={`Ask about ${cat.name.toLowerCase()}`}
                  onClick={(e) => {
                    onAsk(cat.name)
                    goToSection('contact', e)
                  }}
                >
                  Ask about this
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
