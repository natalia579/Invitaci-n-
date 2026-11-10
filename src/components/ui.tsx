import { motion, useReducedMotion } from 'framer-motion';
import { invitation } from '../content/invitation';
import { Ornament } from './illustrations/Sky';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Aparición suave al entrar en pantalla (como una página que se revela). */
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
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: reduce ? 0.4 : 1.3, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

/** Encabezado de capítulo: “Capítulo III · Save the Date”. */
export function ChapterHeading({ number, label }: { number: string; label: string }) {
  return (
    <Reveal className="flex flex-col items-center gap-3 text-center">
      <span className="label text-gold">Capítulo {number}</span>
      <span className="font-display text-[1.05rem] italic text-cafe">{label}</span>
      <Ornament className="mt-1 w-40" />
    </Reveal>
  );
}

/** Contenedor de capítulo: una “página” del cuento. */
export function Chapter({
  id,
  children,
  className = '',
  decor,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  decor?: React.ReactNode;
}) {
  return (
    <section id={id} className={`chapter relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-7 py-24 ${className}`}>
      {decor && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {decor}
        </div>
      )}
      <div className="relative z-10 flex w-full max-w-[26rem] flex-col items-center sm:max-w-[30rem]">{children}</div>
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
