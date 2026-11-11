import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { invitation } from '../content/invitation';
import { Balloon } from './illustrations/Balloon';
import { Sparkle } from './illustrations/Sky';
import { Envelope, LetterSheet, type EnvelopeState } from '../opening/Envelope';
import { paintCloud, paintSky } from '../opening/paint';
import { useMusic } from '../hooks/useMusic';

/**
 * APERTURA — “El globo y la carta sellada”
 *
 *  Escena 1 · La llegada     Un globo monumental desciende entre nubes en capas.
 *                            De la canasta cuelga un sobre antiguo.
 *  Escena 2 · El sobre       La cámara se acerca al sobre hasta que es protagonista.
 *  Escena 3 · Interacción    Se detiene y espera el toque en el sello de lacre:
 *                            el sello se rompe, la solapa se abre, sale la carta,
 *                            empieza la música.
 *  Escena 4 · La carta       La carta se despliega a pantalla completa y comienza
 *                            la historia.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const SOFT = [0.45, 0, 0.2, 1] as const;

type Phase = 'arrive' | 'approach' | 'await' | 'open' | 'letter' | 'done';
type Rect = { top: number; left: number; width: number; height: number };

const T_ARRIVE = 4700; // ms hasta que empieza el acercamiento
const T_APPROACH = 2600; // duración del acercamiento

export function Opening({ onComplete }: { onComplete: () => void }) {
  const reduce = useReducedMotion() ?? false;
  const music = useMusic();
  const o = invitation.opening;

  const [phase, setPhase] = useState<Phase>(reduce ? 'await' : 'arrive');
  const [env, setEnv] = useState<EnvelopeState>('closed');
  const [letterFrom, setLetterFrom] = useState<Rect | null>(null);
  const [textStage, setTextStage] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const miniRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const world = useAnimationControls();

  // Pinturas (cielo y nubes) generadas una vez
  const art = useMemo(() => {
    const w = Math.min(1100, Math.round(window.innerWidth * Math.min(2, window.devicePixelRatio || 1)));
    const h = Math.round((w * window.innerHeight) / window.innerWidth);
    return {
      sky: invitation.illustrations.openingSky ?? paintSky(w, h),
      clouds: [paintCloud(900, 420, 3), paintCloud(900, 420, 11), paintCloud(1000, 440, 29), paintCloud(820, 400, 41)],
    };
  }, []);

  /* ── Escena 1 → 2: llegada y acercamiento ── */
  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setPhase('approach'), T_ARRIVE);
    return () => clearTimeout(t);
  }, [reduce]);

  useLayoutEffect(() => {
    if (phase !== 'approach') return;
    const sec = sectionRef.current?.getBoundingClientRect();
    const a = miniRef.current?.getBoundingClientRect();
    const b = closeRef.current?.getBoundingClientRect();
    if (!sec || !a || !b || a.width === 0) {
      setPhase('await');
      return;
    }
    // transforma el “mundo” para que el sobre pequeño termine exactamente donde está el grande
    const s = b.width / a.width;
    const ax = a.left - sec.left, ay = a.top - sec.top;
    const bx = b.left - sec.left, by = b.top - sec.top;
    void world
      .start({ x: bx - s * ax, y: by - s * ay, scale: s }, { duration: T_APPROACH / 1000, ease: [0.6, 0, 0.2, 1] })
      .then(() => setPhase('await'));
  }, [phase, world]);

  /* ── Escena 3: el toque en el sello ── */
  const onSeal = useCallback(() => {
    if (phase !== 'await') return;
    music.tryAutoplay(); // dentro del gesto: iOS permite el audio
    setPhase('open');
    setEnv('breaking');
    const q = reduce ? 0.35 : 1;
    window.setTimeout(() => setEnv('opening'), 520 * q);
    window.setTimeout(() => setEnv('rising'), 1400 * q);
    window.setTimeout(() => {
      const sec = sectionRef.current?.getBoundingClientRect();
      const l = letterRef.current?.getBoundingClientRect();
      setLetterFrom(
        sec && l
          ? { top: l.top - sec.top, left: l.left - sec.left, width: l.width, height: l.height }
          : { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight },
      );
      setPhase('letter');
    }, 2650 * q);
  }, [phase, music, reduce]);

  /* ── Escena 4: textos de la carta ── */
  useEffect(() => {
    if (phase !== 'letter') return;
    const ids = [
      window.setTimeout(() => setTextStage(1), reduce ? 200 : 1500),
      window.setTimeout(() => setTextStage(2), reduce ? 400 : 3100),
      window.setTimeout(() => setTextStage(3), reduce ? 600 : 4300),
    ];
    return () => ids.forEach(clearTimeout);
  }, [phase, reduce]);

  useEffect(() => {
    if (textStage === 3) {
      setPhase('done');
      onComplete();
    }
  }, [textStage, onComplete]);

  // El desplazamiento queda bloqueado hasta que la carta termina de presentarse
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('is-locked', phase !== 'done');
    return () => root.classList.remove('is-locked');
  }, [phase]);

  const showClose = phase === 'await' || phase === 'open' || phase === 'letter';
  const letterOn = phase === 'letter' || phase === 'done';

  return (
    <section ref={sectionRef} aria-label="Apertura" className="opening relative h-[100dvh] min-h-[560px] w-full overflow-hidden bg-[#efe6d6]">
      {/* ═════════ Escena 1: el mundo (cielo, nubes, globo) ═════════ */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ transformOrigin: '0 0' }}
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={world}
        aria-hidden
      >
        <img src={art.sky} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />

        {/* nubes lejanas */}
        <CloudImg src={art.clouds[0]} cls="left-[-30%] top-[6%] w-[80%]" drift="drift-a" op={0.75} delay={0} />
        <CloudImg src={art.clouds[1]} cls="right-[-34%] top-[22%] w-[86%]" drift="drift-b" op={0.7} delay={0.3} />

        {/* globo monumental con el sobre colgando */}
        <motion.div
          className="balloon-monument absolute left-1/2 top-[-5%] flex flex-col items-center"
          initial={reduce ? false : { y: '-105%' }}
          animate={{ y: '0%' }}
          transition={{ duration: 4.6, ease: [0.16, 0.8, 0.3, 1] }}
        >
          <div className="balloon-sway flex w-full flex-col items-center">
            <Balloon className="w-full" />
            {/* cuerda */}
            <svg viewBox="0 0 10 100" className="-mt-[2.2%] h-[9%] min-h-[30px] w-[4px] overflow-visible" preserveAspectRatio="none" aria-hidden>
              <path d="M5 0 C 4 30, 6 60, 5 100" stroke="#6B5143" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" />
            </svg>
            <div ref={miniRef} className="envelope-swing -mt-[2px] w-[21%]">
              <Envelope id="mini" />
            </div>
          </div>
        </motion.div>

        {/* nubes medias, por delante del globo */}
        <CloudImg src={art.clouds[2]} cls="left-[-38%] top-[48%] w-[96%]" drift="drift-b" op={0.92} delay={0.5} />
        <CloudImg src={art.clouds[3]} cls="right-[-40%] top-[60%] w-[90%]" drift="drift-a" op={0.88} delay={0.8} />

        {/* destellos */}
        {[
          'left-[12%] top-[16%] w-3',
          'right-[14%] top-[10%] w-4',
          'left-[20%] top-[40%] w-2.5',
          'right-[10%] top-[46%] w-3',
        ].map((c, i) => (
          <Sparkle key={i} className={`twinkle ${['', 'twinkle-d1', 'twinkle-d2', 'twinkle-d3'][i]} absolute ${c}`} />
        ))}
      </motion.div>

      {/* nubes de primer plano: al acercarnos, la cámara las atraviesa */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={false}
        animate={phase === 'arrive' ? { scale: 1, opacity: 1 } : { scale: 2.4, opacity: 0 }}
        transition={{ duration: T_APPROACH / 1000, ease: [0.6, 0, 0.2, 1] }}
        aria-hidden
      >
        <CloudImg src={art.clouds[0]} cls="left-[-46%] bottom-[-6%] w-[118%]" drift="drift-slow" op={1} delay={0.2} from={-40} />
        <CloudImg src={art.clouds[2]} cls="right-[-50%] bottom-[4%] w-[110%]" drift="drift-slow-rev" op={0.95} delay={0.6} from={40} />
      </motion.div>

      {/* luz y bruma que separan el sobre del fondo (llega durante el acercamiento) */}
      <motion.div
        className="envelope-mist pointer-events-none absolute inset-0"
        initial={false}
        animate={{ opacity: phase === 'arrive' ? 0 : 1 }}
        transition={{ duration: 1.5, delay: phase === 'approach' ? 1.2 : 0 }}
        aria-hidden
      />

      {/* ═════════ Escenas 2–3: el sobre como protagonista ═════════ */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        initial={false}
        animate={{ opacity: showClose ? 1 : 0 }}
        transition={{ duration: showClose ? 0.25 : 0.6 }}
        style={{ pointerEvents: showClose ? 'auto' : 'none' }}
      >
        <motion.p
          className="relative mb-[7dvh] text-center font-display text-[1.85rem] font-light italic leading-snug text-cocoa sm:text-[2.3rem]"
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          animate={phase === 'await' || phase === 'open' ? { opacity: phase === 'open' ? 0 : 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.4, ease: EASE, delay: phase === 'await' ? 0.4 : 0 }}
        >
          {o.envelopeLine}
        </motion.p>

        <div ref={closeRef} className="envelope-close relative">
          <motion.div
            initial={false}
            animate={phase === 'letter' ? { y: 60, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: SOFT }}
          >
            <Envelope
              id="main"
              state={env}
              onSeal={onSeal}
              sealPulse={phase === 'await'}
              sealLabel={o.sealLabel}
              letterRef={letterRef}
            />
          </motion.div>
        </div>

        <motion.span
          className="label relative mt-[6dvh] text-cafe"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'await' ? 1 : 0 }}
          transition={{ duration: 1.2, delay: phase === 'await' ? 1.3 : 0 }}
        >
          {o.tapHint}
        </motion.span>
      </motion.div>

      {/* ═════════ Escena 4: la carta se despliega ═════════ */}
      <AnimatePresence>
        {letterOn && letterFrom && (
          <motion.div
            className="absolute z-30"
            initial={{ ...letterFrom, rotate: -1.5 }}
            animate={{ top: 0, left: 0, width: '100%', height: '100%', rotate: 0 }}
            transition={{ duration: reduce ? 0.3 : 1.35, ease: [0.65, 0, 0.25, 1] }}
          >
            <LetterSheet className="letter-full">
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.35 }}
                transition={{ duration: 1.6, delay: 0.6 }}
                aria-hidden
              >
                <span className="letter-crease absolute inset-x-0 top-1/3" />
                <span className="letter-crease absolute inset-x-0 top-2/3" />
              </motion.div>
              <motion.div
                className="absolute inset-[14px] border border-gold/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 1.1 }}
                aria-hidden
              />
              <motion.div
                className="absolute inset-[19px] border border-gold/25"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 1.25 }}
                aria-hidden
              />
              <div className="relative flex h-full flex-col items-center justify-center px-10 text-center">
                <motion.div
                  className="mb-8 w-[22%] max-w-[110px]"
                  initial={{ opacity: 0, y: 24 }}
                  animate={textStage >= 1 ? { opacity: 0.9, y: 0 } : {}}
                  transition={{ duration: 2, ease: EASE }}
                >
                  <div className="bob-slow">
                    <Balloon className="w-full" />
                  </div>
                </motion.div>
                <Words text={o.letterLine1} show={textStage >= 1} className="max-w-[20rem] font-display text-[2.05rem] font-light italic leading-[1.22] text-cocoa sm:text-[2.6rem]" />
                <motion.span
                  className="my-7 block h-px w-16 bg-gold/70"
                  initial={{ scaleX: 0 }}
                  animate={textStage >= 2 ? { scaleX: 1 } : {}}
                  transition={{ duration: 1, ease: EASE }}
                  aria-hidden
                />
                <Words text={o.letterLine2} show={textStage >= 2} className="max-w-[18rem] font-serif text-[1.02rem] font-light leading-relaxed text-cafe sm:text-[1.12rem]" />
              </div>
              <motion.div
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: textStage >= 2 ? 0.85 : 0 }}
                transition={{ duration: 2 }}
                aria-hidden
              >
                <Sparkle className="twinkle absolute left-[16%] top-[14%] w-3" />
                <Sparkle className="twinkle twinkle-d2 absolute right-[14%] top-[22%] w-2.5" />
              </motion.div>
              <motion.div
                className="absolute inset-x-0 bottom-[5dvh] flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: textStage >= 3 ? 1 : 0 }}
                transition={{ duration: 1.2 }}
              >
                <span className="label text-cafe/80">{o.scrollHint}</span>
                <span className="scroll-line" aria-hidden />
              </motion.div>
            </LetterSheet>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─────────────────────────── piezas ─────────────────────────── */

function CloudImg({ src, cls, drift, op, delay, from = 0 }: { src: string; cls: string; drift: string; op: number; delay: number; from?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`absolute ${cls}`}
      initial={reduce ? false : { opacity: 0, x: `${from}%`, y: 18 }}
      animate={{ opacity: op, x: '0%', y: 0 }}
      transition={{ duration: 3.4, ease: EASE, delay }}
    >
      <img src={src} alt="" className={`${drift} block w-full`} draggable={false} />
    </motion.div>
  );
}

/** Revela un texto palabra por palabra. */
export function Words({ text, show, className }: { text: string; show: boolean; className?: string }) {
  const words = text.split(' ');
  return (
    <p className={className} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
          animate={show ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1, ease: EASE, delay: i * 0.08 }}
        >
          {w + (i < words.length - 1 ? ' ' : '')}
        </motion.span>
      ))}
    </p>
  );
}
