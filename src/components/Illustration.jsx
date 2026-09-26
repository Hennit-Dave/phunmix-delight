import { useId } from 'react'

/**
 * Flat placeholder illustrations used until genuine Phunmix photos are supplied.
 * They are generic on purpose: no specific flavours, ingredients or portions.
 */

const TINTS = {
  citrus: { bg: '#FFE2C2', sun: '#FFC98F' },
  berry: { bg: '#F8DCE6', sun: '#F0BCD0' },
  cream: { bg: '#FBEBD5', sun: '#F6D5AB' },
}

const glass = { fill: 'rgba(255,255,255,0.38)', stroke: '#FFFFFF', strokeWidth: 3 }

function Cocktail({ id }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-ck`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D23F6E" />
          <stop offset="1" stopColor="#7A1244" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="442" rx="92" ry="12" fill="rgba(59,20,38,0.10)" />
      <ellipse cx="200" cy="430" rx="62" ry="12" {...glass} />
      <rect x="195" y="300" width="10" height="130" rx="4" fill="rgba(255,255,255,0.7)" />
      <path d="M110 190 Q110 302 200 306 Q290 302 290 190 Z" {...glass} />
      <path d="M119 214 Q124 292 200 296 Q276 292 281 214 Z" fill={`url(#${id}-ck)`} />
      <ellipse cx="200" cy="214" rx="81" ry="10" fill="#E0648A" />
      <ellipse cx="200" cy="190" rx="90" ry="12" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M135 232 Q140 270 170 284" stroke="rgba(255,255,255,0.55)" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* citrus wheel on the rim */}
      <g transform="translate(272 176) rotate(-18)">
        <circle r="36" fill="#F47B20" />
        <circle r="30" fill="#FFF1D6" />
        <circle r="27" fill="#FFB24D" />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="0" y1="0" x2={27 * Math.cos((i * Math.PI) / 4)} y2={27 * Math.sin((i * Math.PI) / 4)} stroke="#FFF1D6" strokeWidth="2.5" />
        ))}
        <circle r="4" fill="#FFF1D6" />
      </g>
      {/* cherry */}
      <path d="M150 204 Q146 170 168 150" stroke="#3E7B3A" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="150" cy="210" r="15" fill="#A8123A" />
      <circle cx="145" cy="204" r="4" fill="rgba(255,255,255,0.7)" />
    </g>
  )
}

function Mocktail({ id }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-mk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC867" />
          <stop offset="1" stopColor="#F47B20" />
        </linearGradient>
        <pattern id={`${id}-st`} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="16" height="16" fill="#FFFFFF" />
          <rect width="8" height="16" fill="#6B1140" />
        </pattern>
        <clipPath id={`${id}-mc`}>
          <rect x="146" y="198" width="108" height="216" rx="10" />
        </clipPath>
      </defs>
      <ellipse cx="200" cy="440" rx="86" ry="11" fill="rgba(59,20,38,0.10)" />
      <rect x="226" y="70" width="12" height="220" rx="6" fill={`url(#${id}-st)`} transform="rotate(14 232 180)" />
      <rect x="140" y="150" width="120" height="276" rx="16" {...glass} />
      <g clipPath={`url(#${id}-mc)`}>
        <rect x="146" y="198" width="108" height="216" fill={`url(#${id}-mk)`} />
        <rect x="160" y="200" width="40" height="36" rx="7" fill="rgba(255,255,255,0.55)" transform="rotate(-12 180 218)" />
        <rect x="200" y="214" width="38" height="34" rx="7" fill="rgba(255,255,255,0.45)" transform="rotate(10 219 231)" />
        <rect x="170" y="244" width="36" height="32" rx="7" fill="rgba(255,255,255,0.4)" transform="rotate(6 188 260)" />
        {[
          [170, 330, 5],
          [214, 360, 4],
          [190, 388, 6],
          [230, 300, 3.5],
          [162, 290, 3],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.6)" />
        ))}
      </g>
      <path d="M156 214 L156 400" stroke="rgba(255,255,255,0.6)" strokeWidth="6" strokeLinecap="round" />
      {/* mint */}
      <ellipse cx="206" cy="182" rx="12" ry="26" fill="#3E7B3A" transform="rotate(-40 206 182)" />
      <ellipse cx="224" cy="186" rx="10" ry="22" fill="#5A9A4F" transform="rotate(30 224 186)" />
      {/* citrus wheel on the rim */}
      <g transform="translate(148 164)">
        <circle r="32" fill="#F2B51C" />
        <circle r="26" fill="#FFF3C4" />
        <circle r="23" fill="#FFD95A" />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="0" y1="0" x2={23 * Math.cos((i * Math.PI) / 4)} y2={23 * Math.sin((i * Math.PI) / 4)} stroke="#FFF3C4" strokeWidth="2.5" />
        ))}
      </g>
    </g>
  )
}

