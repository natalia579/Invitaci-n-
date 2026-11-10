import { invitation } from '../../content/invitation';

type CloudProps = { variant?: 0 | 1 | 2; className?: string; style?: React.CSSProperties };

const CLOUDS: { vb: string; puffs: [number, number, number][]; base: [number, number, number, number] }[] = [
  {
    vb: '0 0 300 150',
    puffs: [[70, 96, 38], [118, 70, 48], [176, 72, 44], [222, 96, 34], [150, 104, 44], [100, 108, 34]],
    base: [150, 112, 122, 26],
  },
  {
    vb: '0 0 260 130',
    puffs: [[62, 84, 30], [104, 62, 40], [150, 58, 34], [190, 80, 30], [128, 90, 38]],
    base: [128, 96, 104, 20],
  },
  {
    vb: '0 0 340 140',
    puffs: [[60, 96, 28], [104, 80, 36], [150, 64, 42], [204, 70, 40], [252, 90, 30], [176, 98, 40], [120, 102, 30]],
    base: [170, 106, 146, 20],
  },
];

/** Nube en acuarela. */
export function Cloud({ variant = 0, className, style }: CloudProps) {
  const custom = invitation.illustrations.cloud;
  if (custom) return <img src={custom} alt="" aria-hidden="true" className={className} style={style} draggable={false} />;
  const c = CLOUDS[variant];
  return (
    <svg viewBox={c.vb} className={className} style={style} aria-hidden="true">
      <g filter="url(#wc-cloud)">
        {/* sombra azul grisácea */}
        <g fill="#A8B7C0" opacity="0.38" transform="translate(3 7)">
          {c.puffs.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} />
          ))}
          <ellipse cx={c.base[0]} cy={c.base[1]} rx={c.base[2]} ry={c.base[3]} />
        </g>
        <g fill="url(#cloud-fill)">
          {c.puffs.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} />
          ))}
          <ellipse cx={c.base[0]} cy={c.base[1]} rx={c.base[2]} ry={c.base[3]} />
        </g>
        {/* segunda aguada: luz cálida en las cimas */}
        <g fill="#FFFDF7" opacity="0.7">
          {c.puffs.map(([x, y, r], i) => (
            <ellipse key={i} cx={x - r * 0.18} cy={y - r * 0.28} rx={r * 0.62} ry={r * 0.48} />
          ))}
        </g>
        {/* toque de beige en la base */}
        <ellipse cx={c.base[0]} cy={c.base[1] + c.base[3] * 0.4} rx={c.base[2] * 0.8} ry={c.base[3] * 0.45} fill="#D9C8B2" opacity="0.25" />
      </g>
    </svg>
  );
}

/** Destello de cuatro puntas, dorado envejecido. */
export function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} style={style} aria-hidden="true">
      <path
        d="M0 -11 C 1 -3.2, 3.2 -1, 11 0 C 3.2 1, 1 3.2, 0 11 C -1 3.2, -3.2 1, -11 0 C -3.2 -1, -1 -3.2, 0 -11 Z"
        fill="url(#gold-leaf)"
        filter="url(#wc-ink)"
      />
    </svg>
  );
}

/** Estrella de cinco puntas, pequeña y pintada. */
export function Star({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} style={style} aria-hidden="true">
      <path
        d="M0 -10 L 2.6 -3.4 L 9.5 -3.1 L 4.1 1.3 L 5.9 8.1 L 0 4.3 L -5.9 8.1 L -4.1 1.3 L -9.5 -3.1 L -2.6 -3.4 Z"
        fill="#C8B694"
        stroke="#9c8565"
        strokeWidth="0.6"
        strokeLinejoin="round"
        filter="url(#wc-wash)"
      />
    </svg>
  );
}

/** Ramita botánica (hojas secas en tonos suaves). */
export function Sprig({ className, flip = false }: { className?: string; flip?: boolean }) {
  const leaves: [number, number, number][] = [
    [30, 86, -40], [42, 70, 30], [52, 58, -35], [64, 46, 25], [74, 36, -30], [86, 28, 20], [97, 22, -20],
  ];
  return (
    <svg viewBox="0 0 120 110" className={`${flip ? '-scale-x-100 ' : ''}${className ?? ''}`} aria-hidden="true">
      <path d="M14 104 C 40 80, 70 44, 108 16" fill="none" stroke="#9c8565" strokeWidth="1.2" strokeLinecap="round" filter="url(#wc-ink)" />
      <g filter="url(#wc-wash)">
        {leaves.map(([x, y, r], i) => (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="9"
            ry="3.6"
            transform={`rotate(${r} ${x} ${y})`}
            fill={i % 3 === 0 ? '#A8B7C0' : i % 3 === 1 ? '#C8B694' : '#D9C8B2'}
            opacity="0.92"
          />
        ))}
        <circle cx="108" cy="16" r="2.6" fill="#B5A082" />
        <circle cx="22" cy="96" r="2" fill="#B5A082" />
      </g>
    </svg>
  );
}

/** Divisor ornamental editorial. */
export function Ornament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 24" className={className} aria-hidden="true">
      <g fill="none" stroke="#B5A082" strokeWidth="0.9" strokeLinecap="round">
        <path d="M6 12 L 84 12" />
        <path d="M136 12 L 214 12" />
        <path d="M84 12 C 92 4, 100 4, 104 12 C 100 20, 92 20, 84 12" />
        <path d="M136 12 C 128 4, 120 4, 116 12 C 120 20, 128 20, 136 12" />
      </g>
      <path d="M110 5 L 114 12 L 110 19 L 106 12 Z" fill="#B5A082" />
      <circle cx="4" cy="12" r="1.4" fill="#B5A082" />
      <circle cx="216" cy="12" r="1.4" fill="#B5A082" />
    </svg>
  );
}
