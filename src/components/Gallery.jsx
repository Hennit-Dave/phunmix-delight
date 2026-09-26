import { useCallback, useEffect, useRef, useState } from 'react'
import { isDraft, placeholderGallery, site } from '../site.config.js'
import { LiquidGlass } from '../lib/glass.jsx'
import { Media } from './Media.jsx'
import { ChevronLeft, ChevronRight, Close, Expand } from './Icons.jsx'

function useGalleryItems() {
  if (site.gallery.length) return site.gallery.map((img) => ({ image: img, alt: img.alt }))
  if (isDraft) return placeholderGallery.map((p) => ({ ...p, image: null }))
  return [] // publish mode without photos: hide the section
}

function Lightbox({ items, index, onClose, onStep }) {
  const ref = useRef(null)
  const open = index !== null
  const item = open ? items[index] : null

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      document.documentElement.classList.add('is-locked')
      d.querySelector('.icon-btn--close')?.focus()
    }
    if (!open && d.open) d.close()
  }, [open])

  useEffect(() => {
    const d = ref.current
    if (!d) return undefined
    const onCancel = () => {
      document.documentElement.classList.remove('is-locked')
      onClose()
    }
    d.addEventListener('close', onCancel)
    return () => d.removeEventListener('close', onCancel)
  }, [onClose])

  const onKey = (e) => {
    if (e.key === 'ArrowRight') onStep(1)
    if (e.key === 'ArrowLeft') onStep(-1)
  }

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label="Photo viewer"
      onKeyDown={onKey}
      onClick={(e) => e.target === ref.current && ref.current.close()}
    >
      {item && (
        <LiquidGlass shape="rounded" radius={28} tint={0.18} active={open} className="lightbox__panel">
          <figure className="lightbox__figure">
            <Media
              image={item.image}
              illustration={item.illustration}
              tint={item.tint}
              alt={item.alt}
              fit="contain"
              eager
              className="lightbox__media"
            />
            <div className="lightbox__controls">
              <button type="button" className="icon-btn" onClick={() => onStep(-1)} aria-label="Previous photo">
                <ChevronLeft />
              </button>
              <button type="button" className="icon-btn" onClick={() => onStep(1)} aria-label="Next photo">
                <ChevronRight />
              </button>
              <button type="button" className="icon-btn icon-btn--close" onClick={() => ref.current.close()} aria-label="Close photo viewer">
                <Close />
              </button>
            </div>
            <figcaption>
              <span>{item.alt}</span>
              <span className="lightbox__count" aria-label={`Photo ${index + 1} of ${items.length}`}>
                {index + 1} / {items.length}
              </span>
            </figcaption>
          </figure>
        </LiquidGlass>
      )}
    </dialog>
  )
}

export function Gallery() {
  const items = useGalleryItems()
  const [index, setIndex] = useState(null)
  const lastTrigger = useRef(null)

  const close = useCallback(() => {
    setIndex(null)
    // Return focus to the photo that opened the viewer
    requestAnimationFrame(() => lastTrigger.current?.focus())
  }, [])
  const step = useCallback((d) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length])

  if (!items.length) return null

  return (
    <section id="gallery" className="section" aria-labelledby="gallery-title">
      <div className="container">
        <header className="section__head">
          <h2 id="gallery-title">Gallery</h2>
          <p>Tap a photo to see it larger.</p>
        </header>
        <ul className="gallery" role="list">
          {items.map((item, i) => (
            <li key={i}>
              <button
                type="button"
                className="gallery__tile"
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget
                  setIndex(i)
                }}
                aria-label={`View larger: ${item.alt}`}
              >
                <Media image={item.image} illustration={item.illustration} tint={item.tint} alt={item.alt} fit="contain" sizes="(min-width: 900px) 33vw, 50vw" />
                <span className="gallery__zoom" aria-hidden="true">
                  <Expand width={18} height={18} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Lightbox items={items} index={index} onClose={close} onStep={step} />
    </section>
  )
}
