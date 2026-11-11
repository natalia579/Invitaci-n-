import { useId, useMemo } from 'react';
import { invitation } from '../../content/invitation';

type Props = { className?: string; title?: string };

/**
 * Globo aerostático antiguo en acuarela.
 *  · Gajos reales que siguen la curvatura (proyección de meridianos), cada uno
 *    con su propia luz/sombra según una luz que llega desde arriba a la izquierda.
 *  · Aguadas con borde húmedo, granulado de pigmento y floraciones.
 *  · Sombreado a plumilla en el lado en sombra.
 *  · Canasta de mimbre tejida, borde con cuerda enrollada, nudos y sacos de arena.
 * Sustituible por una ilustración propia en `invitation.illustrations.balloon`.
 */

const CX = 120;
const TOP = 12;
const THROAT = 228;
const RMAX = 101;

/** Perfil del globo: semiancho según la altura. */
function R(y: number) {
  const v = (y - TOP) / (THROAT - TOP);
  if (v <= 0) return 0;
  if (v < 0.56) {
    const k = (0.56 - v) / 0.56;
    return RMAX * Math.sqrt(Math.max(0, 1 - k * k));
  }
  const k = (v - 0.56) / 0.44;
  return 30 + (RMAX - 30) * Math.pow(1 - k, 1.35) * (1 - 0.12 * k);
}

const YS = Array.from({ length: 49 }, (_, i) => TOP + ((THROAT - TOP) * i) / 48);
const f = (n: number) => n.toFixed(1);

function meridian(theta: number) {
  return YS.map((y) => [CX + R(y) * Math.sin(theta), y] as const);
}

function gorePath(t0: number, t1: number) {
  const a = meridian(t0);
  const b = meridian(t1).reverse();
  return `M${a.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L ')} L ${b.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L ')} Z`;
}

const outline = () => {
  const right = YS.map((y) => `${f(CX + R(y))} ${f(y)}`);
  const left = [...YS].reverse().map((y) => `${f(CX - R(y))} ${f(y)}`);
  return `M${right.join(' L ')} L ${left.join(' L ')} Z`;
};

/** Paralelo (círculo horizontal) visto ligeramente desde abajo. */
function parallel(y: number, sag = 5) {
  const pts = Array.from({ length: 33 }, (_, i) => {
    const th = -Math.PI / 2 + (Math.PI * i) / 32;
    return [CX + R(y) * Math.sin(th), y + sag * Math.cos(th)] as const;
  });
  return pts;
}

