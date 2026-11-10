import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { invitation } from '../content/invitation';
import { Balloon } from './illustrations/Balloon';
import { Cloud, Sparkle, Sprig } from './illustrations/Sky';
import { BOW } from './illustrations/Objects';
import { useMusic } from '../hooks/useMusic';

/**
 * APERTURA CINEMATOGRÁFICA (~6,5 s)
 *  0.0s  Página de cuento con una tarjeta tríptica atada con cinta de raso
 *  0.9s  El lazo se desata solo (los lazos se recogen, las colas caen)
 *  1.9s  La cinta se desliza fuera de la tarjeta; empiezan a llegar las nubes
 *  2.5s  Las puertas de la tarjeta se abren hacia los lados
 *  3.1s  El globo asciende desde abajo entre las nubes
 *  4.8s  “Una pequeña historia está por comenzar…”
 *  5.8s  “Y queremos que seas parte de ella.”
 *  6.6s  Indicación para deslizar
 */
const T = { untie: 900, release: 1900, open: 2500, balloon: 3100, line1: 4800, line2: 5800, done: 6600 };
const EASE = [0.22, 1, 0.36, 1] as const;
const SOFT = [0.45, 0, 0.2, 1] as const;

type Stage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

function useTimeline(skip: boolean) {
  const [stage, setStage] = useState<Stage>(skip ? 7 : 0);
  useEffect(() => {
    if (skip) {
      setStage(7);
      return;
    }
    const steps = [T.untie, T.release, T.open, T.balloon, T.line1, T.line2, T.done];
    const ids = steps.map((ms, i) => window.setTimeout(() => setStage((i + 1) as Stage), ms));
    return () => ids.forEach(clearTimeout);
  }, [skip]);
  return stage;
}

