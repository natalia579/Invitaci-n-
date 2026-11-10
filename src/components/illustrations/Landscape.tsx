import { invitation } from '../../content/invitation';

/**
 * Paisaje de cuento en acuarela: colinas superpuestas, árboles, un camino
 * y una pequeña torre a lo lejos. Pensado para ir a sangre (todo el ancho).
 */
export function Landscape({ className }: { className?: string }) {
  const custom = invitation.illustrations.landscape;
  if (custom) return <img src={custom} alt="Paisaje de cuento" className={className} draggable={false} />;

  const tree = (x: number, y: number, s: number, c: string, i: number) => (
    <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 L 0 -14" stroke="#8d6c55" strokeWidth="1.6" />
      <ellipse cx="0" cy="-24" rx="9" ry="13" fill={c} />
      <ellipse cx="-3" cy="-27" rx="4" ry="6" fill="#fffaf0" opacity="0.25" />
    </g>
  );
  const cypress = (x: number, y: number, s: number, c: string, i: number) => (
    <g key={`c${i}`} transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 C -6 -10, -6 -30, 0 -46 C 6 -30, 6 -10, 0 0 Z" fill={c} />
    </g>
  );

  return (
    <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax slice" className={className} role="img" aria-label="Paisaje de cuento con colinas y árboles">
      <defs>
        <linearGradient id="ls-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C2CDD3" />
          <stop offset="1" stopColor="#DCE2E2" />
        </linearGradient>
        <linearGradient id="ls-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9C8A8" />
          <stop offset="1" stopColor="#DCD6BE" />
        </linearGradient>
        <linearGradient id="ls-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D8C6A6" />
          <stop offset="1" stopColor="#EADFCB" />
        </linearGradient>
      </defs>
      <g filter="url(#wc-wash)">
        {/* lejanía */}
        <path d="M0 170 C 90 128, 170 140, 250 150 C 330 160, 390 118, 470 124 C 560 130, 640 150, 800 120 L 800 300 L 0 300 Z" fill="url(#ls-far)" opacity="0.85" />
        {/* torre lejana */}
        <g transform="translate(560 128)" opacity="0.7">
          <rect x="-7" y="-34" width="14" height="34" fill="#AEBBC2" />
          <path d="M-10 -34 L 0 -52 L 10 -34 Z" fill="#9FAFB8" />
          <rect x="16" y="-18" width="22" height="18" fill="#B7C3C9" />
          <path d="M14 -18 L 27 -28 L 40 -18 Z" fill="#A8B7C0" />
        </g>
        {/* colinas medias */}
        <path d="M0 210 C 110 168, 200 176, 300 190 C 400 204, 470 170, 560 172 C 650 174, 720 196, 800 180 L 800 300 L 0 300 Z" fill="url(#ls-mid)" opacity="0.9" />
        {[[120, 196, 1, '#B4B996'], [150, 192, 0.8, '#A9B08C'], [610, 184, 0.9, '#B4B996'], [640, 186, 0.7, '#A9B08C'], [430, 190, 0.75, '#B4B996']].map(
          ([x, y, s, c], i) => tree(x as number, y as number, s as number, c as string, i),
        )}
        {[[95, 200, 0.8, '#9EA586'], [665, 190, 0.9, '#9EA586'], [700, 192, 0.7, '#A9B08C']].map(([x, y, s, c], i) =>
          cypress(x as number, y as number, s as number, c as string, i),
        )}
        {/* primer plano */}
        <path d="M0 250 C 120 222, 240 232, 360 246 C 470 258, 560 232, 660 236 C 730 238, 770 250, 800 246 L 800 300 L 0 300 Z" fill="url(#ls-near)" />
        {/* camino */}
        <path d="M352 300 C 360 280, 400 262, 450 254 C 500 246, 540 240, 590 236 C 560 244, 520 252, 482 262 C 440 274, 410 288, 400 300 Z" fill="#F3EBDD" opacity="0.95" />
      </g>
      {/* hierbas y flores a plumilla */}
      <g stroke="#9c8565" strokeWidth="0.8" fill="none" opacity="0.6" filter="url(#wc-ink)">
        <path d="M60 262 q 3 -10 1 -18 M66 262 q -2 -8 2 -14 M244 252 q 2 -9 0 -15 M250 252 q -3 -7 1 -12 M690 252 q 3 -9 0 -16 M698 252 q -2 -8 2 -12" />
      </g>
      <g fill="#B5A082" opacity="0.85">
        <circle cx="62" cy="243" r="2" />
        <circle cx="249" cy="238" r="1.8" />
        <circle cx="692" cy="236" r="2" />
      </g>
    </svg>
  );
}

/** Esquinas ornamentales doradas (para marcos de página). */
export function Corners({ className = '', size = 46 }: { className?: string; size?: number }) {
  const C = ({ style }: { style: React.CSSProperties }) => (
    <svg viewBox="0 0 60 60" width={size} height={size} className="absolute" style={style} aria-hidden>
      <g fill="none" stroke="#B5A082" strokeWidth="1" strokeLinecap="round">
        <path d="M2 58 C 2 24, 24 2, 58 2" />
        <path d="M10 58 C 10 30, 30 10, 58 10" opacity="0.6" />
        <path d="M22 22 c 6 -10, 18 -8, 18 2 c 0 8, -10 10, -12 4" />
      </g>
      <circle cx="22" cy="22" r="2.2" fill="#B5A082" />
    </svg>
  );
  return (
    <div className={`pointer-events-none absolute inset-3 ${className}`} aria-hidden>
      <C style={{ left: 0, top: 0 }} />
      <C style={{ right: 0, top: 0, transform: 'scaleX(-1)' }} />
      <C style={{ left: 0, bottom: 0, transform: 'scaleY(-1)' }} />
      <C style={{ right: 0, bottom: 0, transform: 'scale(-1,-1)' }} />
    </div>
  );
}

/** Gran aguada circular (luna / luz) detrás de una ilustración protagonista. */
export function Halo({ className, color = '#A8B7C0' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id={`halo-${color.slice(1)}`} cx="0.5" cy="0.45" r="0.5">
          <stop offset="0" stopColor={color} stopOpacity="0.38" />
          <stop offset="0.7" stopColor={color} stopOpacity="0.22" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill={`url(#halo-${color.slice(1)})`} filter="url(#wc-cloud)" />
    </svg>
  );
}
