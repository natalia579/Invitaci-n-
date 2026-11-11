import { motion, useReducedMotion } from 'framer-motion';
import { invitation } from '../../content/invitation';
import { Sparkle, Star } from '../illustrations/Sky';
import { EASE } from '../ui';

/**
 * LA CARTA (continuación del papel que se desplegó en la apertura).
 * Corta y sobria: un párrafo y la frase protagonista (la firma va en el cierre).
 * Mismo papel y mismos filetes dorados; sin títulos.
 */
export function Letter() {
  const L = invitation.letter;
  return (
    <section aria-label="Carta" className="letter-continue relative w-full">
      {/* filetes dorados que continúan los de la carta abierta */}
      <span className="pointer-events-none absolute inset-y-0 left-[14px] w-px bg-gold/50" aria-hidden />
      <span className="pointer-events-none absolute inset-y-0 left-[19px] w-px bg-gold/25" aria-hidden />
      <span className="pointer-events-none absolute inset-y-0 right-[14px] w-px bg-gold/50" aria-hidden />
      <span className="pointer-events-none absolute inset-y-0 right-[19px] w-px bg-gold/25" aria-hidden />

      <div className="relative mx-auto flex max-w-[31rem] flex-col px-10 pb-[6dvh] pt-[6dvh] sm:px-14">
        {L.body.map((p, i) => (
          <div key={i} className={p.emphasis ? 'my-[9dvh] text-center' : 'my-[4dvh] text-center'}>
            {p.emphasis ? <Emphasis text={p.text} final={p.final} /> : <Paragraph text={p.text} />}
          </div>
        ))}
      </div>
    </section>
  );
}

function Paragraph({ text }: { text: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.p
      className="letter-body font-serif text-[1.08rem] font-light leading-[1.9] text-cocoa sm:text-[1.16rem]"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(5px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      {text}
    </motion.p>
  );
}

/** Frase protagonista: palabra por palabra, con ornamento propio. */
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
      <p className="font-display text-[2.3rem] font-normal italic leading-[1.18] text-cocoa sm:text-[2.8rem]" aria-label={text}>
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
      <motion.div
        className="mt-8 flex justify-center gap-6"
        variants={{ h: { opacity: 0 }, s: { opacity: 1, transition: { duration: 1.4, delay: 0.25 + words.length * 0.09 } } }}
        aria-hidden
      >
        <Sparkle className="twinkle w-3" />
        <Sparkle className="twinkle twinkle-d2 w-2.5" />
        <Sparkle className="twinkle twinkle-d1 w-3" />
      </motion.div>
    </motion.div>
  );
}