export function Opening({ onComplete }: { onComplete: () => void }) {
  const reduce = useReducedMotion() ?? false;
  const stage = useTimeline(reduce);
  const music = useMusic();
  const o = invitation.opening;

  // Bloquea el desplazamiento mientras corre la apertura
  useEffect(() => {
    const root = document.documentElement;
    if (stage < 6) {
      root.classList.add('is-locked');
    } else {
      root.classList.remove('is-locked');
    }
    if (stage === 7) onComplete();
    return () => root.classList.remove('is-locked');
  }, [stage, onComplete]);

  // Intenta iniciar la música cuando la tarjeta se abre
  useEffect(() => {
    if (stage === 3) music.tryAutoplay();
    if (reduce && stage === 7) music.tryAutoplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Parallax al salir de la portada
  const { scrollY } = useScroll();
  const balloonY = useTransform(scrollY, [0, 900], [0, reduce ? 0 : -260]);
  const farY = useTransform(scrollY, [0, 900], [0, reduce ? 0 : -90]);
  const nearY = useTransform(scrollY, [0, 900], [0, reduce ? 0 : -380]);
  const textY = useTransform(scrollY, [0, 900], [0, reduce ? 0 : -140]);
  const fade = useTransform(scrollY, [0, 520], [1, 0]);

  const sceneOn = stage >= 2;

  return (
    <section
      aria-label="Apertura"
      className="relative flex h-[100svh] min-h-[560px] w-full flex-col items-center justify-center overflow-hidden pb-[9svh]"
    >
      {/* Aguada de cielo */}
      <motion.div
        aria-hidden
        className="sky-wash pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 3 ? 1 : 0 }}
        transition={{ duration: 2.4, ease: SOFT }}
      />

      {/* Nubes lejanas */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ y: farY }}>
        <CloudLayer on={sceneOn} />
      </motion.div>

      {/* Destellos */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 4 ? 1 : 0 }}
        transition={{ duration: 2 }}
      >
        <Sparkle className="twinkle absolute left-[14%] top-[12%] w-3" />
        <Sparkle className="twinkle twinkle-d1 absolute right-[18%] top-[20%] w-4" />
        <Sparkle className="twinkle twinkle-d2 absolute left-[24%] top-[42%] w-2.5" />
        <Sparkle className="twinkle twinkle-d3 absolute right-[12%] top-[50%] w-3" />
        <Sparkle className="twinkle twinkle-d1 absolute left-[8%] top-[64%] w-2" />
      </motion.div>

      {/* Globo + banderola */}
      <motion.div className="relative z-10 flex flex-col items-center" style={{ y: balloonY }}>
        <motion.div
          initial={{ y: '82svh', opacity: 0 }}
          animate={stage >= 4 ? { y: 0, opacity: 1 } : { y: '82svh', opacity: 0 }}
          transition={{ y: { duration: 3.0, ease: EASE }, opacity: { duration: 0.8 } }}
          className="flex flex-col items-center"
        >
          <div className="bob flex flex-col items-center">
            <Balloon className="balloon-size drop-shadow-balloon h-auto" />
            <Pennant text={o.banner} />
          </div>
        </motion.div>
      </motion.div>

      {/* Textos */}
      <motion.div
        className="relative z-10 mt-[3.5svh] max-w-[22rem] px-8 text-center"
        style={{ y: textY, opacity: fade }}
      >
        <motion.p
          className="font-display text-[1.65rem] font-light italic leading-snug text-cocoa sm:text-[2rem]"
          initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
          animate={stage >= 5 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.6, ease: EASE }}
        >
          {o.line1}
        </motion.p>
        <motion.p
          className="mt-3 font-serif text-[1.05rem] text-cafe sm:text-lg"
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          animate={stage >= 6 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.4, ease: EASE }}
        >
          {o.line2}
        </motion.p>
      </motion.div>

      {/* Nubes cercanas (por delante, dan profundidad) */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-20" style={{ y: nearY }}>
        <motion.div
          className="absolute -left-[18%] bottom-[2%] w-[62%] max-w-[420px]"
          initial={{ x: '-40%', opacity: 0 }}
          animate={sceneOn ? { x: 0, opacity: 0.95 } : {}}
          transition={{ duration: 4.2, ease: EASE, delay: 0.6 }}
        >
          <Cloud variant={2} className="drift-slow w-full" />
        </motion.div>
        <motion.div
          className="absolute -right-[16%] bottom-[10%] w-[52%] max-w-[360px]"
          initial={{ x: '40%', opacity: 0 }}
          animate={sceneOn ? { x: 0, opacity: 0.9 } : {}}
          transition={{ duration: 4.6, ease: EASE, delay: 0.9 }}
        >
          <Cloud variant={0} className="drift-slow-rev w-full" />
        </motion.div>
      </motion.div>

      {/* Indicación para deslizar */}
      <motion.div className="absolute bottom-[3.5svh] z-30" style={{ opacity: fade }}>
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 7 ? 1 : 0 }}
          transition={{ duration: 1.2 }}
        >
          <span className="label text-cafe/80">{o.scrollHint}</span>
          <span className="scroll-line" aria-hidden />
        </motion.div>
      </motion.div>

      {/* La tarjeta atada con la cinta */}
      <AnimatePresence>{stage < 4 && !reduce && <Gatefold stage={stage} />}</AnimatePresence>
    </section>
  );
}

/* ─────────────────────────────── Banderola de papel ─────────────────────────────── */

