/**
 * Filtros SVG compartidos que dan a las ilustraciones vectoriales un acabado
 * de acuarela: bordes orgánicos, pigmento acumulado en el borde y granulado.
 * Se renderiza una sola vez en la raíz de la app.
 */
export function WatercolorDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        {/* Aguada: bordes irregulares + borde más pigmentado + granulado */}
        <filter id="wc-wash" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed="4" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="7" xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feGaussianBlur in="shape" stdDeviation="0.55" result="soft" />
          <feGaussianBlur in="soft" stdDeviation="3.2" result="inner" />
          <feComposite in="soft" in2="inner" operator="out" result="rim" />
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="21" result="blotch" />
          <feColorMatrix in="blotch" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.9 0 0 0 0.42" result="blotchA" />
          <feComposite in="soft" in2="blotchA" operator="in" result="mottled" />
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="9" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.55 0 0 0 0.62" result="grainA" />
          <feComposite in="mottled" in2="grainA" operator="in" result="grained" />
          <feMerge>
            <feMergeNode in="grained" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>

        {/* Nubes: bordes muy suaves que se funden con el papel */}
        <filter id="wc-cloud" x="-20%" y="-30%" width="140%" height="160%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="4" seed="7" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="24" xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feGaussianBlur in="shape" stdDeviation="3.2" result="soft" />
          <feGaussianBlur in="soft" stdDeviation="5" result="inner" />
          <feComposite in="soft" in2="inner" operator="out" result="rim" />
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="3" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.5 0 0 0 0.66" result="grainA" />
          <feComposite in="soft" in2="grainA" operator="in" result="grained" />
          <feMerge>
            <feMergeNode in="grained" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>

        {/* Tinta: línea temblorosa, como dibujada a plumilla */}
        <filter id="wc-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* Raso: degradados reutilizables para cintas */}
        <linearGradient id="satin-v" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4a372e" />
          <stop offset="0.22" stopColor="#6B5143" />
          <stop offset="0.42" stopColor="#957563" />
          <stop offset="0.52" stopColor="#7d5f50" />
          <stop offset="0.78" stopColor="#5f4639" />
          <stop offset="1" stopColor="#3f2f27" />
        </linearGradient>
        <linearGradient id="satin-h" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a372e" />
          <stop offset="0.22" stopColor="#6B5143" />
          <stop offset="0.42" stopColor="#957563" />
          <stop offset="0.52" stopColor="#7d5f50" />
          <stop offset="0.78" stopColor="#5f4639" />
          <stop offset="1" stopColor="#3f2f27" />
        </linearGradient>
        <linearGradient id="satin-diag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5a4336" />
          <stop offset="0.35" stopColor="#8c6d5b" />
          <stop offset="0.5" stopColor="#a6887a" />
          <stop offset="0.65" stopColor="#7a5c4c" />
          <stop offset="1" stopColor="#45342b" />
        </linearGradient>
        <radialGradient id="cloud-fill" cx="0.45" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#FFFDF8" />
          <stop offset="0.55" stopColor="#F5F1E8" />
          <stop offset="1" stopColor="#DCE2E3" />
        </radialGradient>
        <linearGradient id="gold-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c9b797" />
          <stop offset="0.5" stopColor="#B5A082" />
          <stop offset="1" stopColor="#97825f" />
        </linearGradient>
      </defs>
    </svg>
  );
}
