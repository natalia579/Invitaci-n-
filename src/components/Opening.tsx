import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { invitation } from '../content/invitation';
import { Balloon } from './illustrations/Balloon';
import { Cloud, Sparkle, Star } from './illustrations/Sky';
import { useMusic } from '../hooks/useMusic';

/**
 * APERTURA “ONCE UPON A LITTLE DREAM”
 *
 *  Acto 1 (WebGL, ~7 s): libro 3D sobre lino → la cinta de raso se desata y se
 *  desliza → la tapa gira → pasan dos hojas → la cámara entra en la página.
 *  Acto 2 (HTML/SVG, ~4 s): la acuarela de la página cobra vida: nubes en tres
 *  profundidades, estrellas, el globo asciende, la banderola se despliega y
 *  aparecen los textos.
 *  Si el dispositivo no tiene WebGL o pide “reducir movimiento”, se pasa
 *  directamente al Acto 2 (o a su estado final).
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const SOFT = [0.45, 0, 0.2, 1] as const;

type Phase = 'loading' | 'book' | 'story' | 'done';

export function Opening({ onComplete }: { onComplete: () => void }) {
  const reduce = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>(reduce ? 'done' : 'loading');
  const [canvasOn, setCanvasOn] = useState(!reduce);
  const [canvasFading, setCanvasFading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const music = useMusic();
  const o = invitation.opening;

  // ── Acto 1: escena 3D ──
  useEffect(() => {
    if (reduce) return;
    let scene: import('../three/BookScene').BookScene | null = null;
    let cancelled = false;
    let gaveUp = false;
    const toStory = () => {
      if (cancelled) return;
      gaveUp = true;
      setPhase('story');
      setCanvasOn(false);
    };
    const fallback = window.setTimeout(toStory, 6000); // si la escena tarda demasiado en cargar
    (async () => {
      try {
        const mod = await import('../three/BookScene');
        if (cancelled || !canvasRef.current || !mod.webglAvailable()) return toStory();
        scene = new mod.BookScene({
          canvas: canvasRef.current,
          title: o.bookTitle,
          kicker: o.bookKicker,
          pageTitle: o.titlePage,
          pageSub: o.titlePageSub,
          onHandoff: () => {
            setPhase('story');
            setCanvasFading(true);
            music.tryAutoplay();
          },
          onEnd: () => {
            scene?.dispose();
            setCanvasOn(false);
          },
        });
        await scene.init();
        if (cancelled || gaveUp) {
          scene.dispose();
          return;
        }
        clearTimeout(fallback);
        setPhase('book');
        // deja que el primer cuadro se asiente antes de empezar
        window.setTimeout(() => scene?.start(), 450);
      } catch (e) {
        console.warn('Escena 3D no disponible', e);
        toStory();
      }
    })();
    return () => {
      cancelled = true;
      clearTimeout(fallback);
      scene?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  // bloqueo de scroll mientras dura la apertura
  const [textStage, setTextStage] = useState(reduce ? 3 : 0);
  useEffect(() => {
    if (phase !== 'story') return;
    const ids = [
      window.setTimeout(() => setTextStage(1), 2100),
      window.setTimeout(() => setTextStage(2), 3400),
      window.setTimeout(() => setTextStage(3), 4500),
    ];
    return () => ids.forEach(clearTimeout);
  }, [phase]);
  useEffect(() => {
    const root = document.documentElement;
    const locked = !reduce && textStage < 2;
    root.classList.toggle('is-locked', locked);
    if (textStage >= 3) {
      setPhase('done');
      onComplete();
    }
    return () => root.classList.remove('is-locked');
  }, [textStage, reduce, onComplete]);
  useEffect(() => {
    if (reduce) {
      onComplete();
      music.tryAutoplay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const live = phase === 'story' || phase === 'done';

  // ── Escena 6: al deslizar, entramos al cuento (las nubes se abren, el globo sube) ──
  const { scrollY } = useScroll();
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const balloonY = useTransform(scrollY, [0, vh], [0, reduce ? 0 : -vh * 0.42]);
  const balloonS = useTransform(scrollY, [0, vh], [1, reduce ? 1 : 1.12]);
  const openL = useTransform(scrollY, [0, vh], ['0%', reduce ? '0%' : '-38%']);
  const openR = useTransform(scrollY, [0, vh], ['0%', reduce ? '0%' : '38%']);
  const farY = useTransform(scrollY, [0, vh], [0, reduce ? 0 : -vh * 0.12]);
  const textY = useTransform(scrollY, [0, vh], [0, reduce ? 0 : -vh * 0.25]);
  const fade = useTransform(scrollY, [0, vh * 0.55], [1, 0]);

  return (
    <section aria-label="Apertura" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
      {/* Página de acuarela (continúa la última página del libro) */}
      <div aria-hidden className="sky-wash absolute inset-0" />
      <div aria-hidden className="page-light absolute inset-0" />

      {/* Nubes lejanas */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ y: farY }}>
        {FAR.map((c, i) => (
          <motion.div
            key={i}
            className={`absolute ${c.cls}`}
            initial={{ opacity: 0, y: 26, scale: 0.94 }}
            animate={live ? { opacity: c.op, y: 0, scale: 1 } : {}}
            transition={{ duration: 3.2, ease: EASE, delay: c.d }}
          >
            <Cloud variant={c.v} className={`${c.drift} w-full`} />
          </motion.div>
        ))}
      </motion.div>

      {/* Estrellas que se “dibujan” */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STARS.map((s, i) => (
          <motion.div
            key={i}
            className={`absolute ${s.cls}`}
            initial={{ opacity: 0, scale: 0, rotate: -60 }}
            animate={live ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 1.4, ease: EASE, delay: 0.9 + i * 0.16 }}
          >
            {s.star ? <Star className={`twinkle ${s.tw} w-full`} /> : <Sparkle className={`twinkle ${s.tw} w-full`} />}
          </motion.div>
        ))}
      </div>

      {/* Globo + banderola */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center pb-[8svh]">
        <motion.div style={{ y: balloonY, scale: balloonS }} className="flex flex-col items-center">
          <motion.div
            initial={reduce ? false : { y: '75svh', rotate: -5 }}
            animate={live ? { y: 0, rotate: 0 } : {}}
            transition={{ y: { duration: 3.0, ease: EASE, delay: 0.15 }, rotate: { duration: 4, ease: SOFT, delay: 0.15 } }}
          >
            <div className="bob flex flex-col items-center">
              <Balloon className="balloon-hero drop-shadow-balloon h-auto" />
              <Pennant text={o.banner} show={live} reduce={reduce} />
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="mt-[3svh] max-w-[23rem] px-8 text-center" style={{ y: textY, opacity: fade }}>
          <WordReveal
            text={o.line1}
            show={textStage >= 1}
            className="font-display text-[1.7rem] font-light italic leading-[1.25] text-cocoa sm:text-[2.1rem]"
          />
          <WordReveal
            text={o.line2}
            show={textStage >= 2}
            className="mt-4 font-serif text-[0.98rem] font-light leading-relaxed text-cafe sm:text-[1.08rem]"
          />
        </motion.div>
      </div>

      {/* Nubes cercanas: se abren como un telón al deslizar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
        <motion.div className="absolute -left-[22%] bottom-[-4%] w-[70%] max-w-[480px]" style={{ x: openL }}>
          <motion.div
            initial={{ x: '-45%', opacity: 0 }}
            animate={live ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 3.6, ease: EASE, delay: 0.25 }}
          >
            <Cloud variant={2} className="drift-slow w-full" />
          </motion.div>
        </motion.div>
        <motion.div className="absolute -right-[20%] bottom-[6%] w-[60%] max-w-[420px]" style={{ x: openR }}>
          <motion.div
            initial={{ x: '45%', opacity: 0 }}
            animate={live ? { x: 0, opacity: 0.95 } : {}}
            transition={{ duration: 3.9, ease: EASE, delay: 0.45 }}
          >
            <Cloud variant={0} className="drift-slow-rev w-full" />
          </motion.div>
        </motion.div>
      </div>

      {/* Indicación para deslizar */}
      <motion.div className="absolute inset-x-0 bottom-[3svh] z-30 flex justify-center" style={{ opacity: fade }}>
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: textStage >= 3 ? 1 : 0 }}
          transition={{ duration: 1.4 }}
        >
          <span className="label text-cafe/80">{o.scrollHint}</span>
          <span className="scroll-line" aria-hidden />
        </motion.div>
      </motion.div>

      {/* Acto 1: el libro (canvas WebGL a pantalla completa) */}
      <AnimatePresence>
        {canvasOn && (
          <motion.div
            className="fixed inset-0 z-[70] bg-[#efe9de]"
            initial={{ opacity: 1 }}
            animate={{ opacity: canvasFading ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: canvasFading ? 0.9 : 0.5, ease: SOFT }}
            aria-hidden
          >
            <canvas ref={canvasRef} className="h-full w-full" />
            <AnimatePresence>
              {phase === 'loading' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Sparkle className="twinkle w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─────────────────────────── piezas ─────────────────────────── */

const FAR = [
  { v: 1 as const, cls: '-left-[14%] top-[6%] w-[50%] max-w-[320px]', d: 0.0, drift: 'drift-a', op: 0.9 },
  { v: 0 as const, cls: '-right-[16%] top-[3%] w-[56%] max-w-[360px]', d: 0.2, drift: 'drift-b', op: 0.85 },
  { v: 2 as const, cls: '-left-[24%] top-[36%] w-[60%] max-w-[400px]', d: 0.35, drift: 'drift-b', op: 0.7 },
  { v: 1 as const, cls: '-right-[20%] top-[30%] w-[48%] max-w-[320px]', d: 0.1, drift: 'drift-a', op: 0.75 },
];

const STARS = [
  { cls: 'left-[14%] top-[13%] w-3', tw: '', star: false },
  { cls: 'right-[19%] top-[19%] w-4', tw: 'twinkle-d1', star: true },
  { cls: 'left-[26%] top-[30%] w-2.5', tw: 'twinkle-d2', star: false },
  { cls: 'right-[11%] top-[42%] w-3', tw: 'twinkle-d3', star: false },
  { cls: 'left-[9%] top-[50%] w-3', tw: 'twinkle-d1', star: true },
  { cls: 'right-[28%] top-[9%] w-2', tw: 'twinkle-d2', star: false },
];

/** Banderola de papel que se despliega desde el centro. */
function Pennant({ text, show, reduce }: { text: string; show: boolean; reduce: boolean }) {
  return (
    <div className="pennant-swing -mt-[2px] flex flex-col items-center">
      <svg viewBox="0 0 140 26" className="h-[22px] w-[124px]" aria-hidden>
        <motion.path
          d="M52 0 L 14 26 M88 0 L 126 26"
          stroke="#6B5143"
          strokeWidth="0.8"
          fill="none"
          opacity={0.7}
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={show ? { pathLength: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.3 }}
        />
      </svg>
      <motion.div
        className="pennant px-8 py-[9px]"
        initial={reduce ? false : { clipPath: 'inset(0 50% 0 50%)' }}
        animate={show ? { clipPath: 'inset(0 0% 0 0%)' } : {}}
        transition={{ duration: 1.2, ease: EASE, delay: 1.6 }}
      >
        <span className="whitespace-nowrap font-display text-[1.06rem] italic tracking-wide text-cocoa sm:text-[1.2rem]">{text}</span>
      </motion.div>
    </div>
  );
}

/** Revela un texto palabra por palabra, con un leve desenfoque que se aclara. */
export function WordReveal({ text, show, className }: { text: string; show: boolean; className?: string }) {
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
          transition={{ duration: 0.9, ease: EASE, delay: i * 0.07 }}
        >
          {w + (i < words.length - 1 ? ' ' : '')}
        </motion.span>
      ))}
    </p>
  );
}