function Parfait({ id }) {
  const cup = 'M128 176 L146 418 Q200 432 254 418 L272 176 Z'
  return (
    <g>
      <defs>
        <clipPath id={`${id}-pc`}>
          <path d={cup} />
        </clipPath>
        <pattern id={`${id}-gr`} width="22" height="22" patternUnits="userSpaceOnUse">
          <rect width="22" height="22" fill="#D9A45B" />
          <circle cx="5" cy="6" r="3" fill="#B97A33" />
          <circle cx="15" cy="15" r="3.5" fill="#EBC17F" />
          <circle cx="17" cy="4" r="2" fill="#9C6124" />
        </pattern>
      </defs>
      <ellipse cx="200" cy="440" rx="92" ry="11" fill="rgba(59,20,38,0.10)" />
      {/* spoon */}
      <rect x="244" y="80" width="10" height="150" rx="5" fill="#E7D6C4" transform="rotate(16 249 155)" />
      <g clipPath={`url(#${id}-pc)`}>
        <rect x="100" y="170" width="200" height="270" fill="#FFF6E6" />
        <path d="M100 216 Q150 206 200 216 T300 214 V256 Q250 264 200 254 T100 258 Z" fill="#F7A43A" />
        <path d="M100 300 Q150 292 200 302 T300 298 V334 Q250 342 200 332 T100 336 Z" fill={`url(#${id}-gr)`} />
        <path d="M100 336 Q150 328 200 338 T300 334 V384 Q250 392 200 382 T100 386 Z" fill="#9E1B4F" />
      </g>
      <path d={cup} fill="rgba(255,255,255,0.18)" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M144 196 L158 400" stroke="rgba(255,255,255,0.6)" strokeWidth="6" strokeLinecap="round" />
      {/* toppings */}
      <ellipse cx="200" cy="178" rx="72" ry="14" fill="#FFF6E6" />
      <circle cx="172" cy="168" r="14" fill="#A8123A" />
      <circle cx="196" cy="160" r="12" fill="#3B2A6B" />
      <circle cx="220" cy="168" r="13" fill="#A8123A" />
      <circle cx="238" cy="160" r="9" fill="#3B2A6B" />
      <circle cx="168" cy="163" r="3.5" fill="rgba(255,255,255,0.7)" />
      <ellipse cx="208" cy="146" rx="9" ry="20" fill="#3E7B3A" transform="rotate(-30 208 146)" />
    </g>
  )
}

function Bites() {
  const roll = (x, y, r) => (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect x="-64" y="-17" width="128" height="34" rx="17" fill="#E3A04A" />
      <rect x="-64" y="-17" width="128" height="12" rx="6" fill="#F0BC6E" />
      {[-36, -10, 16, 42].map((dx) => (
        <path key={dx} d={`M${dx} -16 l-10 32`} stroke="#C07A2C" strokeWidth="3" strokeLinecap="round" />
      ))}
    </g>
  )
  const ball = (cx, cy, r) => (
    <g key={`${cx}-${cy}`}>
      <circle cx={cx} cy={cy} r={r} fill="#C9772C" />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.35} r={r * 0.35} fill="#E3A04A" />
    </g>
  )
  return (
    <g>
      <ellipse cx="200" cy="360" rx="176" ry="74" fill="rgba(59,20,38,0.10)" />
      <ellipse cx="200" cy="344" rx="170" ry="72" fill="#FFFFFF" />
      <ellipse cx="200" cy="344" rx="136" ry="54" fill="#FFF7EC" stroke="#F1DEC6" strokeWidth="3" />
      {/* dip */}
      <ellipse cx="300" cy="318" rx="42" ry="20" fill="#F4E6D6" />
      <ellipse cx="300" cy="314" rx="34" ry="14" fill="#C43B2A" />
      <ellipse cx="292" cy="310" rx="10" ry="4" fill="rgba(255,255,255,0.35)" />
      {roll(160, 320, -14)}
      {roll(178, 352, -10)}
      {[ball(250, 360, 22), ball(290, 368, 20), ball(118, 364, 20), ball(228, 330, 18)]}
      {/* herb sprig */}
      <ellipse cx="132" cy="312" rx="7" ry="14" fill="#3E7B3A" transform="rotate(-50 132 312)" />
      <ellipse cx="120" cy="322" rx="6" ry="12" fill="#5A9A4F" transform="rotate(20 120 322)" />
    </g>
  )
}

const PIECES = { cocktail: Cocktail, mocktail: Mocktail, parfait: Parfait, bites: Bites }

export function Illustration({ kind = 'mocktail', tint = 'cream', title, className = '' }) {
  const id = useId().replace(/:/g, '')
  const t = TINTS[tint] || TINTS.cream
  const Piece = PIECES[kind]
  return (
    <svg
      className={`illustration ${className}`}
      viewBox="0 0 400 500"
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
      style={{ background: t.bg }}
    >
      <rect width="400" height="500" fill={t.bg} />
      <circle cx="200" cy="250" r="150" fill={t.sun} />
      {kind === 'duo' ? (
        <>
          <g transform="translate(-58 34) scale(0.92)">
            <Mocktail id={`${id}a`} />
          </g>
          <g transform="translate(118 78) scale(0.82)">
            <Cocktail id={`${id}b`} />
          </g>
        </>
      ) : Piece ? (
        <g transform="translate(0 10)">
          <Piece id={id} />
        </g>
      ) : null}
    </svg>
  )
}
