# Phunmix Delight — promo site

Single-page site for Phunmix Delight, Lagos (cocktails, mocktails, finger foods).
React + Vite, with a subtle React Three Fiber accent in the hero and liquid-glass
surfaces from [dashersw/liquid-glass-js](https://github.com/dashersw/liquid-glass-js).

```bash
npm install
npm run dev            # local preview
npm run build          # static site → dist/ (upload anywhere: Netlify, Vercel, cPanel…)
npm run build:single   # one self-contained HTML file → dist-single/index.html (for review links)
```

## Updating content

Everything editable is in **`src/site.config.js`**: wording, photos, contact details, colours.

- **Photos** → put files in `public/images/` and add them with the `photo()` helper in the config.
  Export at ~1600px on the long side, WebP or JPEG, under ~300 KB each. Portrait (4:5) suits
  the hero and gallery; landscape (4:3) suits the category cards.
  Every photo needs honest `alt` text describing what is in it.
  Optional `focus: 'center 30%'` on a category photo moves the crop point.
- **WhatsApp** → add the verified number (digits, international format, e.g. `234…`) to
  `contact.whatsappNumber`. The button and pre-filled message appear automatically.
- **Phone / email** → optional, shown only when filled in.
- **Colours** → `theme.colors`. Set `theme.verified: true` once they are the real brand colours.
- **Logo** → `business.logo` (already set to the supplied logo).

### Draft vs publish

`mode: 'draft'` shows a banner listing what still needs confirming (and "Placeholder" labels on any
slot without a photo). Switch to `mode: 'publish'` before launch: the banner and labels disappear, the gallery stays
hidden until real photos are added, and empty contact fields stay hidden.

## Effects (and when they switch off)

| Effect | Where | Falls back to plain CSS when |
| --- | --- | --- |
| Liquid glass | Sticky nav, enquiry button, photo viewer frame | Reduced motion, no WebGL, phones (except the enquiry button), data-saver / low-memory devices |
| 3D garnish (R3F) | Behind the hero photo | Reduced motion or no WebGL. Lazy-loaded after the page is idle, fewer objects on phones, paused when off-screen |

Both can be turned off in `site.config.js → effects`. Neither ever sits on top of a product photo.

Notes on the glass: liquid-glass-js refracts a snapshot of the page taken with html2canvas. The
snapshot is refreshed when images load or the layout changes. html2canvas cannot read CSS
`color-mix()`/`color()`, so derived colours are computed in `src/lib/theme.js` instead.
The library is not on npm; it is vendored in `src/vendor/liquid-glass/` (MIT) with only an import
and an export added.

## Accessibility

Skip link, semantic landmarks, visible focus rings, keyboard-operable menu and photo viewer
(native `<dialog>`: Esc closes, ← → switch photos, focus returns to the photo you opened),
descriptive alt text, no horizontal scrolling, reduced-motion support, AA contrast for text.

## Assets in use

- Logo: `public/images/logo.png` (transparent background, cut from the supplied logo) plus WebP sizes for the nav.
- Photos: 8 supplied Phunmix photos, converted to WebP in two sizes (`name.webp` up to 1280px, `name-640.webp`).
- Contact: 0817 258 5231, taken from the cup label (shown there with WhatsApp and phone icons).
- Colours: sampled from the logo (deep green, lime, brush yellow).


