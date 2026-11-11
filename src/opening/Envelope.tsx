import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Sobre antiguo con lacre.
 * Capas (de atrás hacia adelante): interior → carta → bolsillo → solapa → sello.
 * Todo es SVG/HTML: papel con fibras, bordes envejecidos, sombras y un sello
 * de lacre en relieve (iluminación SVG) con una estrella grabada.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const SOFT = [0.45, 0, 0.2, 1] as const;

export type EnvelopeState = 'closed' | 'breaking' | 'opening' | 'rising' | 'gone';

/** Definiciones compartidas (papel, lacre). Se monta una vez por sobre. */
function PaperDefs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`${id}-paper`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="4" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.27  0 0 0 0.16 0" result="fib" />
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.9" numOctaves="2" seed="21" result="laid0" />
        <feColorMatrix in="laid0" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0.07 0" result="laid" />
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="9" result="m" />
        <feColorMatrix in="m" type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.43  0 0 0 0 0.3  0 0 0 0.16 0" result="mot" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="mot" />
          <feMergeNode in="laid" />
          <feMergeNode in="fib" />
        </feMerge>
      </filter>
      <linearGradient id={`${id}-front`} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stopColor="#f8f2e6" />
        <stop offset="1" stopColor="#eee3cf" />
      </linearGradient>
      <linearGradient id={`${id}-flap`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f1e7d5" />
        <stop offset="1" stopColor="#f9f4ea" />
      </linearGradient>
      <linearGradient id={`${id}-inside`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d8c8ae" />
        <stop offset="1" stopColor="#e7dbc6" />
      </linearGradient>
      {/* bordes envejecidos: viñeta cálida */}
      <radialGradient id={`${id}-age`} cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.62" stopColor="#8a6a4a" stopOpacity="0" />
        <stop offset="1" stopColor="#8a6a4a" stopOpacity="0.28" />
      </radialGradient>
    </defs>
  );
}

const POCKET = 'M0 0 L 268 206 Q 300 228 332 206 L 600 0 L 600 400 L 0 400 Z';
const FLAP = 'M0 0 L 600 0 L 330 222 Q 300 244 270 222 Z';

