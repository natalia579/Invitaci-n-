import { motion, useReducedMotion } from 'framer-motion';
import { invitation } from '../content/invitation';
import { Ornament } from './illustrations/Sky';

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Aparición suave al entrar en pantalla. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 22,
  as = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  as?: 'div' | 'p' | 'h2' | 'h3' | 'span';
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduce ? 0.4 : 1.3, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

/** Aparición “como una página que se asienta”: gira levemente desde el lomo. */
export function PageReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <div className={className} style={{ perspective: 1400 }}>
      <motion.div
        style={{ transformOrigin: '0% 50%' }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, rotateY: -22, x: -12 }}
        whileInView={reduce ? { opacity: 1 } : { opacity: 1, rotateY: 0, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: reduce ? 0.4 : 1.5, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Encabezado de capítulo: numeral romano grande + título en cursiva. */
export function ChapterHeading({
  number,
  label,
  align = 'center',
}: {
  number: string;
  label: string;
  align?: 'center' | 'left' | 'right';
}) {
  const a = align === 'center' ? 'items-center text-center' : align === 'left' ? 'items-start text-left' : 'items-end text-right';
  return (
    <Reveal className={`flex flex-col gap-1 ${a}`}>
      <span className="label text-gold">Capítulo</span>
      <span className="font-display text-[3.4rem] font-light leading-none text-gold/90">{number}</span>
      <span className="mt-1 max-w-[18rem] font-display text-[1.25rem] italic leading-snug text-cafe">{label}</span>
      <Ornament className="mt-2 w-36" />
    </Reveal>
  );
}

/** Contenedor de capítulo: una “página” del cuento. */
export function Chapter({
  id,
  children,
  className = '',
  decor,
  inner = 'max-w-[26rem] sm:max-w-[30rem]',
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  decor?: React.ReactNode;
  inner?: string;
}) {
  return (
    <section id={id} className={`chapter relative flex min-h-[100svh] w-full flex-col items-center justify-center px-7 py-24 ${className}`}>
      {decor && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {decor}
        </div>
      )}
      <div className={`relative z-10 flex w-full flex-col items-center ${inner}`}>{children}</div>
    </section>
  );
}

/** Etiqueta visible sólo mientras hay datos pendientes (ver meta.showPendingMarkers). */
export function Pending({ children = 'Pendiente' }: { children?: React.ReactNode }) {
  if (!invitation.meta.showPendingMarkers) return null;
  return (
    <span className="ml-2 inline-flex items-center rounded-full border border-dashed border-cafe/40 px-2 py-[1px] align-middle font-sans text-[0.6rem] uppercase tracking-[0.18em] text-cafe/70">
      {children}
    </span>
  );
}

export function Body({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-serif text-[0.98rem] font-light leading-[1.85] text-cocoa/90 sm:text-[1.05rem] ${className}`}>{children}</p>;
}
