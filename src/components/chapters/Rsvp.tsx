import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { invitation } from '../../content/invitation';
import { Chapter, Pending, Reveal } from '../ui';
import { Ornament, Sparkle, Sprig } from '../illustrations/Sky';
import { Corners } from '../illustrations/Landscape';
import { fetchInvite, inviteIdFromUrl, rsvpConfigured, saveRsvp, whatsappQuestionUrl, type Attending } from '../../lib/rsvp';

type Status = 'loading' | 'form' | 'sending' | 'saved' | 'error' | 'no-link' | 'unknown' | 'not-configured';

/** ¿Nos acompañas? — confirmación estrictamente individual. */
export function RsvpSection() {
  const t = invitation.rsvpText;
  const [id] = useState(() => inviteIdFromUrl());
  const [status, setStatus] = useState<Status>(() => (!rsvpConfigured() ? 'not-configured' : !id ? 'no-link' : 'loading'));
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<Attending | null>(null);
  const [saved, setSaved] = useState<Attending | null>(null);
  const [touched, setTouched] = useState(false);

  // Si el invitado ya respondió antes, se muestra su respuesta y puede cambiarla
  useEffect(() => {
    if (status !== 'loading' || !id) return;
    let alive = true;
    void fetchInvite(id).then((r) => {
      if (!alive) return;
      if (r === 'not_found') return setStatus('unknown');
      if (r === 'error') return setStatus('form'); // se puede intentar guardar igualmente
      setName(r.name);
      setAttending(r.attending);
      setSaved(r.attending);
      setStatus(r.attending ? 'saved' : 'form');
    });
    return () => {
      alive = false;
    };
  }, [status, id]);

  const valid = name.trim().length > 2 && attending !== null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid || !id || !attending) return;
    setStatus('sending');
    const ok = await saveRsvp(id, name, attending);
    if (ok) {
      setSaved(attending);
      setStatus('saved');
    } else {
      setStatus('error');
    }
  };

  const formDisabled = status === 'no-link' || status === 'unknown' || status === 'not-configured';

  return (
    <Chapter
      id="confirmar"
      decor={
        <>
          <Sprig className="absolute -right-3 top-[8%] w-24 opacity-75" flip />
          <Sparkle className="twinkle absolute left-[10%] top-[16%] w-3" />
        </>
      }
    >
      <Reveal className="text-center">
        <h2 className="font-display text-[2.5rem] font-normal italic leading-tight text-cocoa">{t.title}</h2>
        <Ornament className="mx-auto my-4 w-32" />
        <p className="mx-auto max-w-[20rem] font-serif text-[1.02rem] font-light leading-[1.8] text-cocoa/90">{t.intro}</p>
      </Reveal>

      <Reveal delay={0.15} className="mt-10 w-full">
        <div className="paper-card relative w-full px-6 py-10 sm:px-9">
          <Corners size={30} />
          <AnimatePresence mode="wait">
            {status === 'saved' && saved ? (
              <motion.div
                key="ok"
                role="status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="relative flex flex-col items-center py-6 text-center"
              >
                <Sparkle className="mb-5 w-6" />
                <p className="font-display text-[1.7rem] italic leading-snug text-cocoa">
                  {saved === 'yes' ? t.successYes : t.successNo}
                  {saved === 'yes' && <Heart className="ml-2 inline-block w-5 align-[-0.1em]" />}
                </p>
                <button type="button" onClick={() => setStatus('form')} className="link-quiet mt-6">
                  {t.change}
                </button>
              </motion.div>
            ) : status === 'loading' ? (
              <motion.p key="loading" className="py-10 text-center font-display text-xl italic text-cafe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {t.loading}
              </motion.p>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} noValidate className="relative space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {saved && <p className="text-center font-serif text-sm italic text-cafe">{saved === 'yes' ? t.previousYes : t.previousNo}</p>}
                <div>
                  <label htmlFor="rsvp-name" className="label block text-cafe">
                    {t.nameLabel}
                  </label>
                  <input
                    id="rsvp-name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="field mt-2"
                    aria-invalid={touched && name.trim().length <= 2}
                    disabled={formDisabled}
                    required
                  />
                </div>

                <fieldset disabled={formDisabled}>
                  <legend className="label text-cafe">{t.question}</legend>
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    {(
                      [
                        ['yes', t.yes],
                        ['no', t.no],
                      ] as const
                    ).map(([v, label]) => (
                      <label key={v} className={`choice ${attending === v ? 'is-on' : ''}`}>
                        <input type="radio" name="attending" className="sr-only" checked={attending === v} onChange={() => setAttending(v)} />
                        <span className="choice-dot" aria-hidden />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                  {touched && attending === null && <p className="mt-2 font-serif text-sm italic text-cafe">Por favor elige una opción.</p>}
                </fieldset>

                <div className="flex flex-col items-center gap-3 pt-1">
                  <button type="submit" className="btn-primary w-full justify-center" disabled={formDisabled || status === 'sending'}>
                    {status === 'sending' ? t.sending : t.submit}
                  </button>
                  {status === 'error' && (
                    <p role="alert" className="text-center font-serif text-sm italic text-cafe">
                      {t.error}
                    </p>
                  )}
                  {status === 'no-link' && <p className="text-center font-serif text-sm italic text-cafe">{t.noLink}</p>}
                  {status === 'unknown' && <p className="text-center font-serif text-sm italic text-cafe">{t.unknownLink}</p>}
                  {status === 'not-configured' && <Pending>{t.notConfigured}</Pending>}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </Chapter>
  );
}

/** ¿Tienes alguna pregunta? — WhatsApp como canal privado de dudas. */
export function QuestionsSection() {
  const q = invitation.questions;
  const url = whatsappQuestionUrl();
  return (
    <section id="preguntas" className="relative flex w-full flex-col items-center px-7 pb-24 pt-4 text-center">
      <Reveal className="flex flex-col items-center">
        <Ornament className="mb-6 w-28" />
        <h2 className="font-display text-[1.9rem] italic leading-tight text-cocoa">{q.title}</h2>
        <p className="mt-3 max-w-[18rem] font-serif text-[1rem] font-light leading-relaxed text-cafe">{q.text}</p>
        <div className="mt-6 flex flex-col items-center gap-2">
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <WhatsIcon />
              {q.button}
            </a>
          ) : (
            <>
              <button type="button" className="btn-ghost opacity-60" disabled>
                <WhatsIcon />
                {q.button}
              </button>
              <Pending>Número de WhatsApp pendiente</Pending>
            </>
          )}
        </div>
      </Reveal>
    </section>
  );
}

export function Heart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 22" className={className} aria-label="con cariño" role="img">
      <path
        d="M12 20.5C6.2 16.2 2.5 12.9 2.5 8.4 2.5 5.2 4.9 3 7.7 3c1.9 0 3.4 1 4.3 2.5C12.9 4 14.4 3 16.3 3c2.8 0 5.2 2.2 5.2 5.4 0 4.5-3.7 7.8-9.5 12.1z"
        fill="#6B5143"
        filter="url(#wc-wash)"
      />
    </svg>
  );
}

function WhatsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.4 18.6z" strokeLinejoin="round" />
      <path d="M9.2 8.6c.3-.6.6-.6.9-.6h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c.6 1.2 1.6 2.1 2.8 2.7l.6-.6c.2-.2.4-.2.6-.1l1.5.7c.2.1.3.3.3.5v.5c0 .4-.2.7-.7 1-.6.3-1.6.4-3.2-.4-1.8-.9-3.3-2.5-4-4.2-.4-1.2-.1-2.2.2-2.6z" />
    </svg>
  );
}
