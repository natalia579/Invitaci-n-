import { useId } from 'react';
import { invitation } from '../../content/invitation';

type Props = { className?: string; title?: string };

/** Globo aerostático antiguo en acuarela (vector). Sustituible por una ilustración propia. */
export function Balloon({ className, title = 'Globo aerostático antiguo' }: Props) {
  const raw = useId();
  const id = raw.replace(/:/g, '');
  const custom = invitation.illustrations.balloon;
  if (custom) return <img src={custom} alt={title} className={className} draggable={false} />;

  const envelope =
    'M120 14 C 186 14, 222 62, 216 120 C 211 168, 172 196, 152 226 L 88 226 C 68 196, 29 168, 24 120 C 18 62, 54 14, 120 14 Z';

  // Guirnalda de festones dorados alrededor del globo
  const swags = Array.from({ length: 8 }, (_, i) => {
    const x0 = 22 + i * 24.5;
    const x1 = x0 + 24.5;
    return `M${x0} 166 Q ${(x0 + x1) / 2} 182, ${x1} 166`;
  }).join(' ');

  return (
    <svg viewBox="0 0 240 310" className={className} role="img" aria-label={title}>
      <defs>
        <clipPath id={`env-${id}`}>
          <path d={envelope} />
        </clipPath>
        <radialGradient id={`hl-${id}`} cx="0.36" cy="0.28" r="0.6">
          <stop offset="0" stopColor="#fffdf7" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fffdf7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`sh-${id}`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0.45" stopColor="#49372F" stopOpacity="0" />
          <stop offset="1" stopColor="#49372F" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id={`wick-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c5a988" />
          <stop offset="1" stopColor="#8d6c55" />
        </linearGradient>
      </defs>

      {/* Envoltura */}
      <g filter="url(#wc-wash)">
        <g clipPath={`url(#env-${id})`}>
          <rect x="0" y="0" width="240" height="240" fill="#E7DCCB" />
          <ellipse cx="120" cy="120" rx="80" ry="112" fill="#B9C7CE" />
          <ellipse cx="120" cy="120" rx="54" ry="112" fill="#F4EEE2" />
          <ellipse cx="120" cy="120" rx="27" ry="112" fill="#B9C7CE" />
          <ellipse cx="120" cy="120" rx="7" ry="112" fill="#F4EEE2" />
          {/* faldón inferior */}
          <path d="M20 192 L 220 192 L 220 240 L 20 240 Z" fill="#C9B39A" opacity="0.85" />
          <rect x="0" y="0" width="240" height="240" fill={`url(#sh-${id})`} />
          <rect x="0" y="0" width="240" height="240" fill={`url(#hl-${id})`} />
        </g>
      </g>

      {/* Costuras y ornamentos en tinta */}
      <g filter="url(#wc-ink)" fill="none" stroke="#6B5143" strokeLinecap="round">
        <g clipPath={`url(#env-${id})`} strokeWidth="0.7" opacity="0.45">
          <ellipse cx="120" cy="120" rx="80" ry="112" />
          <ellipse cx="120" cy="120" rx="54" ry="112" />
          <ellipse cx="120" cy="120" rx="27" ry="112" />
          <ellipse cx="120" cy="120" rx="7" ry="112" />
          <path d="M20 192 L 220 192" />
        </g>
        <path d={envelope} strokeWidth="1.1" opacity="0.7" />
        <g clipPath={`url(#env-${id})`}>
          <path d={swags} stroke="#9c8565" strokeWidth="1.6" opacity="0.9" />
          <path d="M20 164 L 220 164" stroke="#9c8565" strokeWidth="0.8" opacity="0.7" />
        </g>
        {/* coronilla */}
        <path d="M112 15 Q120 6 128 15" strokeWidth="1" opacity="0.7" />
        <circle cx="120" cy="7" r="2.4" fill="#B5A082" stroke="none" />
      </g>
      {/* borlas bajo los festones */}
      <g fill="#B5A082" opacity="0.9">
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={22 + i * 24.5} cy={167} r={1.7} />
        ))}
      </g>

      {/* Boca del globo */}
      <ellipse cx="120" cy="227" rx="33" ry="3.6" fill="#8d6c55" opacity="0.85" />

      {/* Cuerdas */}
      <g stroke="#6B5143" strokeWidth="0.9" opacity="0.75" filter="url(#wc-ink)">
        <path d="M89 228 L 101 262" />
        <path d="M151 228 L 139 262" />
        <path d="M110 229 L 112 262" />
        <path d="M130 229 L 128 262" />
        {/* banderines */}
        <path d="M95 246 Q 120 252 145 246" fill="none" strokeWidth="0.6" />
      </g>
      <g opacity="0.9">
        <path d="M100 247.6 L 104 255 L 108 249" fill="#B9C7CE" />
        <path d="M110 249.3 L 114 257 L 118 250" fill="#D9C8B2" />
        <path d="M122 250 L 126 257.5 L 130 249.3" fill="#B9C7CE" />
        <path d="M132 249 L 136 256 L 140 247.6" fill="#D9C8B2" />
      </g>

      {/* Cesta de mimbre */}
      <g filter="url(#wc-wash)">
        <path d="M99 262 L 141 262 L 137 292 Q 120 296 103 292 Z" fill={`url(#wick-${id})`} />
        <rect x="96" y="258.5" width="48" height="6" rx="3" fill="#6B5143" />
      </g>
      <g stroke="#49372F" strokeWidth="0.6" opacity="0.5" fill="none">
        <path d="M100.5 270 L 139.5 270" />
        <path d="M101.5 278 L 138.5 278" />
        <path d="M102.5 286 L 137.5 286" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={`M${105 + i * 4.4} 265 L ${105.5 + i * 4.1} 292`} opacity="0.55" />
        ))}
      </g>
      {/* sacos de arena */}
      <g fill="#C9B39A" stroke="#6B5143" strokeWidth="0.5" opacity="0.9">
        <path d="M101 292 L 99 299" fill="none" />
        <ellipse cx="98.5" cy="302" rx="3.4" ry="4" />
        <path d="M139 292 L 141 299" fill="none" />
        <ellipse cx="141.5" cy="302" rx="3.4" ry="4" />
      </g>
    </svg>
  );
}
