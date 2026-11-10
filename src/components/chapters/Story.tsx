import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { invitation } from '../../content/invitation';
import { Balloon } from '../illustrations/Balloon';
import { RockingHorse } from '../illustrations/RockingHorse';
import { Cloud, Ornament, Sparkle, Sprig, Star } from '../illustrations/Sky';
import { Boat, GiftBox, Pearls, PlateFrame, Stork } from '../illustrations/Objects';
import { Body, Chapter, ChapterHeading, Pending, Reveal } from '../ui';
import { useCountdown } from '../../hooks/useCountdown';
import { downloadIcs } from '../../lib/calendar';

/** Parallax suave ligado al scroll de una sección. */
function useParallax(range = 80) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [range, -range]);
  return { ref, y };
}

/* ───────────────────────────── Capítulo I ───────────────────────────── */
export function ChapterOne() {
  const c = invitation.chapter1;
  const far = useParallax(50);
  const near = useParallax(120);
  return (
    <Chapter
      id="capitulo-1"
      decor={
        <>
          <motion.div ref={far.ref} style={{ y: far.y }} className="absolute inset-0">
            <Cloud variant={1} className="drift-a absolute -left-[14%] top-[8%] w-[48%] max-w-[300px] opacity-80" />
            <Cloud variant={0} className="drift-b absolute -right-[18%] top-[22%] w-[50%] max-w-[320px] opacity-70" />
          </motion.div>
          <motion.div ref={near.ref} style={{ y: near.y }} className="absolute inset-0">
            <Sparkle className="twinkle absolute left-[16%] top-[18%] w-3" />
            <Star className="twinkle twinkle-d2 absolute right-[22%] top-[12%] w-4" />
            <Star className="twinkle twinkle-d1 absolute left-[10%] bottom-[26%] w-3" />
            <Sparkle className="twinkle twinkle-d3 absolute right-[12%] bottom-[34%] w-4" />
          </motion.div>
        </>
      }
    >
      <ChapterHeading number={c.number} label={c.label} />
      <Reveal delay={0.1} className="mt-10 w-[78%] max-w-[300px]">
        <div className="rock origin-[50%_92%]">
          <RockingHorse className="w-full" />
        </div>
      </Reveal>
      <div className="mt-10 space-y-6 text-center">
        <Reveal delay={0.15}>
          <p className="dropcap font-display text-[1.6rem] font-light leading-[1.35] text-cocoa sm:text-[1.9rem]">
            {c.paragraphs[0]}
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <Body className="italic">{c.paragraphs[1]}</Body>
        </Reveal>
      </div>
    </Chapter>
  );
}

/* ───────────────────────────── Capítulo II ───────────────────────────── */
export function ChapterTwo() {
  const c = invitation.chapter2;
  const p = useParallax(70);
  return (
    <Chapter
      id="capitulo-2"
      className="sky-tint"
      decor={
        <motion.div ref={p.ref} style={{ y: p.y }} className="absolute inset-0">
          <Cloud variant={2} className="drift-b absolute -left-[22%] bottom-[16%] w-[60%] max-w-[380px] opacity-80" />
          <Cloud variant={1} className="drift-a absolute -right-[16%] top-[14%] w-[44%] max-w-[280px] opacity-75" />
          <Stork className="stork-fly absolute right-[6%] top-[6%] w-[30%] max-w-[170px] opacity-80" />
        </motion.div>
      }
    >
      <ChapterHeading number={c.number} label={c.label} />
      <Reveal delay={0.1} className="mt-8 w-[46%] max-w-[190px]">
        <div className="bob-slow">
          <Balloon className="w-full" />
        </div>
      </Reveal>
      <Reveal delay={0.15} as="h2" className="mt-8 text-center font-display text-[2.4rem] font-light leading-[1.05] text-cocoa sm:text-[3rem]">
        <span className="italic">Gender Reveal</span>
        <span className="mx-auto my-2 block font-display text-[1.3rem] text-gold">&amp;</span>
        <span className="italic">Baby Shower</span>
      </Reveal>
      <div className="mt-8 space-y-5 text-center">
        <Reveal delay={0.2}>
          <Body>{c.paragraphs[0]}</Body>
        </Reveal>
        <Reveal delay={0.3}>
          <Body className="italic">{c.paragraphs[1]}</Body>
        </Reveal>
      </div>
    </Chapter>
  );
}

