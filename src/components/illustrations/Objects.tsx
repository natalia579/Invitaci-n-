import { invitation } from '../../content/invitation';

/** Paths del lazo de raso, compartidos entre la apertura y la caja de regalo. */
export const BOW = {
  leftLoop: 'M100 70 C 80 38, 30 18, 20 44 C 12 68, 40 94, 100 73 Z',
  leftLoopInner: 'M100 71 C 76 54, 46 44, 40 58 C 37 68, 58 80, 100 73 Z',
  rightLoop: 'M100 70 C 120 38, 170 18, 180 44 C 188 68, 160 94, 100 73 Z',
  rightLoopInner: 'M100 71 C 124 54, 154 44, 160 58 C 163 68, 142 80, 100 73 Z',
  leftTail: 'M96 74 C 90 98, 74 122, 52 150 L 64 143 L 70 158 C 86 130, 98 102, 106 76 Z',
  rightTail: 'M104 74 C 112 98, 130 120, 150 146 L 138 141 L 134 156 C 116 128, 102 102, 94 76 Z',
};

export function SatinBow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 165" className={className} aria-hidden="true">
      <path d={BOW.leftTail} fill="url(#satin-diag)" />
      <path d={BOW.rightTail} fill="url(#satin-diag)" />
      <path d={BOW.leftLoop} fill="url(#satin-diag)" />
      <path d={BOW.leftLoopInner} fill="#3f2f27" opacity="0.45" />
      <path d={BOW.rightLoop} fill="url(#satin-diag)" />
      <path d={BOW.rightLoopInner} fill="#3f2f27" opacity="0.45" />
      <rect x="88" y="60" width="24" height="23" rx="8" fill="url(#satin-v)" />
      <path d="M92 64 C 98 61, 104 61, 108 64" stroke="#b39687" strokeWidth="1.2" fill="none" opacity="0.6" />
    </svg>
  );
}

/** Caja de regalo antigua con lazo de raso café. */
export function GiftBox({ className }: { className?: string }) {
  const custom = invitation.illustrations.giftBox;
  if (custom) return <img src={custom} alt="Caja de regalo" className={className} draggable={false} />;
  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label="Caja de regalo antigua con lazo de raso">
      <defs>
        <pattern id="gift-paper" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="#EFE6D6" />
          <path d="M7 0 V14" stroke="#B5A082" strokeWidth="0.6" opacity="0.35" />
          <circle cx="0" cy="7" r="1" fill="#A8B7C0" opacity="0.6" />
          <circle cx="14" cy="7" r="1" fill="#A8B7C0" opacity="0.6" />
        </pattern>
      </defs>
      <ellipse cx="120" cy="222" rx="92" ry="7" fill="#A8B7C0" opacity="0.35" filter="url(#wc-cloud)" />
      <g filter="url(#wc-wash)">
        <rect x="46" y="112" width="148" height="104" fill="url(#gift-paper)" />
        <rect x="46" y="112" width="148" height="104" fill="#6B5143" opacity="0.05" />
        <rect x="160" y="112" width="34" height="104" fill="#49372F" opacity="0.08" />
        <rect x="38" y="92" width="164" height="26" fill="#E2D4BF" />
        <rect x="38" y="112" width="164" height="6" fill="#49372F" opacity="0.1" />
      </g>
      {/* cinta */}
      <rect x="111" y="92" width="18" height="124" fill="url(#satin-v)" />
      <rect x="46" y="152" width="148" height="15" fill="url(#satin-h)" />
      <rect x="38" y="99" width="164" height="12" fill="url(#satin-h)" opacity="0.95" />
      <g fill="none" stroke="#6B5143" strokeWidth="0.9" opacity="0.55" filter="url(#wc-ink)">
        <rect x="46" y="112" width="148" height="104" />
        <rect x="38" y="92" width="164" height="26" />
      </g>
      {/* lazo */}
      <g transform="translate(60 26) scale(0.6)">
        <path d={BOW.leftTail} fill="url(#satin-diag)" />
        <path d={BOW.rightTail} fill="url(#satin-diag)" />
        <path d={BOW.leftLoop} fill="url(#satin-diag)" />
        <path d={BOW.leftLoopInner} fill="#3f2f27" opacity="0.45" />
        <path d={BOW.rightLoop} fill="url(#satin-diag)" />
        <path d={BOW.rightLoopInner} fill="#3f2f27" opacity="0.45" />
        <rect x="88" y="60" width="24" height="23" rx="8" fill="url(#satin-v)" />
      </g>
      {/* etiqueta */}
      <path d="M184 120 C 196 132, 204 140, 206 152" fill="none" stroke="#9c8565" strokeWidth="0.8" />
      <g transform="rotate(14 210 166)" filter="url(#wc-wash)">
        <path d="M198 152 L 222 152 L 222 182 L 210 190 L 198 182 Z" fill="#F6F0E4" stroke="#B5A082" strokeWidth="0.8" />
        <circle cx="210" cy="158" r="1.8" fill="none" stroke="#9c8565" strokeWidth="0.7" />
        <path d="M210 168 l2 4 -2 4 -2 -4 z" fill="#B5A082" />
      </g>
    </svg>
  );
}

