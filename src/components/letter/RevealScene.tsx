import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { invitation } from '../../content/invitation';
import { Balloon } from '../illustrations/Balloon';
import { Sparkle } from '../illustrations/Sky';
import { paintCloud, paintSky } from '../../opening/paint';
import { EASE } from '../ui';

/**
 * Transición carta → invitación.
 * La escena queda fija mientras el invitado desliza: el papel de la carta
 * sube como un telón y deja ver un cielo pintado con globos; entonces se
 * revela el título “Gender Reveal & Baby Shower”.
 */
export function RevealScene() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [shown, setShown] = useState(reduce);
  useMotionValueEvent(p, 'change', (v) => {
    if (v > 0.3 && !shown) setShown(true);
  });

  const art = useMemo(() => {
    const w = Math.min(1000, Math.round(window.innerWidth * Math.min(2, window.devicePixelRatio || 1)));
    const h = Math.round((w * window.innerHeight) / window.innerWidth);
    return { sky: paintSky(w, h), c1: paintCloud(900, 420, 57), c2: paintCloud(900, 420, 73), c3: paintCloud(820, 400, 91) };
  }, []);

  const paperY = useTransform(p, [0, 0.4], reduce ? ['-100%', '-100%'] : ['-18%', '-104%']);
  const skyS = useTransform(p, [0, 1], reduce ? [1, 1] : [1.08, 1]);
  const farB = useTransform(p, [0, 1], reduce ? ['0%', '0%'] : ['30%', '-25%']);
  const nearB = useTransform(p, [0, 1], reduce ? ['0%', '0%'] : ['70%', '-60%']);
  const cloudL = useTransform(p, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '-30%']);
  const cloudR = useTransform(p, [0, 1], reduce ? ['0%', '0%'] : ['8%', '30%']);

  const letters = (word: string, base: number) =>
    word.split('').map((ch, i) => (
      <motion.span
        key={i}
        className="inline-block"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: '0.8em' }}
        animate={shown ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.1, ease: EASE, delay: base + i * 0.045 }}
      >
        {ch === ' ' ? ' ' : ch}
      </motion.span>
    ));

  return (
    <section ref={ref} aria-label="Gender Reveal & Baby Shower" className="relative h-[210dvh]">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* cielo pintado */}
        <motion.img src={art.sky} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ scale: skyS }} aria-hidden />

        {/* globos a distintas distancias */}
        <motion.div className="absolute left-[8%] top-[14%] w-[16%] max-w-[90px] opacity-70" style={{ y: farB }} aria-hidden>
          <div className="bob-slow">
            <Balloon className="w-full" />
          </div>
        </motion.div>
        <motion.div className="absolute right-[10%] top-[8%] w-[11%] max-w-[64px] opacity-55" style={{ y: farB }} aria-hidden>
          <div className="bob">
            <Balloon className="w-full" />
          </div>
        </motion.div>
        <motion.div className="absolute right-[-12%] top-[68%] w-[30%] max-w-[170px]" style={{ y: nearB }} aria-hidden>
          <div className="bob">
            <Balloon className="w-full" />
          </div>
        </motion.div>

        {/* nubes */}
        <motion.img src={art.c1} alt="" className="drift-a absolute left-[-34%] top-[4%] w-[82%]" style={{ x: cloudL }} aria-hidden />
        <motion.img src={art.c3} alt="" className="drift-b absolute right-[-40%] top-[30%] w-[84%] opacity-80" style={{ x: cloudR }} aria-hidden />
        <motion.img src={art.c2} alt="" className="drift-slow absolute bottom-[-8%] left-[-40%] w-[110%]" style={{ x: cloudL }} aria-hidden />

        {/* título */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <div className="reveal-glow relative py-10">
            <h2 className="font-display font-normal uppercase leading-[1.04] text-cocoa">
              <span className="block overflow-hidden whitespace-nowrap pb-1 text-[2.05rem] tracking-[0.1em] sm:text-[3.2rem] sm:tracking-[0.14em]">
                {letters(invitation.reveal.title[0], 0.1)}
              </span>
              <motion.span
                className="my-2 block font-display text-[2.6rem] normal-case italic text-gold"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.4, rotate: -20 }}
                animate={shown ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ duration: 1.2, ease: EASE, delay: 0.85 }}
              >
                &amp;
              </motion.span>
              <span className="block overflow-hidden whitespace-nowrap pb-1 text-[2.05rem] tracking-[0.1em] sm:text-[3.2rem] sm:tracking-[0.14em]">
                {letters(invitation.reveal.title[1], 1.1)}
              </span>
            </h2>
            {[
              [-44, -30, 1.6],
              [46, -38, 1.9],
              [-40, 40, 2.1],
              [44, 34, 2.3],
            ].map(([x, y, d], i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 w-3"
                style={{ marginLeft: `${x}%`, marginTop: `${y}%` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={shown ? { opacity: [0, 1, 0.75], scale: [0, 1.3, 1] } : {}}
                transition={{ duration: 1.4, delay: d }}
                aria-hidden
              >
                <Sparkle className="twinkle w-full" />
              </motion.span>
            ))}
          </div>
        </div>

        {/* el papel de la carta sube como un telón */}
        <motion.div className="letter-continue absolute inset-0 z-20" style={{ y: paperY }} aria-hidden>
          <span className="absolute inset-y-0 left-[14px] w-px bg-gold/50" />
          <span className="absolute inset-y-0 left-[19px] w-px bg-gold/25" />
          <span className="absolute inset-y-0 right-[14px] w-px bg-gold/50" />
          <span className="absolute inset-y-0 right-[19px] w-px bg-gold/25" />
          <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="paper-deckle absolute inset-x-0 top-full h-6 w-full">
            <path
              d="M0 0 L 400 0 L 400 8 C 380 11, 366 6, 350 10 C 330 14, 318 7, 298 11 C 280 14, 262 8, 244 12 C 226 15, 210 9, 190 12 C 170 15, 152 8, 134 11 C 116 14, 100 8, 80 12 C 62 15, 44 9, 26 12 C 14 14, 6 10, 0 12 Z"
              fill="#f8f3e9"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
