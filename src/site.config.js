/**
 * Phunmix Delight — site content and settings.
 *
 * Everything a non-developer is likely to change lives in this one file:
 * wording, photos, contact details and colours.
 *
 * ACCURACY RULE: only add details the business has confirmed.
 * Leave a field empty ('' / null / []) when the information is missing.
 * Empty fields are hidden from visitors automatically.
 */

/**
 * Builds a photo entry. Each photo in public/images has two sizes:
 * <name>.webp (full) and <name>-640.webp (small, for phones).
 * alt: describe what is visible in the photo.
 * focus: crop point for fixed-shape frames (CSS object-position).
 */
function photo(name, width, height, alt, { focus, credit } = {}) {
  const small = Math.round((width * 640) / Math.max(width, height))
  return {
    src: `images/${name}.webp`,
    srcSet: `images/${name}-640.webp ${small}w, images/${name}.webp ${width}w`,
    width,
    height,
    alt,
    focus,
    credit,
  }
}

export const site = {
  /**
   * 'draft'   → review mode. Shows a banner listing what still needs confirming,
   *             and "Placeholder" labels on any slot without a photo.
   * 'publish' → public mode. Hides the review banner, hides the gallery until
   *             real photos exist, and removes placeholder labels.
   */
  mode: 'draft',

  /**
   * Visual effects. Both switch themselves off for reduced-motion visitors and
   * browsers without WebGL, and fall back to plain CSS.
   * liquidGlass: nav, enquiry button and photo viewer (desktop; phones only get it on the enquiry button).
   * hero3D: floating garnish accent behind the hero photo (lazy-loaded).
   */
  effects: {
    liquidGlass: true,
    hero3D: true,
  },

  business: {
    name: 'Phunmix Delight',
    city: 'Lagos',
    /** Printed on the cup label in the supplied photos. */
    tagline: 'Delightfully tasty',
    /** Logo with a transparent background. Set to null to use a text wordmark. */
    logo: {
      src: 'images/logo-480.webp',
      srcSet: 'images/logo-480.webp 480w, images/logo-960.webp 960w',
      alt: 'Phunmix Delight',
      width: 905,
      height: 455,
    },
  },

  links: {
    instagram: 'https://www.instagram.com/phunmixdelight/',
    instagramHandle: '@phunmixdelight',
  },

  contact: {
    /**
     * WhatsApp number in international format, digits only.
     * Taken from the Phunmix cup label (0817 258 5231, shown with WhatsApp and phone icons).
     * Leave '' to hide the WhatsApp button.
     */
    whatsappNumber: '2348172585231',
    whatsappMessage: 'Hello Phunmix Delight! I’d like to enquire about your products and how to order.',
    /** Optional. Shown only when filled in. */
    phone: '0817 258 5231',
    phoneLink: 'tel:+2348172585231',
    email: '',
  },

  /**
   * Brand palette, sampled from the Phunmix Delight logo
   * (deep green lettering, lime outline, yellow brush stroke).
   */
  theme: {
    verified: true,
    colors: {
      cream: '#FBF8EC',       // page background
      creamDeep: '#F3EDD3',   // alternate section background
      brand: '#2D4A0C',       // deep logo green: headings, primary buttons
      ink: '#1F2A10',         // body text
      accent: '#9ADB2A',      // logo lime: buttons on dark green, highlights
      accentSoft: '#E6F2C4',  // soft lime fills
      accentText: '#4B6E0E',  // readable green for small labels
      highlight: '#D8C83C',   // logo brush yellow
    },
  },

  hero: {
    /** Main headline. `headlineHighlight` gets the yellow brush-stroke marker. */
    headline: 'Bringing premium mix and eats to',
    headlineHighlight: 'your events.',
    text: 'Explore cocktails, mocktails, and finger foods from Phunmix Delight.',
    /** Main hero photo. Portrait works best. */
    image: photo('blue-frozen-drink', 854, 1280, 'A frozen blue drink topped with blueberries in a Phunmix Delight labelled glass', {
      focus: 'center 62%',
    }),
  },

  /**
   * The four product categories. Do not add flavours, sizes or prices unless supplied.
   * NOTE: which photo shows a cocktail or a mocktail is a best guess
   * from the photos. Confirm with the owner, then set categoryPhotosConfirmed: true.
   */
  categoryPhotosConfirmed: false,
  categories: [
    {
      id: 'cocktails',
      name: 'Cocktails',
      description: 'Explore our cocktail selection.',
      image: photo('red-frozen-glasses', 1280, 852, 'Three frozen red drinks in stemmed glasses, garnished with mint and cherries', {
        credit: 'Hollamedia Details Photography',
      }),
      illustration: 'cocktail',
    },
    {
      id: 'mocktails',
      name: 'Mocktails',
      description: 'Discover refreshing alcohol-free options.',
      image: photo('green-highballs', 1280, 852, 'Three tall green drinks over ice, garnished with rosemary and dried fruit slices', {
        credit: 'Hollamedia Details Photography',
      }),
      illustration: 'mocktail',
    },
    {
      id: 'finger-foods',
      name: 'Finger foods',
      description: 'Explore bites to enjoy alongside your drinks.',
      image: photo('finger-food-cups', 960, 1280, 'Cups of finger foods with spring rolls and grilled meat on beaded picks', {
        focus: 'center 45%',
      }),
      illustration: 'bites',
    },
  ],

  /**
   * Product gallery. Tap to enlarge. Photos are shown whole, never cropped.
   * In 'publish' mode the gallery stays hidden if this list is empty.
   */
  gallery: [
    photo('strawberry-highballs', 1280, 1024, 'Cocktail garnished with strawberry and rosemary', {
      credit: 'Successstar_94 Photography',
    }),
    photo('mango-frozen-glasses', 1280, 976, 'Mocktail garnished with berries and a sprig of rosemary'),
    photo('white-creamy-drinks', 1280, 1024, 'Mocktail topped with wafers', {
      credit: 'Successstar_94 Photography',
    }),
    photo('blue-frozen-drink', 854, 1280, 'Cocktail garnished with blueberries'),
    photo('caramel-cream-glasses', 1280, 852, 'Mocktail garnished with wafers', {
      credit: 'Hollamedia Details Photography',
    }),
    photo('finger-food-cups', 960, 1280, 'Finger foods with spring rolls and grilled chicken'),
  ],

  about: {
    heading: 'About Phunmix Delight',
    text: 'Phunmix Delight is a Lagos business offering cocktails, mocktails, and finger foods. Explore our selection and get in touch to ask about availability and ordering.',
  },

  enquiry: {
    heading: 'Find your next delight.',
    text: 'Contact Phunmix Delight to ask about the selection, availability, and how to order.',
  },
}