/** Cigüeña en vuelo, a lo lejos. */
export function Stork({ className }: { className?: string }) {
  const custom = invitation.illustrations.stork;
  if (custom) return <img src={custom} alt="" aria-hidden="true" className={className} draggable={false} />;
  return (
    <svg viewBox="0 0 220 150" className={className} aria-hidden="true">
      <g filter="url(#wc-wash)">
        {/* ala lejana */}
        <path d="M104 72 C 96 92, 84 110, 66 128 C 90 118, 112 98, 124 76 Z" fill="#C7D1D6" />
        {/* cuerpo */}
        <path d="M66 74 C 78 60, 120 58, 142 66 C 152 70, 152 77, 140 81 C 118 88, 84 88, 66 74 Z" fill="#F7F3EA" />
        {/* ala cercana */}
        <path d="M86 68 C 82 42, 68 22, 48 6 C 72 12, 98 30, 118 64 Z" fill="#F7F3EA" />
        <path d="M48 6 C 58 9, 66 14, 74 20 L 66 30 C 60 22, 54 14, 48 6 Z" fill="#49372F" opacity="0.75" />
        <path d="M66 74 L 50 70 L 54 78 Z" fill="#49372F" opacity="0.7" />
        {/* cabeza */}
        <circle cx="174" cy="56" r="5.5" fill="#F7F3EA" />
        <path d="M178 53 L 207 62 L 178 59 Z" fill="#C4A37F" />
      </g>
      <g fill="none" stroke="#6B5143" strokeLinecap="round" filter="url(#wc-ink)">
        <path d="M140 69 C 152 63, 162 58, 172 56" strokeWidth="5" stroke="#F7F3EA" />
        <path d="M140 66 C 152 60, 162 55, 170 52" strokeWidth="0.8" opacity="0.6" />
        <path d="M66 74 C 78 60, 120 58, 142 66" strokeWidth="0.8" opacity="0.55" />
        <path d="M86 68 C 82 42, 68 22, 48 6" strokeWidth="0.8" opacity="0.55" />
        <path d="M70 80 L 26 88" stroke="#C4A37F" strokeWidth="1.4" />
        <path d="M72 82 L 30 92" stroke="#C4A37F" strokeWidth="1.4" />
      </g>
      <circle cx="175" cy="55" r="1" fill="#49372F" />
    </svg>
  );
}

/** Pequeño velero de papel sobre olas. */
export function Boat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 140" className={className} aria-hidden="true">
      <g filter="url(#wc-wash)">
        <path d="M82 26 L 82 92 L 126 92 Z" fill="#F6F0E4" />
        <path d="M78 36 L 78 92 L 42 92 Z" fill="#E6DAC6" />
        <path d="M80 18 L 98 23 L 80 28 Z" fill="#A8B7C0" />
        <path d="M26 96 L 134 96 C 126 112, 108 118, 80 118 C 52 118, 34 112, 26 96 Z" fill="#B08E74" />
        <path d="M26 96 L 134 96 L 132 100 L 28 100 Z" fill="#6B5143" opacity="0.6" />
      </g>
      <g fill="none" stroke="#6B5143" strokeLinecap="round" filter="url(#wc-ink)">
        <path d="M80 18 L 80 96" strokeWidth="1.3" />
        <path d="M82 26 L 126 92 L 82 92" strokeWidth="0.7" opacity="0.6" />
        <path d="M78 36 L 42 92 L 78 92" strokeWidth="0.7" opacity="0.6" />
      </g>
      <g fill="none" stroke="#A8B7C0" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" filter="url(#wc-ink)">
        <path d="M8 118 C 20 112, 30 112, 42 118 C 54 124, 64 124, 76 118 C 88 112, 98 112, 110 118 C 122 124, 132 124, 152 116" />
        <path d="M22 130 C 34 125, 44 125, 56 130 C 68 135, 78 135, 90 130 C 102 125, 112 125, 136 130" opacity="0.6" />
      </g>
    </svg>
  );
}

/** Marco ornamental de lámina antigua. */
export function PlateFrame({ className }: { className?: string }) {
  const corner = 'M0 22 C 0 8, 8 0, 22 0 M6 22 C 6 12, 12 6, 22 6 M10 10 l3 3';
  return (
    <svg viewBox="0 0 300 380" className={className} preserveAspectRatio="none" aria-hidden="true">
      <g fill="none" stroke="#B5A082" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <rect x="6" y="6" width="288" height="368" vectorEffect="non-scaling-stroke" />
        <rect x="14" y="14" width="272" height="352" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
      </g>
      <g fill="none" stroke="#B5A082" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <path d={corner} transform="translate(20 20)" vectorEffect="non-scaling-stroke" />
        <path d={corner} transform="translate(280 20) scale(-1 1)" vectorEffect="non-scaling-stroke" />
        <path d={corner} transform="translate(20 360) scale(1 -1)" vectorEffect="non-scaling-stroke" />
        <path d={corner} transform="translate(280 360) scale(-1 -1)" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

/** Collar de perlas — detalle clásico para el dress code. */
export function Pearls({ className }: { className?: string }) {
  const n = 23;
  const pts = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const x = 14 + t * 232;
    const y = 14 + Math.sin(t * Math.PI) * 58;
    return [x, y, 4.6 - Math.abs(t - 0.5) * 2.4] as const;
  });
  return (
    <svg viewBox="0 0 260 90" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="pearl" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#F0E8DA" />
          <stop offset="1" stopColor="#C9C3B8" />
        </radialGradient>
      </defs>
      <path d={`M14 14 Q 130 130 246 14`} fill="none" stroke="#B5A082" strokeWidth="0.5" opacity="0.5" />
      {pts.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="url(#pearl)" stroke="#B5A082" strokeWidth="0.35" />
      ))}
    </svg>
  );
}
