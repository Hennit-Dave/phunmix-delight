import { Illustration } from './Illustration.jsx'
import { isDraft } from '../site.config.js'

/**
 * Shows a genuine photo when one is configured, otherwise a placeholder
 * illustration. In draft mode placeholders carry a visible "Placeholder" label.
 *
 * fit="cover"   fills the frame (use `focus` in config to choose the crop point)
 * fit="contain" shows the whole photo over a soft blurred copy, so products are never cropped out
 */
export function Media({ image, illustration, tint, alt, fit = 'cover', eager = false, sizes, className = '' }) {
  if (image?.src) {
    const common = {
      src: image.src,
      srcSet: image.srcSet,
      sizes,
      width: image.width,
      height: image.height,
      loading: eager ? 'eager' : 'lazy',
      decoding: eager ? 'sync' : 'async',
      fetchPriority: eager ? 'high' : undefined,
    }
    return (
      <div className={`media media--${fit} ${className}`}>
        {fit === 'contain' && <img {...common} alt="" aria-hidden="true" className="media__backdrop" />}
        <img {...common} alt={image.alt || alt} className="media__img" style={image.focus ? { objectPosition: image.focus } : undefined} />
      </div>
    )
  }
  return (
    <div className={`media media--placeholder ${className}`}>
      <Illustration kind={illustration} tint={tint} title={alt} />
      {isDraft && (
        <span className="media__badge">
          Placeholder <span className="media__badge-sub">· add a real photo</span>
        </span>
      )}
    </div>
  )
}
