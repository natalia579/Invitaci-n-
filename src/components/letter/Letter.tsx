import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { invitation } from '../../content/invitation';
import { RockingHorse } from '../illustrations/RockingHorse';
import { Sparkle, Star } from '../illustrations/Sky';
import { Stork } from '../illustrations/Objects';
import { EASE } from '../ui';

/**
 * LA CARTA (continuación del papel que se desplegó en la apertura).
 * Una sola pieza: mismo papel, mismos filetes dorados a los lados, sin títulos.
 * Cada párrafo aparece al llegar a él; las frases con protagonismo respiran
 * más y tienen tipografía mayor. Las ilustraciones viven en los márgenes.
 */
export function Letter() {
  const L = invitation.letter;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const storkX = useTransform(scrollYProgress, [0.15, 0.6], reduce ? ['0%', '0%'] : ['60%', '-140%']);
  const storkY = useTransform(scrollYProgress, [0.15, 0.6], reduce ? ['0%', '0%'] : ['10%', '-30%']);

  return (
    <section ref={ref} aria-label="Carta" className="letter-continue relative w-full">
      {/* filetes dorados que continúan los de la carta abierta */}
      <span className="pointer-events-none absolute inset-y-0 left-[14px] w-px bg-gold/50" aria-hidden />
      <span className="pointer-events-none absolute inset-y-0 left-[19px] w-px bg-gold/25" aria-hidden />
      <span className="pointer-events-none absolute inset-y-0 right-[14px] w-px bg-gold/50" aria-hidden />
      <span className="pointer-events-none absolute inset-y-0 right-[19px] w-px bg-gold/25" aria-hidden />

      <div className="relative mx-auto flex max-w-[31rem] flex-col px-10 pb-[4dvh] pt-[10dvh] sm:px-14">
        {L.body.map((p, i) => {
          const isFirstEmph = p.emphasis && !p.final;
          return (
            <div key={i} className={p.emphasis ? 'my-[13dvh] text-center' : 'my-[5.5dvh]'}>
              {/* ilustraciones en el margen, acompañando — no interrumpen */}
              {i === 1 && (
                <motion.div
                  className="pointer-events-none float-right -mr-4 mb-2 ml-3 mt-1 w-[38%] max-w-[170px]"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1.6, ease: EASE }}
                  aria-hidden
                >
                  <div className="rock origin-[50%_88%]">
                    <RockingHorse className="w-full" />
                  </div>
                </motion.div>
              )}
              {isFirstEmph && (
                <motion.div className="pointer-events-none relative h-0" style={{ x: storkX, y: storkY }} aria-hidden>
                  <Stork className="stork-fly absolute -top-[16dvh] right-0 w-[46%] max-w-[200px] opacity-80" />
                </motion.div>
              )}
              {p.emphasis ? (
                <Emphasis text={p.text} final={p.final} />
              ) : (
                <Paragraph text={p.text} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Paragraph({ text }: { text: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.p
      className="letter-body font-serif text-[1.06rem] font-light leading-[1.95] text-cocoa sm:text-[1.14rem]"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(5px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.5, ease: EASE }}
    >
      {text}
    </motion.p>
  );
}

/** Frases con protagonismo: palabra por palabra, con ornamento propio. */
function Emphasis({ text, final }: { text: string; final?: boolean }) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  return (
    <motion.div initial="h" whileInView="s" viewport={{ once: true, amount: 0.7 }} className="relative">
      <motion.div
        className="mb-6 flex items-center justify-center gap-3"
        variants={{ h: { opacity: 0 }, s: { opacity: 1, transition: { duration: 1.2 } } }}
        aria-hidden
      >
        <span className="h-px w-10 bg-gold/60" />
        {final ? <Star className="w-4" /> : <Sparkle className="w-3.5" />}
        <span className="h-px w-10 bg-gold/60" />
      </motion.div>
      <p
        className={
          final
            ? 'font-display text-[2.05rem] font-normal italic leading-[1.22] text-cocoa sm:text-[2.5rem]'
            : 'font-display text-[2.35rem] font-normal italic leading-[1.15] text-cocoa sm:text-[2.8rem]'
        }
        aria-label={text}
      >
        {words.map((w, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="inline-block whitespace-pre"
            variants={{
              h: reduce ? { opacity: 0 } : { opacity: 0, y: 10, filter: 'blur(6px)' },
              s: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.1, ease: EASE, delay: 0.25 + i * 0.09 } },
            }}
          >
            {w + (i < words.length - 1 ? ' ' : '')}
          </motion.span>
        ))}
      </p>
      {final && (
        <motion.div
          className="mt-8 flex justify-center gap-6"
          variants={{ h: { opacity: 0 }, s: { opacity: 1, transition: { duration: 1.4, delay: 0.25 + words.length * 0.09 } } }}
          aria-hidden
        >
          <Sparkle className="twinkle w-3" />
          <Sparkle className="twinkle twinkle-d2 w-2.5" />
          <Sparkle className="twinkle twinkle-d1 w-3" />
        </motion.div>
      )}
    </motion.div>
  );
}