export function Envelope({
  state = 'closed',
  id = 'env',
  onSeal,
  sealPulse = false,
  sealLabel,
  letterRef,
}: {
  state?: EnvelopeState;
  id?: string;
  onSeal?: () => void;
  sealPulse?: boolean;
  sealLabel?: string;
  letterRef?: React.Ref<HTMLDivElement>;
}) {
  const open = state === 'opening' || state === 'rising' || state === 'gone';
  const broken = state !== 'closed';
  const rising = state === 'rising' || state === 'gone';
  // la solapa pasa detrás de la carta sólo cuando ya superó los 90°
  const [flapBehind, setFlapBehind] = useState(false);
  useEffect(() => {
    if (!open) return setFlapBehind(false);
    const t = window.setTimeout(() => setFlapBehind(true), 720);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div className="relative aspect-[3/2] w-full" style={{ perspective: 1400 }}>
      {/* sombra proyectada */}
      <div className="absolute inset-x-[3%] bottom-[-7%] h-[16%] rounded-[50%] bg-cocoa/25 blur-[14px]" aria-hidden />

      {/* interior */}
      <svg viewBox="0 0 600 400" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <PaperDefs id={`${id}-b`} />
        <rect width="600" height="400" rx="6" fill={`url(#${id}-b-inside)`} filter={`url(#${id}-b-paper)`} />
      </svg>

      {/* carta */}
      <motion.div
        ref={letterRef}
        className="absolute left-[5%] right-[5%] top-[5%] h-[88%]"
        initial={false}
        animate={rising ? { y: '-64%' } : { y: '0%' }}
        transition={{ duration: 1.25, ease: EASE }}
        style={{ zIndex: 2 }}
      >
        <LetterSheet folded />
      </motion.div>

      {/* bolsillo delantero */}
      <svg viewBox="0 0 600 400" className="absolute inset-0 h-full w-full overflow-visible" style={{ zIndex: 3 }} aria-hidden>
        <PaperDefs id={`${id}-p`} />
        <path d={POCKET} fill={`url(#${id}-p-front)`} filter={`url(#${id}-p-paper)`} />
        <path d={POCKET} fill={`url(#${id}-p-age)`} />
        {/* pliegues de las solapas laterales e inferior */}
        <path d="M0 400 L 262 214 M600 400 L 338 214" stroke="#9c8565" strokeOpacity="0.28" strokeWidth="1.2" fill="none" />
        <path d="M2 398 L 262 216 L 338 216 L 598 398" fill="#6b5143" fillOpacity="0.035" />
        <rect x="0.5" y="0.5" width="599" height="399" rx="6" fill="none" stroke="#b5a082" strokeOpacity="0.35" />
      </svg>

      {/* solapa superior (gira sobre su bisagra) */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[61%]"
        style={{ transformOrigin: '50% 0%', transformStyle: 'preserve-3d', zIndex: flapBehind ? 1 : 4 }}
        initial={false}
        animate={{ rotateX: open ? 178 : 0 }}
        transition={{ duration: 1.1, ease: SOFT, delay: open ? 0.15 : 0 }}
      >
        <svg viewBox="0 0 600 244" className="absolute inset-0 h-full w-full overflow-visible" style={{ backfaceVisibility: 'hidden' }} aria-hidden>
          <PaperDefs id={`${id}-f`} />
          <path d={FLAP} fill={`url(#${id}-f-flap)`} filter={`url(#${id}-f-paper)`} />
          <path d={FLAP} fill={`url(#${id}-f-age)`} />
          {/* sombra de la solapa sobre el bolsillo */}
          <path d="M0 0 L 270 222 Q 300 244 330 222 L 600 0" fill="none" stroke="#6b5143" strokeOpacity="0.22" strokeWidth="1.4" />
        </svg>
        <svg
          viewBox="0 0 600 244"
          className="absolute inset-0 h-full w-full overflow-visible"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
          aria-hidden
        >
          <PaperDefs id={`${id}-fi`} />
          <path d={FLAP} fill={`url(#${id}-fi-inside)`} filter={`url(#${id}-fi-paper)`} />
        </svg>
      </motion.div>

      {/* sello de lacre */}
      <div className="absolute left-1/2 top-[55%] w-[26%] -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 5 }}>
        {onSeal ? (
          <button
            type="button"
            onClick={onSeal}
            disabled={broken}
            aria-label={sealLabel}
            className="seal-button relative block w-full rounded-full"
          >
            {sealPulse && !broken && <span className="seal-halo" aria-hidden />}
            <WaxSeal id={id} broken={broken} />
          </button>
        ) : (
          <WaxSeal id={id} broken={false} />
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────── Lacre ─────────────────────────────── */

// contorno irregular de lacre derramado
const BLOB =
  'M100 8 C 128 6, 150 18, 166 34 C 184 50, 196 74, 192 102 C 196 130, 184 156, 162 172 C 142 190, 116 196, 92 192 C 64 194, 40 182, 24 162 C 8 142, 2 116, 8 90 C 6 64, 18 40, 38 24 C 56 10, 78 6, 100 8 Z';
const STAR = 'M100 62 L 109 88 L 136 88 L 114 104 L 122 130 L 100 114 L 78 130 L 86 104 L 64 88 L 91 88 Z';
const CRACK = 'M96 0 L 104 40 L 92 70 L 108 100 L 94 128 L 106 160 L 98 200';

function WaxSeal({ id, broken }: { id: string; broken: boolean }) {
  const half = (side: 'L' | 'R') => (
    <motion.g
      initial={false}
      animate={
        broken
          ? side === 'L'
            ? { x: -26, y: 34, rotate: -16, opacity: 0 }
            : { x: 24, y: 42, rotate: 13, opacity: 0 }
          : { x: 0, y: 0, rotate: 0, opacity: 1 }
      }
      transition={{
        x: { duration: 0.9, ease: SOFT, delay: 0.18 },
        y: { duration: 0.9, ease: [0.5, 0, 0.9, 0.6], delay: 0.18 },
        rotate: { duration: 0.9, ease: SOFT, delay: 0.18 },
        opacity: { duration: 0.35, delay: 0.85 },
      }}
      clipPath={`url(#${id}-half${side})`}
    >
      <SealBody id={id} />
    </motion.g>
  );
  return (
    <svg viewBox="-10 -10 220 220" className="block w-full overflow-visible" aria-hidden>
      <defs>
        <clipPath id={`${id}-halfL`}>
          <path d={`${CRACK} L -20 200 L -20 0 Z`} />
        </clipPath>
        <clipPath id={`${id}-halfR`}>
          <path d={`${CRACK} L 220 200 L 220 0 Z`} />
        </clipPath>
        {/* el gris del dibujo es la ALTURA del lacre; el filtro lo ilumina */}
        <radialGradient id={`${id}-dome`} cx="0.5" cy="0.5" r="0.55">
          <stop offset="0" stopColor="#c8c8c8" />
          <stop offset="0.75" stopColor="#a6a6a6" />
          <stop offset="1" stopColor="#5a5a5a" />
        </radialGradient>
        <radialGradient id={`${id}-press`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#8e8e8e" />
          <stop offset="1" stopColor="#7a7a7a" />
        </radialGradient>
        <filter id={`${id}-wax`} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="h0" />
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="3" result="tex" />
          <feColorMatrix in="tex" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0" result="texA" />
          <feComposite in="h0" in2="texA" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="h1" />
          <feGaussianBlur in="h1" stdDeviation="1.1" result="h" />
          <feDiffuseLighting in="h" surfaceScale="9" diffuseConstant="1.05" lightingColor="#ffffff" result="diff">
            <feDistantLight azimuth="225" elevation="48" />
          </feDiffuseLighting>
          <feSpecularLighting in="h" surfaceScale="9" specularConstant="0.75" specularExponent="34" lightingColor="#ffe9d8" result="spec">
            <feDistantLight azimuth="225" elevation="52" />
          </feSpecularLighting>
          <feFlood floodColor="#5b3122" result="wax" />
          <feComposite in="wax" in2="diff" operator="arithmetic" k1="1.05" k2="0.18" k3="0" k4="0" result="lit" />
          <feComposite in="lit" in2="spec" operator="arithmetic" k1="0" k2="1" k3="0.42" k4="0" result="shine" />
          <feComposite in="shine" in2="SourceAlpha" operator="in" />
        </filter>
        <filter id={`${id}-sealShadow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#2a1810" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter={`url(#${id}-sealShadow)`}>
        {half('L')}
        {half('R')}
      </g>
      {/* esquirlas */}
      {[
        [96, 40, -40, -30],
        [104, 120, 36, 52],
        [92, 160, -30, 64],
      ].map(([x, y, dx, dy], i) => (
        <motion.path
          key={i}
          d={`M${x} ${y} l 7 -3 l 3 7 l -8 3 z`}
          fill="#4a2a1e"
          initial={false}
          animate={broken ? { x: dx, y: dy, opacity: [1, 1, 0], rotate: 90 } : { x: 0, y: 0, opacity: 0, rotate: 0 }}
          transition={{ duration: 0.8, ease: SOFT, delay: 0.12 }}
        />
      ))}
    </svg>
  );
}

function SealBody({ id }: { id: string }) {
  // Mapa de alturas en grises (claro = alto). El filtro `wax` lo convierte en lacre iluminado.
  return (
    <g filter={`url(#${id}-wax)`}>
      <path d={BLOB} fill={`url(#${id}-dome)`} />
      {/* borde del sello prensado: anillo elevado */}
      <circle cx="100" cy="100" r="64" fill="none" stroke="#d0d0d0" strokeWidth="7" />
      {/* zona prensada (más baja) */}
      <circle cx="100" cy="100" r="60" fill={`url(#${id}-press)`} />
      <circle cx="100" cy="100" r="51" fill="none" stroke="#9a9a9a" strokeWidth="1.6" strokeDasharray="2.5 4" />
      {/* estrella grabada en relieve */}
      <path d={STAR} fill="#b4b4b4" />
      <path d={STAR} fill="none" stroke="#c4c4c4" strokeWidth="2" strokeLinejoin="round" />
    </g>
  );
}

/* ─────────────────────────────── Carta ─────────────────────────────── */

/** Hoja de papel antiguo. `folded` dibuja los pliegues de la carta doblada. */
export function LetterSheet({ folded = false, children, className = '' }: { folded?: boolean; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`letter-paper relative h-full w-full overflow-hidden ${className}`}>
      {folded && (
        <>
          <span className="letter-crease absolute inset-x-0 top-1/3" aria-hidden />
          <span className="letter-crease absolute inset-x-0 top-2/3" aria-hidden />
        </>
      )}
      {children}
    </div>
  );
}