export function Balloon({ className, title = 'Globo aerostático antiguo' }: Props) {
  const raw = useId();
  const id = raw.replace(/:/g, '');
  const custom = invitation.illustrations.balloon;

  const geo = useMemo(() => {
    const N = 12;
    const gores = Array.from({ length: N }, (_, i) => {
      const t0 = -Math.PI / 2 + (Math.PI * i) / N;
      const t1 = -Math.PI / 2 + (Math.PI * (i + 1)) / N;
      const mid = (t0 + t1) / 2;
      // luz desde arriba-izquierda
      const light = Math.max(0, Math.cos(mid + 0.55));
      return { d: gorePath(t0, t1), i, light, t0, t1 };
    });
    const seams = Array.from({ length: N + 1 }, (_, i) => {
      const t = -Math.PI / 2 + (Math.PI * i) / N;
      return meridian(t).map(([x, y]) => `${f(x)} ${f(y)}`).join(' L ');
    });
    const yBand = TOP + (THROAT - TOP) * 0.56;
    const band = parallel(yBand, 6);
    const swags: string[] = [];
    for (let i = 0; i < band.length - 2; i += 2) {
      const [x0, y0] = band[i];
      const [x1, y1] = band[i + 2];
      swags.push(`M${f(x0)} ${f(y0)} Q ${f((x0 + x1) / 2)} ${f((y0 + y1) / 2 + 9)} ${f(x1)} ${f(y1)}`);
    }
    const tassels = band.filter((_, i) => i % 2 === 0).slice(1, -1);
    const skirtY = TOP + (THROAT - TOP) * 0.83;
    const skirt = parallel(skirtY, 4);
    return { gores, seams, band, swags, tassels, skirt, skirtY, yBand, outline: outline() };
  }, []);

  if (custom) return <img src={custom} alt={title} className={className} draggable={false} />;

  const cream = ['#F3ECDF', '#B9C8D0'];

  return (
    <svg viewBox="0 0 240 330" className={className} role="img" aria-label={title}>
      <defs>
        <clipPath id={`env-${id}`}>
          <path d={geo.outline} />
        </clipPath>
        <radialGradient id={`hl-${id}`} cx="0.33" cy="0.27" r="0.55">
          <stop offset="0" stopColor="#fffdf6" stopOpacity="0.8" />
          <stop offset="0.6" stopColor="#fffdf6" stopOpacity="0.15" />
          <stop offset="1" stopColor="#fffdf6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`vsh-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.45" stopColor="#49372F" stopOpacity="0" />
          <stop offset="1" stopColor="#49372F" stopOpacity="0.3" />
        </linearGradient>
        <filter id={`gran-${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="5" />
          <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.27  0 0 0 0 0.2  0 0 0 0.55 -0.12" />
        </filter>
        <filter id={`bloom-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="12" result="n" />
          <feColorMatrix in="n" values="0 0 0 0 1  0 0 0 0 0.99  0 0 0 0 0.96  1.6 0 0 0 -0.95" />
        </filter>
        <pattern id={`hatch-${id}`} width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)">
          <path d="M0 0 V3.2" stroke="#49372F" strokeWidth="0.45" />
        </pattern>
        <linearGradient id={`shadeSide-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={`sideMask-${id}`}>
          <rect x="0" y="0" width="240" height="330" fill={`url(#shadeSide-${id})`} />
        </mask>
        <linearGradient id={`wick-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a6b52" />
          <stop offset="0.3" stopColor="#c7a988" />
          <stop offset="0.55" stopColor="#b8987a" />
          <stop offset="1" stopColor="#6e5340" />
        </linearGradient>
        <linearGradient id={`rim-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8d6c55" />
          <stop offset="0.5" stopColor="#6B5143" />
          <stop offset="1" stopColor="#4a372d" />
        </linearGradient>
        <pattern id={`weave-${id}`} width="6" height="5" patternUnits="userSpaceOnUse">
          <rect width="6" height="5" fill="none" />
          <ellipse cx="1.5" cy="1.25" rx="1.7" ry="1.05" fill="#e2c9a6" opacity="0.55" />
          <ellipse cx="4.5" cy="3.75" rx="1.7" ry="1.05" fill="#e2c9a6" opacity="0.55" />
          <path d="M0 2.5 H6" stroke="#4a372d" strokeWidth="0.35" opacity="0.5" />
          <path d="M3 0 V2.5 M0 2.5 V5 M6 2.5 V5" stroke="#4a372d" strokeWidth="0.3" opacity="0.4" />
        </pattern>
      </defs>

      {/* ═════════ Envoltura ═════════ */}
      <g filter="url(#wc-wash)">
        <g clipPath={`url(#env-${id})`}>
          {geo.gores.map((g) => (
            <path key={g.i} d={g.d} fill={cream[g.i % 2]} />
          ))}
          {/* luz y sombra de cada gajo */}
          {geo.gores.map((g) => (
            <path key={`s${g.i}`} d={g.d} fill="#3d2a20" opacity={(1 - g.light) * 0.42} />
          ))}
          {/* faldón inferior */}
          <path
            d={`M${geo.skirt.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L ')} L 240 330 L 0 330 Z`}
            fill="#C9B193"
            opacity="0.9"
          />
          <rect width="240" height="330" fill={`url(#vsh-${id})`} />
          <rect width="240" height="330" fill={`url(#hl-${id})`} />
        </g>
      </g>

      {/* floraciones (zonas donde el agua levantó el pigmento) y granulado */}
      <g clipPath={`url(#env-${id})`}>
        <rect width="240" height="240" filter={`url(#bloom-${id})`} opacity="0.55" />
        <rect width="240" height="240" filter={`url(#gran-${id})`} opacity="0.5" />
        {/* plumilla en el lado en sombra */}
        <rect width="240" height="240" fill={`url(#hatch-${id})`} mask={`url(#sideMask-${id})`} opacity="0.16" />
      </g>

      {/* costuras con relieve */}
      <g clipPath={`url(#env-${id})`} fill="none" strokeLinecap="round" filter="url(#wc-ink)">
        {geo.seams.map((d, i) => (
          <g key={i}>
            <path d={`M${d}`} stroke="#3d2a20" strokeOpacity="0.16" strokeWidth="2.6" />
            <path d={`M${d}`} stroke="#6B5143" strokeOpacity="0.55" strokeWidth="0.55" />
          </g>
        ))}
        <path d={`M${geo.skirt.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L ')}`} stroke="#6B5143" strokeOpacity="0.6" strokeWidth="0.8" />
      </g>

      {/* banda decorativa con festones y borlas */}
      <g clipPath={`url(#env-${id})`} filter="url(#wc-ink)">
        <path d={`M${geo.band.map(([x, y]) => `${f(x)} ${f(y - 2)}`).join(' L ')}`} fill="none" stroke="#9c8565" strokeWidth="2.4" opacity="0.85" />
        <path d={`M${geo.band.map(([x, y]) => `${f(x)} ${f(y - 2)}`).join(' L ')}`} fill="none" stroke="#e6d6b8" strokeWidth="0.7" opacity="0.8" />
        {geo.swags.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#a58d68" strokeWidth="1.5" />
        ))}
      </g>
      <g fill="#B5A082" stroke="#7d6648" strokeWidth="0.3">
        {geo.tassels.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y + 1} r="1.6" />
            <path d={`M${f(x - 0.9)} ${f(y + 2)} L ${f(x)} ${f(y + 6.5)} L ${f(x + 0.9)} ${f(y + 2)} Z`} />
          </g>
        ))}
      </g>

      {/* contorno a plumilla */}
      <path d={geo.outline} fill="none" stroke="#6B5143" strokeWidth="1.1" opacity="0.75" filter="url(#wc-ink)" />
      {/* coronilla */}
      <g filter="url(#wc-ink)">
        <ellipse cx={CX} cy={TOP + 1} rx="9" ry="2.6" fill="#c9b18e" stroke="#6B5143" strokeWidth="0.6" />
        <circle cx={CX} cy={TOP - 3} r="2.2" fill="#B5A082" stroke="#6B5143" strokeWidth="0.4" />
      </g>

      {/* ═════════ Boca y cuerdas ═════════ */}
      <ellipse cx={CX} cy={THROAT + 0.5} rx={R(THROAT - 0.5) + 1} ry="3.4" fill={`url(#rim-${id})`} stroke="#3d2a20" strokeWidth="0.4" />
      {/* aro del quemador */}
      <g filter="url(#wc-ink)">
        <ellipse cx={CX} cy="250" rx="13" ry="2.4" fill="none" stroke="#5a4438" strokeWidth="1.3" />
        <path d={`M${CX - 13} 250 L ${CX - 9} 262 M${CX + 13} 250 L ${CX + 9} 262`} stroke="#5a4438" strokeWidth="0.8" />
      </g>
      <g stroke="#6B5143" strokeWidth="0.85" fill="none" opacity="0.85" filter="url(#wc-ink)">
        {[
          [CX - 30, 98],
          [CX - 14, 106],
          [CX + 14, 134],
          [CX + 30, 142],
        ].map(([x0, x1], i) => (
          <path key={i} d={`M${x0} ${THROAT + 2} Q ${(x0 + x1) / 2 + (i < 2 ? 2 : -2)} 246 ${x1} 266`} />
        ))}
        <path d={`M${CX - 26} 244 Q ${CX} 252 ${CX + 26} 244`} strokeWidth="0.55" />
      </g>
      {/* banderines */}
      <g opacity="0.95" filter="url(#wc-wash)">
        <path d={`M${CX - 20} 246.6 L ${CX - 16.5} 254 L ${CX - 13} 248`} fill="#B9C8D0" />
        <path d={`M${CX - 10} 248.4 L ${CX - 6.5} 256 L ${CX - 3} 249.2`} fill="#D9C8B2" />
        <path d={`M${CX + 3} 249.2 L ${CX + 6.5} 256.4 L ${CX + 10} 248.6`} fill="#B9C8D0" />
        <path d={`M${CX + 13} 248 L ${CX + 16.5} 254.6 L ${CX + 20} 246.6`} fill="#D9C8B2" />
      </g>

      {/* ═════════ Canasta de mimbre ═════════ */}
      <g filter="url(#wc-wash)">
        <path d={`M${CX - 23} 268 L ${CX + 23} 268 L ${CX + 20} 302 Q ${CX} 307 ${CX - 20} 302 Z`} fill={`url(#wick-${id})`} />
      </g>
      <path d={`M${CX - 23} 268 L ${CX + 23} 268 L ${CX + 20} 302 Q ${CX} 307 ${CX - 20} 302 Z`} fill={`url(#weave-${id})`} />
      {/* montantes verticales */}
      <g stroke="#4a372d" strokeWidth="0.7" opacity="0.6">
        {[-15, -5, 5, 15].map((dx, i) => (
          <path key={i} d={`M${CX + dx} 270 L ${CX + dx * 0.88} 304`} />
        ))}
      </g>
      {/* sombra interior bajo el borde y oscurecimiento lateral */}
      <path d={`M${CX - 23} 268 L ${CX + 23} 268 L ${CX + 22.4} 274 L ${CX - 22.4} 274 Z`} fill="#3d2a20" opacity="0.28" />
      <path d={`M${CX - 20} 300 Q ${CX} 305 ${CX + 20} 300 L ${CX + 20} 302 Q ${CX} 307 ${CX - 20} 302 Z`} fill="#3d2a20" opacity="0.45" />
      {/* borde superior con cuerda enrollada */}
      <rect x={CX - 25} y="263.5" width="50" height="6.5" rx="3.2" fill={`url(#rim-${id})`} />
      <g stroke="#e3cfae" strokeWidth="0.5" opacity="0.55">
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d={`M${CX - 23 + i * 3} 264.2 l 2.2 5.4`} />
        ))}
      </g>
      {/* nudos */}
      <g fill="#5a4438">
        {[98, 106, 134, 142].map((x, i) => (
          <circle key={i} cx={x} cy="265.5" r="1.3" />
        ))}
      </g>
      <path d={`M${CX - 23} 268 L ${CX + 23} 268 L ${CX + 20} 302 Q ${CX} 307 ${CX - 20} 302 Z`} fill="none" stroke="#3d2a20" strokeWidth="0.7" opacity="0.7" filter="url(#wc-ink)" />

      {/* sacos de arena */}
      <g filter="url(#wc-wash)">
        <path d={`M${CX - 21} 284 Q ${CX - 26} 292 ${CX - 25} 297`} stroke="#6B5143" strokeWidth="0.6" fill="none" />
        <path d={`M${CX - 29} 298 Q ${CX - 25} 294 ${CX - 21} 298 Q ${CX - 20} 306 ${CX - 25} 307 Q ${CX - 30} 306 ${CX - 29} 298 Z`} fill="#cdb796" />
        <path d={`M${CX + 21} 284 Q ${CX + 26} 292 ${CX + 25} 297`} stroke="#6B5143" strokeWidth="0.6" fill="none" />
        <path d={`M${CX + 21} 298 Q ${CX + 25} 294 ${CX + 29} 298 Q ${CX + 30} 306 ${CX + 25} 307 Q ${CX + 20} 306 ${CX + 21} 298 Z`} fill="#cdb796" />
      </g>
      <g stroke="#6B5143" strokeWidth="0.45" fill="none" opacity="0.8">
        <path d={`M${CX - 27.5} 298.6 L ${CX - 22.5} 298.6 M${CX - 27} 301 l 1 0.5 l 1 -0.5 l 1 0.5`} />
        <path d={`M${CX + 22.5} 298.6 L ${CX + 27.5} 298.6 M${CX + 23} 301 l 1 0.5 l 1 -0.5 l 1 0.5`} />
      </g>
    </svg>
  );
}