/** Placeholder art shown in draft mode while real photos are missing. */
export const placeholderGallery = [
  { illustration: 'mocktail', tint: 'citrus', alt: 'Placeholder illustration of a mocktail' },
  { illustration: 'bites', tint: 'citrus', alt: 'Placeholder illustration of finger foods' },
  { illustration: 'cocktail', tint: 'berry', alt: 'Placeholder illustration of a cocktail' },
  { illustration: 'bites', tint: 'cream', alt: 'Placeholder illustration of finger foods' },
  { illustration: 'cocktail', tint: 'citrus', alt: 'Placeholder illustration of a cocktail' },
  { illustration: 'mocktail', tint: 'berry', alt: 'Placeholder illustration of a mocktail' },
]

/** Lists what is still needed before publishing. Used by the review banner and README. */
export function missingDetails(s = site) {
  const out = []
  if (!s.business.logo) out.push('Logo file (a text wordmark is used for now)')
  if (!s.hero.image) out.push('Hero photo')
  const noPhoto = s.categories.filter((c) => !c.image).map((c) => c.name)
  if (noPhoto.length) out.push(`Category photos: ${noPhoto.join(', ')}`)
  if (!s.gallery.length) out.push('Gallery photos (gallery is hidden in publish mode until added)')
  if (!s.contact.whatsappNumber) out.push('Verified WhatsApp number (WhatsApp button is hidden)')
  if (!s.contact.email) out.push('Optional: an email address for enquiries')
  if (!s.theme.verified) out.push('Brand colours (current palette is a proposal)')
  if (!s.categoryPhotosConfirmed) out.push('Confirm which photos show cocktails and which show mocktails (current picks are a best guess)')
  return out
}

/** Unique photographer credits, shown in the footer. */
export function photoCredits(s = site) {
  const all = [s.hero.image, ...s.categories.map((c) => c.image), ...s.gallery]
  return [...new Set(all.map((p) => p?.credit).filter(Boolean))]
}

export const isDraft = site.mode !== 'publish'
