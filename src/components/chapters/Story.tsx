import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { invitation } from '../../content/invitation';
import { Balloon } from '../illustrations/Balloon';
import { Cloud, Ornament, Sparkle, Sprig, Star } from '../illustrations/Sky';
import { Boat, GiftBox, Pearls, PlateFrame } from '../illustrations/Objects';
import { Corners, Halo } from '../illustrations/Landscape';
import { Body, Chapter, EASE, PageReveal, Pending, Reveal, SectionTitle } from '../ui';
import { useCountdown } from '../../hooks/useCountdown';
import { downloadIcs } from '../../lib/calendar';

/** Progreso de scroll de una sección (0 al entrar por abajo → 1 al salir por arriba). */
function useSectionScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  return { ref, p: scrollYProgress };
}

function useRange(p: ReturnType<typeof useSectionScroll>['p'], from: number, to: number) {
  const reduce = useReducedMotion();
  return useTransform(p, [0, 1], reduce ? [0, 0] : [from, to]);
}

/* ═════════════════════════════ Fecha y cuenta regresiva ═════════════════════════════ */
export function DateSection() {
  const c = invitation.date;
  const left = useCountdown(c.isoDateTime);
  const { ref, p } = useSectionScroll();
  const balloonY = useRange(p, 120, -160);
  const cells: [number, string][] = [
    [left.days, c.countdownLabels.days],
    [left.hours, c.countdownLabels.hours],
    [left.minutes, c.countdownLabels.minutes],
    [left.seconds, c.countdownLabels.seconds],
  ];
  return (
    <div ref={ref} className="relative">
      <Chapter
        id="fecha"
        className="sky-tint"
        decor={
          <>
            <motion.div style={{ y: balloonY }} className="absolute right-[5%] top-[13%] w-[20%] max-w-[110px]">
              <div className="bob-slow">
                <Balloon className="w-full" />
              </div>
            </motion.div>
            <Cloud variant={1} className="drift-a absolute -left-[18%] top-[20%] w-[46%] max-w-[280px] opacity-70" />
          </>
        }
      >
        <PageReveal delay={0.1} className="w-full">
          <div className="flex items-stretch gap-4">
            <span className="label flex items-center text-[0.72rem] text-cafe [writing-mode:vertical-rl] rotate-180">{c.weekday}</span>
            <div className="flex-1">
              <time dateTime={c.isoDateTime} className="block font-display text-[9.5rem] font-light leading-[0.82] text-cocoa sm:text-[11rem]">
                {c.day}
              </time>
              <div className="mt-4 flex items-baseline gap-4">
                <span className="label whitespace-nowrap text-[0.72rem] text-cafe">{c.monthYear}</span>
                <span className="h-px flex-1 bg-gold/60" />
                <span className="whitespace-nowrap font-display text-[1.6rem] italic text-cocoa">{c.time}</span>
              </div>
            </div>
          </div>
        </PageReveal>

        <Reveal delay={0.2} className="mt-14 w-full">
          {left.done ? (
            <p className="text-center font-display text-2xl italic text-cocoa">{c.countdownDone}</p>
          ) : (
            <div className="paper-card relative mx-auto w-full px-3 pb-7 pt-9">
              <Corners size={30} />
              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-[#f4f0e7] px-4 font-display text-lg italic text-cafe">
                {c.countdownTitle}
              </span>
              <div className="grid grid-cols-4" role="timer" aria-live="off">
                {cells.map(([n, label], i) => (
                  <div key={label} className={`flex flex-col items-center ${i > 0 ? 'border-l border-gold/30' : ''}`}>
                    <span className="font-display text-[2.5rem] font-light tabular-nums lining-nums leading-none text-cocoa">
                      {String(n).padStart(2, '0')}
                    </span>
                    <span className="mt-2 font-sans text-[0.55rem] uppercase tracking-[0.2em] text-cafe/80">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Reveal>

        <Reveal delay={0.3} className="mt-8">
          <button type="button" onClick={downloadIcs} className="btn-ghost">
            <CalendarIcon />
            {c.addToCalendar}
          </button>
        </Reveal>
      </Chapter>
    </div>
  );
}

/* ═════════════════════════════ Ubicación (aprobada) ═════════════════════════════ */
export function VenueSection() {
  const c = invitation.venue;
  const img = invitation.illustrations.venue;
  return (
    <Chapter
      id="lugar"
      decor={
        <>
          <Sprig className="absolute -left-2 bottom-[12%] w-28 -scale-y-100 opacity-70" />
          <Cloud variant={2} className="drift-b absolute -right-[26%] top-[6%] w-[60%] max-w-[380px] opacity-60" />
        </>
      }
    >
      <div className="w-full">
        <SectionTitle text={c.label} align="right" />
      </div>

      <PageReveal delay={0.1} className="relative mt-10 w-full max-w-[22rem]">
        <figure className="relative aspect-[300/380] w-full">
          <PlateFrame className="absolute inset-0 h-full w-full" />
          <div className="venue-arch absolute inset-[22px] overflow-hidden">
            {img ? (
              <motion.img
                src={img}
                alt={c.venueName ?? 'Ilustración del lugar'}
                className="h-full w-full object-cover"
                initial={{ scale: 1.12 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 3, ease: EASE }}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-cream/60 p-6 text-center font-display italic text-cafe">
                Ilustración del lugar <Pending />
              </div>
            )}
          </div>
          <Sparkle className="twinkle absolute -right-2 top-[18%] w-4" />
          <Star className="twinkle twinkle-d2 absolute -left-2 top-[46%] w-3.5" />
        </figure>
      </PageReveal>

      <Reveal delay={0.2} className="mt-9 text-center">
        <h3 className="font-display text-[2.4rem] font-light italic leading-tight text-cocoa">
          {c.venueName ?? <span className="text-cafe">{c.venueNameFallback}</span>}
          {!c.venueName && <Pending />}
        </h3>
        <Ornament className="mx-auto my-3 w-28" />
        <p className="mx-auto max-w-[17rem] font-serif text-[0.95rem] font-light leading-relaxed text-cafe">
          {c.address ?? c.addressFallback}
          {!c.address && <Pending />}
        </p>
      </Reveal>

      <Reveal delay={0.3} className="mt-8 flex flex-col items-center gap-2">
        {c.mapsUrl ? (
          <a href={c.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <PinIcon />
            {c.directionsButton}
          </a>
        ) : (
          <>
            <button type="button" className="btn-primary" disabled aria-disabled="true">
              <PinIcon />
              {c.directionsButton}
            </button>
            <Pending>Enlace de Google Maps pendiente</Pending>
          </>
        )}
      </Reveal>
    </Chapter>
  );
}

/* ═════════════════════════════ Dress Code ═════════════════════════════ */
export function DressCodeSection() {
  const c = invitation.dressCode;
  return (
    <Chapter
      id="dress-code"
      className="sky-tint"
      decor={
        <>
          <Sparkle className="twinkle absolute left-[10%] top-[18%] w-3" />
          <Sparkle className="twinkle twinkle-d2 absolute right-[12%] top-[30%] w-4" />
          <Star className="twinkle twinkle-d1 absolute right-[22%] bottom-[16%] w-3" />
        </>
      }
    >
      <PageReveal delay={0.1} className="w-full">
        <div className="paper-card relative px-7 pb-12 pt-16">
          <Corners size={34} />
          <Pearls className="absolute left-1/2 top-0 w-[72%] -translate-x-1/2 -translate-y-[10%] opacity-95" />
          <h2 className="relative mt-6 text-center font-display text-[2.1rem] font-light uppercase tracking-[0.2em] text-cocoa sm:text-[2.6rem]">
            {c.title}
          </h2>
          <Ornament className="relative mx-auto my-6 w-32" />
          <div className="relative space-y-9">
            {c.quotes.map((q, i) => (
              <Reveal key={q.who} delay={0.25 + i * 0.25} className={i === 0 ? 'pl-3 text-left' : 'pr-3 text-right'}>
                <span className="block font-serif text-[0.9rem] font-light text-cafe">{q.who}</span>
                <span className="relative inline-block">
                  <span aria-hidden className={`absolute -top-6 font-display text-[3.4rem] leading-none text-gold/50 ${i === 0 ? '-left-4' : '-right-4'}`}>
                    {i === 0 ? '“' : '”'}
                  </span>
                  <span
                    className={
                      q.emphasis
                        ? 'font-display text-[2.4rem] italic leading-tight text-cocoa'
                        : 'font-display text-[1.5rem] italic leading-snug text-cocoa'
                    }
                  >
                    {q.what}
                  </span>
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </PageReveal>
    </Chapter>
  );
}

/* ═════════════════════════════ Regalos ═════════════════════════════ */
export function GiftsSection() {
  const c = invitation.gifts;
  const { ref, p } = useSectionScroll();
  const boxY = useRange(p, 70, -50);
  return (
    <div ref={ref} className="relative">
      <Chapter
        id="regalos"
        decor={
          <>
            <Sprig className="absolute left-[-8px] top-[16%] w-24 opacity-70" />
            <Cloud variant={1} className="drift-a absolute -right-[20%] bottom-[8%] w-[50%] max-w-[300px] opacity-65" />
          </>
        }
      >
        <div className="relative w-full">
          <motion.div style={{ y: boxY }} className="relative ml-auto mr-[-6%] w-[72%] max-w-[300px]">
            <div className="absolute inset-[-14%]">
              <Halo className="h-full w-full" color="#A8B7C0" />
            </div>
            <Reveal y={30}>
              <div className="sway-soft relative">
                <GiftBox className="w-full" />
              </div>
            </Reveal>
          </motion.div>
        </div>
        <Reveal delay={0.15} as="h2" className="mt-6 self-start font-display text-[2.3rem] font-light italic leading-[1.1] text-cocoa sm:text-[2.7rem]">
          {c.title}
        </Reveal>
        <div className="mt-6 w-full space-y-5">
          <Reveal delay={0.2}>
            <Body>{c.paragraphs[0]}</Body>
          </Reveal>
          <Reveal delay={0.3} className="border-l border-gold/50 pl-5">
            <Body className="italic">{c.paragraphs[1]}</Body>
          </Reveal>
        </div>
      </Chapter>
    </div>
  );
}

/* ═════════════════════════════ Cierre ═════════════════════════════ */
export function ClosingSection({ onReplay }: { onReplay: () => void }) {
  const c = invitation.closing;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const rise = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [90, -70]);
  const sway = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-6, 3]);
  const cloudsY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, -40]);
  const nearY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [160, -60]);
  return (
    <div ref={ref} className="relative overflow-hidden">
      <Chapter
        id="cierre"
        className="sky-wash-end pb-20"
        decor={
          <>
            <motion.div style={{ y: cloudsY }} className="absolute inset-0">
              <Cloud variant={0} className="drift-a absolute -left-[16%] top-[24%] w-[54%] max-w-[340px] opacity-85" />
              <Cloud variant={2} className="drift-b absolute -right-[22%] top-[40%] w-[62%] max-w-[400px] opacity-80" />
              <Sparkle className="twinkle absolute left-[18%] top-[8%] w-3" />
              <Star className="twinkle twinkle-d1 absolute right-[16%] top-[12%] w-3.5" />
              <Sparkle className="twinkle twinkle-d3 absolute left-[72%] top-[22%] w-2.5" />
            </motion.div>
            <motion.div style={{ y: nearY }} className="absolute inset-0">
              <Cloud variant={1} className="drift-slow absolute -left-[20%] bottom-[2%] w-[60%] max-w-[380px] opacity-90" />
              <Boat className="absolute bottom-[4%] right-[6%] w-24 opacity-75" />
            </motion.div>
          </>
        }
      >
        <motion.div style={{ y: rise, rotate: sway }} className="w-[46%] max-w-[190px]">
          <div className="bob-slow">
            <Balloon className="w-full" />
          </div>
        </motion.div>
        <div className="mt-10 space-y-4 text-center">
          <ScrollWords text={c.title} className="font-display text-[2.2rem] font-normal italic leading-[1.2] text-cocoa sm:text-[2.6rem]" />
          <ScrollWords text={c.text} className="mx-auto max-w-[20rem] font-serif text-[1.04rem] font-light leading-[1.85] text-cocoa/90" delay={0.7} />
        </div>
        <Reveal delay={0.3} className="mt-14 flex flex-col items-center text-center">
          <span className="font-serif text-[0.95rem] font-light italic text-cafe">{c.signoff}</span>
          <span className="mt-2 font-display text-[3.2rem] italic leading-none text-cocoa">{invitation.meta.signature}</span>
          <Ornament className="mt-10 w-40" />
          <button type="button" onClick={onReplay} className="link-quiet mt-8">
            {invitation.opening.replay}
          </button>
        </Reveal>
      </Chapter>
    </div>
  );
}

/** Texto que se revela palabra por palabra al entrar en pantalla. */
function ScrollWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  return (
    <motion.p className={className} aria-label={text} initial="h" whileInView="s" viewport={{ once: true, amount: 0.8 }}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block whitespace-pre"
          variants={{
            h: reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: 'blur(6px)' },
            s: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE, delay: delay + i * 0.08 } },
          }}
        >
          {w + (i < words.length - 1 ? ' ' : '')}
        </motion.span>
      ))}
    </motion.p>
  );
}

/* ───────────────────────────── Iconos ───────────────────────────── */
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <path d="M12 21s-6.5-6.2-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.8-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <rect x="4" y="5.5" width="16" height="14" rx="1.5" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </svg>
  );
}