function Pennant({ text }: { text: string }) {
  return (
    <div className="pennant-swing -mt-[2px] flex flex-col items-center">
      <svg viewBox="0 0 120 26" className="h-[22px] w-[110px]" aria-hidden>
        <path d="M44 0 L 14 26 M76 0 L 106 26" stroke="#6B5143" strokeWidth="0.8" opacity="0.7" />
      </svg>
      <div className="pennant paper-card px-7 py-2">
        <span className="whitespace-nowrap font-display text-[0.98rem] italic tracking-wide text-cocoa sm:text-[1.1rem]">
          {text}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Capa de nubes lejanas ─────────────────────────────── */

function CloudLayer({ on }: { on: boolean }) {
  const clouds = [
    { v: 1 as const, cls: 'left-[-12%] top-[8%] w-[46%] max-w-[300px]', from: -50, delay: 0, drift: 'drift-a', op: 0.85 },
    { v: 0 as const, cls: 'right-[-14%] top-[4%] w-[52%] max-w-[340px]', from: 50, delay: 0.3, drift: 'drift-b', op: 0.8 },
    { v: 2 as const, cls: 'left-[-20%] top-[38%] w-[58%] max-w-[380px]', from: -60, delay: 0.5, drift: 'drift-b', op: 0.7 },
    { v: 1 as const, cls: 'right-[-18%] top-[34%] w-[44%] max-w-[300px]', from: 60, delay: 0.2, drift: 'drift-a', op: 0.75 },
    { v: 0 as const, cls: 'left-[30%] top-[58%] w-[40%] max-w-[260px]', from: 30, delay: 0.8, drift: 'drift-a', op: 0.55 },
  ];
  return (
    <>
      {clouds.map((c, i) => (
        <motion.div
          key={i}
          className={`absolute ${c.cls}`}
          initial={{ x: `${c.from}%`, opacity: 0 }}
          animate={on ? { x: 0, opacity: c.op } : {}}
          transition={{ duration: 5, ease: EASE, delay: c.delay }}
        >
          <Cloud variant={c.v} className={`${c.drift} w-full`} />
        </motion.div>
      ))}
    </>
  );
}

/* ─────────────────────────────── Tarjeta con cinta ─────────────────────────────── */

const H_STRAIGHT = 'M0 4 C 60 4, 140 4, 200 4 L 200 26 C 140 26, 60 26, 0 26 Z';
const H_SLACK = 'M0 5 C 60 2, 140 7, 200 4 L 200 26 C 140 29, 60 24, 0 27 Z';
const H_WAVE = 'M0 12 C 60 -6, 140 18, 200 4 L 200 26 C 140 40, 60 16, 0 34 Z';

const LOOP_L_GONE = 'M100 70 C 99 67, 95 65, 93 68 C 91 71, 95 74, 100 73 Z';
const LOOP_LI_GONE = 'M100 71 C 99 69, 96 68, 95 70 C 95 72, 97 73, 100 73 Z';
const LOOP_R_GONE = 'M100 70 C 101 67, 105 65, 107 68 C 109 71, 105 74, 100 73 Z';
const LOOP_RI_GONE = 'M100 71 C 101 69, 104 68, 105 70 C 105 72, 103 73, 100 73 Z';
const KNOT = 'M96 60 L 104 60 C 109 60, 112 63, 112 68 L 112 75 C 112 80, 109 83, 104 83 L 96 83 C 91 83, 88 80, 88 75 L 88 68 C 88 63, 91 60, 96 60 Z';
const KNOT_LOOSE = 'M98 62 L 102 62 C 106 62, 108 64, 108 68 L 108 74 C 108 78, 106 80, 102 80 L 98 80 C 94 80, 92 78, 92 74 L 92 68 C 92 64, 94 62, 98 62 Z';
const TAIL_L_LONG = 'M96 74 C 86 106, 66 142, 40 182 L 52 175 L 58 190 C 80 150, 98 106, 106 76 Z';
const TAIL_R_LONG = 'M104 74 C 114 106, 136 140, 160 178 L 148 173 L 144 188 C 122 148, 102 106, 94 76 Z';

function CardFace() {
  return (
    <div className="paper-card absolute inset-0">
      <div className="absolute inset-[10px] border border-gold/60" />
      <div className="absolute inset-[15px] border border-gold/30" />
      <Sprig className="absolute left-[18px] top-[18px] w-[30%] opacity-90" />
      <Sprig flip className="absolute right-[18px] top-[18px] w-[30%] opacity-90" />
      <Sprig className="absolute bottom-[18px] left-[18px] w-[30%] -scale-y-100 opacity-90" />
      <Sprig flip className="absolute bottom-[18px] right-[18px] w-[30%] -scale-y-100 opacity-90" />
      <Sparkle className="absolute left-1/2 top-[22%] w-4 -translate-x-1/2" />
      <Sparkle className="absolute bottom-[22%] left-1/2 w-3 -translate-x-1/2" />
    </div>
  );
}

function Gatefold({ stage }: { stage: Stage }) {
  const opening = stage >= 3;
  const released = stage >= 2;
  const untied = stage >= 1;


  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      aria-hidden
    >
      <motion.p
        className="mb-6 text-center font-display text-[1.6rem] italic leading-none text-cocoa"
        initial={{ opacity: 0 }}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: opening ? 0.6 : 1.4, delay: opening ? 0 : 0.3 }}
      >
        {invitation.meta.hosts}
      </motion.p>
      <motion.div
        className="gatefold relative"
        initial={{ opacity: 0, scale: 0.965, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        {/* sombra de la tarjeta, se desvanece al abrir */}
        <motion.div
          className="absolute inset-0 rounded-[2px] shadow-card"
          animate={{ opacity: opening ? 0 : 1 }}
          transition={{ duration: 0.8 }}
        />
        {/* Puerta izquierda */}
        <motion.div
          className="door absolute inset-y-0 left-0 w-1/2 overflow-hidden"
          style={{ transformOrigin: 'left center' }}
          animate={opening ? { rotateY: -104, opacity: 0 } : { rotateY: 0, opacity: 1 }}
          transition={{ rotateY: { duration: 1.5, ease: SOFT }, opacity: { duration: 0.6, delay: 0.95 } }}
        >
          <div className="absolute inset-y-0 left-0 w-[200%]">
            <CardFace />
          </div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-l from-cocoa/25 to-transparent"
            animate={{ opacity: opening ? 1 : 0 }}
            transition={{ duration: 1 }}
          />
        </motion.div>
        {/* Puerta derecha */}
        <motion.div
          className="door absolute inset-y-0 right-0 w-1/2 overflow-hidden"
          style={{ transformOrigin: 'right center' }}
          animate={opening ? { rotateY: 104, opacity: 0 } : { rotateY: 0, opacity: 1 }}
          transition={{ rotateY: { duration: 1.5, ease: SOFT }, opacity: { duration: 0.6, delay: 0.95 } }}
        >
          <div className="absolute inset-y-0 right-0 w-[200%]">
            <CardFace />
          </div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cocoa/25 to-transparent"
            animate={{ opacity: opening ? 1 : 0 }}
            transition={{ duration: 1 }}
          />
        </motion.div>
        {/* línea de pliegue */}
        <div className="absolute inset-y-[6px] left-1/2 w-px -translate-x-1/2 bg-cocoa/10" />

        {/* ── Cinta ── */}
        <div className="ribbon-shadow pointer-events-none absolute inset-0">
          {/* horizontal */}
          <motion.svg
            viewBox="0 0 200 30"
            preserveAspectRatio="none"
            className="absolute left-[-3%] top-[calc(50%-9px)] h-[18px] w-[53%] overflow-visible"
            initial={{ x: 0, opacity: 1 }}
            animate={released ? { x: '-75%', opacity: 0 } : { x: 0, opacity: 1 }}
            transition={{ x: { duration: 1.25, ease: SOFT }, opacity: { duration: 0.6, delay: 0.75 } }}
          >
            <motion.path
              fill="url(#satin-h)"
              initial={{ d: H_STRAIGHT }}
              animate={{ d: released ? H_WAVE : untied ? H_SLACK : H_STRAIGHT }}
              transition={{ duration: released ? 1.1 : 0.8, ease: SOFT }}
            />
          </motion.svg>
          <motion.svg
            viewBox="0 0 200 30"
            preserveAspectRatio="none"
            className="absolute right-[-3%] top-[calc(50%-9px)] h-[18px] w-[53%] overflow-visible"
            style={{ scaleX: -1, originX: 0.5 }}
            initial={{ x: 0, opacity: 1 }}
            animate={released ? { x: '75%', opacity: 0 } : { x: 0, opacity: 1 }}
            transition={{ x: { duration: 1.25, ease: SOFT, delay: 0.08 }, opacity: { duration: 0.6, delay: 0.83 } }}
          >
            <motion.path
              fill="url(#satin-h)"
              initial={{ d: H_STRAIGHT }}
              animate={{ d: released ? H_WAVE : untied ? H_SLACK : H_STRAIGHT }}
              transition={{ duration: released ? 1.1 : 0.8, ease: SOFT, delay: 0.05 }}
            />
          </motion.svg>
          {/* lazo */}
          <motion.div
            className="absolute left-1/2 top-1/2 w-[176px]"
            style={{ marginLeft: '-88px', marginTop: '-62px' }}
            initial={{ y: 0, opacity: 1, rotate: 0 }}
            animate={released ? { y: 46, opacity: 0, rotate: 4 } : { y: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: SOFT }}
          >
            <svg viewBox="0 0 200 200" className="w-full overflow-visible">
              <motion.path
                fill="url(#satin-diag)"
                initial={{ d: BOW.leftTail }}
                animate={{ d: untied ? TAIL_L_LONG : BOW.leftTail }}
                transition={{ duration: 0.9, ease: SOFT, delay: 0.15 }}
              />
              <motion.path
                fill="url(#satin-diag)"
                initial={{ d: BOW.rightTail }}
                animate={{ d: untied ? TAIL_R_LONG : BOW.rightTail }}
                transition={{ duration: 0.9, ease: SOFT, delay: 0.35 }}
              />
              <motion.path
                fill="url(#satin-diag)"
                initial={{ d: BOW.leftLoop }}
                animate={{ d: untied ? LOOP_L_GONE : BOW.leftLoop }}
                transition={{ duration: 0.8, ease: SOFT }}
              />
              <motion.path
                fill="#3f2f27"
                opacity={0.45}
                initial={{ d: BOW.leftLoopInner }}
                animate={{ d: untied ? LOOP_LI_GONE : BOW.leftLoopInner }}
                transition={{ duration: 0.75, ease: SOFT }}
              />
              <motion.path
                fill="url(#satin-diag)"
                initial={{ d: BOW.rightLoop }}
                animate={{ d: untied ? LOOP_R_GONE : BOW.rightLoop }}
                transition={{ duration: 0.8, ease: SOFT, delay: 0.25 }}
              />
              <motion.path
                fill="#3f2f27"
                opacity={0.45}
                initial={{ d: BOW.rightLoopInner }}
                animate={{ d: untied ? LOOP_RI_GONE : BOW.rightLoopInner }}
                transition={{ duration: 0.75, ease: SOFT, delay: 0.25 }}
              />
              <motion.path
                fill="url(#satin-v)"
                initial={{ d: KNOT }}
                animate={{ d: untied ? KNOT_LOOSE : KNOT }}
                transition={{ duration: 0.7, ease: SOFT, delay: 0.5 }}
              />
              <path d="M92 64 C 98 61, 104 61, 108 64" stroke="#b39687" strokeWidth="1.2" fill="none" opacity="0.6" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
      <motion.p
        className="label mt-7 text-center leading-none text-cafe"
        initial={{ opacity: 0 }}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: opening ? 0.6 : 1.4, delay: opening ? 0 : 0.5 }}
      >
        {invitation.opening.cardKicker}
      </motion.p>
    </motion.div>
  );
}