/* ───────────────────────────── Capítulo III ───────────────────────────── */
export function ChapterThree() {
  const c = invitation.chapter3;
  const left = useCountdown(c.isoDateTime);
  const cells: [number, string][] = [
    [left.days, c.countdownLabels.days],
    [left.hours, c.countdownLabels.hours],
    [left.minutes, c.countdownLabels.minutes],
    [left.seconds, c.countdownLabels.seconds],
  ];
  return (
    <Chapter
      id="capitulo-3"
      decor={
        <>
          <Sprig className="absolute -left-2 top-[10%] w-28 opacity-80" />
          <Sprig flip className="absolute -right-2 bottom-[8%] w-28 rotate-180 opacity-80" />
        </>
      }
    >
      <ChapterHeading number={c.number} label={c.label} />

      <Reveal delay={0.1} className="mt-10 flex flex-col items-center text-center">
        <span className="label text-[0.78rem] text-cafe">{c.weekday}</span>
        <div className="my-1 flex items-center gap-5">
          <span className="h-px w-12 bg-gold/70 sm:w-16" />
          <time dateTime={c.isoDateTime} className="font-display text-[7.5rem] font-light leading-none text-cocoa sm:text-[9rem]">
            {c.day}
          </time>
          <span className="h-px w-12 bg-gold/70 sm:w-16" />
        </div>
        <span className="label text-[0.78rem] text-cafe">{c.monthYear}</span>
        <Ornament className="my-6 w-36" />
        <span className="font-display text-[1.7rem] italic text-cocoa">{c.time}</span>
      </Reveal>

      <Reveal delay={0.2} className="mt-12 w-full">
        {left.done ? (
          <p className="text-center font-display text-2xl italic text-cocoa">{c.countdownDone}</p>
        ) : (
          <div className="paper-card relative mx-auto grid w-full max-w-[22rem] grid-cols-4 px-2 py-6" role="timer" aria-live="off">
            <div className="absolute inset-[6px] border border-gold/40" aria-hidden />
            {cells.map(([n, label], i) => (
              <div key={label} className={`relative flex flex-col items-center ${i > 0 ? 'border-l border-gold/30' : ''}`}>
                <span className="font-display text-[2.3rem] font-light tabular-nums lining-nums leading-none text-cocoa">
                  {String(n).padStart(2, '0')}
                </span>
                <span className="mt-2 font-sans text-[0.58rem] uppercase tracking-[0.2em] text-cafe/80">{label}</span>
              </div>
            ))}
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
  );
}

/* ───────────────────────────── Capítulo IV ───────────────────────────── */
export function ChapterFour() {
  const c = invitation.chapter4;
  const img = invitation.illustrations.venue;
  return (
    <Chapter id="capitulo-4" className="sky-tint">
      <ChapterHeading number={c.number} label={c.label} />

      <Reveal delay={0.1} className="relative mt-10 w-full max-w-[20rem]">
        <figure className="relative aspect-[300/380] w-full">
          <PlateFrame className="absolute inset-0 h-full w-full" />
          <div className="venue-arch absolute inset-[22px] overflow-hidden">
            {img ? (
              <img src={img} alt={c.venueName ?? c.illustrationCaption} className="h-full w-full object-cover" />
            ) : (
              <VenuePlaceholder />
            )}
          </div>
        </figure>
        <figcaption className="mt-3 text-center font-display text-sm italic text-cafe/80">
          {c.illustrationCaption}
          {!img && <Pending>Ilustración pendiente</Pending>}
        </figcaption>
      </Reveal>

      <Reveal delay={0.2} className="mt-8 text-center">
        <h3 className="font-display text-[1.9rem] font-light text-cocoa">
          {c.venueName ?? <span className="italic text-cafe">{c.venueNameFallback}</span>}
          {!c.venueName && <Pending />}
        </h3>
        <p className="mt-2 font-serif text-[1.05rem] text-cafe">
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

function VenuePlaceholder() {
  return (
    <svg viewBox="0 0 256 336" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="vp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DCE3E6" />
          <stop offset="0.7" stopColor="#F3EEE4" />
        </linearGradient>
      </defs>
      <rect width="256" height="336" fill="url(#vp-sky)" />
      <g filter="url(#wc-cloud)">
        <ellipse cx="70" cy="80" rx="46" ry="16" fill="#FBF8F2" />
        <ellipse cx="190" cy="120" rx="54" ry="14" fill="#FBF8F2" opacity="0.9" />
      </g>
      <g filter="url(#wc-wash)">
        <path d="M0 250 C 60 214, 120 226, 170 236 C 210 244, 236 232, 256 222 L 256 336 L 0 336 Z" fill="#D9C8B2" opacity="0.8" />
        <path d="M0 282 C 70 262, 150 272, 256 260 L 256 336 L 0 336 Z" fill="#C8B694" opacity="0.65" />
        <ellipse cx="54" cy="236" rx="18" ry="26" fill="#A8B7C0" opacity="0.7" />
        <ellipse cx="208" cy="226" rx="14" ry="22" fill="#A8B7C0" opacity="0.6" />
      </g>
      <text x="128" y="170" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="15" fill="#6B5143" opacity="0.7">
        Aquí irá la ilustración
      </text>
      <text x="128" y="190" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="15" fill="#6B5143" opacity="0.7">
        del lugar en acuarela
      </text>
    </svg>
  );
}

/* ───────────────────────────── Capítulo V ───────────────────────────── */
export function ChapterFive() {
  const c = invitation.chapter5;
  return (
    <Chapter
      id="capitulo-5"
      decor={
        <>
          <Sparkle className="twinkle absolute left-[12%] top-[16%] w-3" />
          <Sparkle className="twinkle twinkle-d2 absolute right-[14%] top-[26%] w-4" />
          <Sparkle className="twinkle twinkle-d1 absolute right-[20%] bottom-[18%] w-3" />
        </>
      }
    >
      <ChapterHeading number={c.number} label={c.label} />
      <Reveal delay={0.1} className="relative mt-10 w-full">
        <div className="paper-card relative px-8 pb-12 pt-14 text-center">
          <div className="absolute inset-[8px] border border-gold/50" aria-hidden />
          <div className="absolute inset-[13px] border border-gold/25" aria-hidden />
          <Pearls className="absolute left-1/2 top-0 w-[70%] -translate-x-1/2 -translate-y-[8%] opacity-90" />
          <h2 className="relative mt-10 font-display text-[2rem] font-light uppercase tracking-[0.16em] text-cocoa sm:text-[2.6rem]">
            {c.title}
          </h2>
          <Ornament className="relative mx-auto my-5 w-32" />
          <div className="relative flex flex-col gap-6">
            {c.quotes.map((q) => (
              <p key={q.who} className="flex flex-col items-center gap-1">
                <span className="font-serif text-[0.95rem] text-cafe">{q.who}</span>
                <span
                  className={
                    q.emphasis
                      ? 'font-display text-[2.1rem] italic leading-tight text-cocoa'
                      : 'font-display text-[1.45rem] italic leading-snug text-cocoa'
                  }
                >
                  {q.what}
                </span>
              </p>
            ))}
          </div>
          {c.heart && <Heart className="relative mx-auto mt-6 w-6" />}
        </div>
      </Reveal>
    </Chapter>
  );
}

/* ───────────────────────────── Capítulo VI ───────────────────────────── */
export function ChapterSix() {
  const c = invitation.chapter6;
  return (
    <Chapter
      id="capitulo-6"
      className="sky-tint"
      decor={
        <>
          <Sprig className="absolute left-[-6px] bottom-[14%] w-24 opacity-75" />
          <Cloud variant={1} className="drift-a absolute -right-[18%] top-[10%] w-[46%] max-w-[280px] opacity-70" />
        </>
      }
    >
      <ChapterHeading number={c.number} label={c.label} />
      <Reveal delay={0.1} className="mt-10 w-[62%] max-w-[240px]">
        <div className="sway-soft">
          <GiftBox className="w-full" />
        </div>
      </Reveal>
      <Reveal delay={0.15} as="h2" className="mt-8 text-center font-display text-[2.1rem] font-light italic leading-tight text-cocoa sm:text-[2.5rem]">
        {c.title}
      </Reveal>
      <div className="mt-7 space-y-5 text-center">
        <Reveal delay={0.2}>
          <Body>{c.paragraphs[0]}</Body>
        </Reveal>
        <Reveal delay={0.3}>
          <Body>{c.paragraphs[1]}</Body>
        </Reveal>
      </div>
    </Chapter>
  );
}

/* ───────────────────────────── Capítulo VIII ───────────────────────────── */
export function ChapterEight() {
  const c = invitation.chapter8;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const rise = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [260, -40]);
  const cloudsY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -30]);
  return (
    <div ref={ref} className="relative">
      <Chapter
        id="capitulo-8"
        className="sky-wash-end pb-16"
        decor={
          <motion.div style={{ y: cloudsY }} className="absolute inset-0">
            <Cloud variant={0} className="drift-a absolute -left-[16%] top-[30%] w-[52%] max-w-[340px] opacity-85" />
            <Cloud variant={2} className="drift-b absolute -right-[20%] top-[46%] w-[58%] max-w-[380px] opacity-80" />
            <Cloud variant={1} className="drift-a absolute left-[18%] bottom-[4%] w-[46%] max-w-[300px] opacity-70" />
            <Sparkle className="twinkle absolute left-[18%] top-[8%] w-3" />
            <Star className="twinkle twinkle-d1 absolute right-[16%] top-[14%] w-3.5" />
            <Sparkle className="twinkle twinkle-d3 absolute left-[70%] top-[24%] w-2.5" />
            <Boat className="absolute bottom-[1%] right-[4%] w-24 opacity-75" />
          </motion.div>
        }
      >
        <ChapterHeading number={c.number} label={c.label} />
        <motion.div style={{ y: rise }} className="mt-8 w-[44%] max-w-[180px]">
          <div className="bob-slow">
            <Balloon className="w-full" />
          </div>
        </motion.div>
        <div className="mt-8 space-y-5 text-center">
          <Reveal delay={0.1}>
            <p className="font-display text-[1.6rem] font-light leading-[1.35] text-cocoa sm:text-[1.9rem]">{c.paragraphs[0]}</p>
          </Reveal>
          <Reveal delay={0.25}>
            <Body className="italic">{c.paragraphs[1]}</Body>
          </Reveal>
        </div>
        <Reveal delay={0.35} className="mt-12 flex flex-col items-center text-center">
          <span className="font-serif text-lg italic text-cafe">{c.signoff}</span>
          <span className="mt-1 font-display text-[2.6rem] italic leading-tight text-cocoa">{c.signature}</span>
          <Ornament className="mt-10 w-40" />
          <span className="mt-4 font-display text-xl italic tracking-[0.3em] text-gold">{c.fin}</span>
        </Reveal>
      </Chapter>
    </div>
  );
}

/* ───────────────────────────── Iconos ───────────────────────────── */
function Heart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 22" className={className} aria-hidden>
      <path
        d="M12 20.5C6.2 16.2 2.5 12.9 2.5 8.4 2.5 5.2 4.9 3 7.7 3c1.9 0 3.4 1 4.3 2.5C12.9 4 14.4 3 16.3 3c2.8 0 5.2 2.2 5.2 5.4 0 4.5-3.7 7.8-9.5 12.1z"
        fill="#6B5143"
        filter="url(#wc-wash)"
      />
    </svg>
  );
}

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
