import { invitation } from '../../content/invitation';

/** Caballito mecedor de madera, acuarela + plumilla. */
export function RockingHorse({ className }: { className?: string }) {
  const custom = invitation.illustrations.rockingHorse;
  if (custom) return <img src={custom} alt="Caballito mecedor" className={className} draggable={false} />;

  const wood = '#C9AE8E';
  const woodDark = '#9B7A61';
  const ink = '#6B5143';
  return (
    <svg viewBox="0 0 260 210" className={className} role="img" aria-label="Caballito mecedor de madera">
      {/* sombra */}
      <ellipse cx="128" cy="198" rx="96" ry="6" fill="#A8B7C0" opacity="0.35" filter="url(#wc-cloud)" />

      <g filter="url(#wc-wash)">
        {/* balancín */}
        <path d="M22 168 Q 128 212 236 168 L 236 176 Q 128 220 22 176 Z" fill={woodDark} />
        {/* patas traseras */}
        <path d="M86 112 L 70 180 L 80 182 L 98 116 Z" fill={wood} />
        <path d="M102 114 L 96 184 L 106 184 L 114 116 Z" fill={woodDark} opacity="0.9" />
        {/* patas delanteras */}
        <path d="M150 114 L 160 184 L 170 182 L 162 112 Z" fill={woodDark} opacity="0.9" />
        <path d="M164 110 L 186 178 L 196 175 L 176 108 Z" fill={wood} />
        {/* cola */}
        <path d="M72 96 C 52 100, 40 116, 34 140 C 46 128, 54 122, 64 120 C 56 132, 54 144, 56 154 C 66 134, 76 118, 82 106 Z" fill="#8E6E5A" opacity="0.85" />
        {/* cuerpo */}
        <path d="M70 100 C 70 82, 92 76, 128 76 C 160 76, 178 82, 180 98 C 182 116, 160 122, 128 122 C 94 122, 70 118, 70 100 Z" fill="#EFE5D5" />
        {/* cuello y cabeza */}
        <path d="M156 92 C 160 66, 170 46, 186 34 C 196 26, 208 26, 216 36 L 226 52 C 230 60, 224 66, 216 62 L 206 56 C 198 66, 188 82, 182 102 Z" fill="#EFE5D5" />
        {/* manchas */}
        <g fill="#A8B7C0" opacity="0.55">
          <ellipse cx="104" cy="94" rx="9" ry="6" />
          <ellipse cx="128" cy="104" rx="6" ry="4" />
          <ellipse cx="88" cy="106" rx="5" ry="3.5" />
          <ellipse cx="150" cy="100" rx="5" ry="3.5" />
          <ellipse cx="176" cy="66" rx="4.5" ry="3" />
        </g>
        {/* crin */}
        <path d="M184 34 C 172 40, 166 50, 160 62 C 156 72, 152 80, 152 92 C 160 80, 162 72, 168 64 C 166 74, 166 82, 168 90 C 172 74, 176 60, 186 48 Z" fill="#8E6E5A" opacity="0.9" />
        {/* montura */}
        <path d="M108 80 C 116 74, 140 74, 150 80 L 148 94 C 138 98, 118 98, 110 94 Z" fill="#A8B7C0" />
        <path d="M108 80 C 116 74, 140 74, 150 80" fill="none" stroke="#B5A082" strokeWidth="2.5" />
        {/* oreja */}
        <path d="M194 30 L 196 16 L 204 28 Z" fill="#E3D5C1" />
      </g>

      {/* plumilla */}
      <g fill="none" stroke={ink} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" filter="url(#wc-ink)">
        <path d="M22 172 Q 128 216 236 172" />
        <path d="M70 100 C 70 82, 92 76, 128 76 C 160 76, 178 82, 180 98" />
        <path d="M74 112 C 92 122, 160 124, 178 110" />
        <path d="M216 36 L 226 52 C 230 60, 224 66, 216 62 L 206 56" />
        <path d="M186 34 C 196 26, 208 26, 216 36" />
        <path d="M128 86 L 128 112" opacity="0.6" />
        <path d="M133 96 C 136 104, 136 110, 130 114" opacity="0.6" />
        {/* riendas */}
        <path d="M218 58 C 200 70, 180 74, 160 80" stroke="#B5A082" strokeWidth="1.2" />
      </g>
      {/* ojo y detalles */}
      <circle cx="208" cy="40" r="1.8" fill="#49372F" />
      <circle cx="221" cy="56" r="1" fill="#49372F" opacity="0.6" />
      <g fill="#B5A082">
        <circle cx="80" cy="176" r="2" />
        <circle cx="128" cy="190" r="2" />
        <circle cx="176" cy="178" r="2" />
        <path d="M128 84 l3 4 -3 4 -3 -4 z" />
      </g>
    </svg>
  );
}
