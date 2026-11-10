import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { invitation } from '../../content/invitation';
import { Chapter, ChapterHeading, Pending, Reveal } from '../ui';
import { Sparkle, Sprig } from '../illustrations/Sky';
import { rsvpStorageConfigured, submitRsvp, whatsappConfigured, whatsappUrl } from '../../lib/rsvp';

type Status = 'idle' | 'sending' | 'saved' | 'error';

export function ChapterSeven() {
  const c = invitation.chapter7;
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [touched, setTouched] = useState(false);

  const valid = name.trim().length > 1 && attending !== null;
  const data = { name, attending: attending ?? false };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    if (!rsvpStorageConfigured) {
      openWhatsApp();
      return;
    }
    setStatus('sending');
    const ok = await submitRsvp(data);
    setStatus(ok ? 'saved' : 'error');
  };

  const openWhatsApp = () => {
    setTouched(true);
    if (!valid) return;
    const url = whatsappUrl(data);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Chapter
      id="capitulo-7"
      decor={
        <>
          <Sprig className="absolute -right-3 top-[8%] w-24 opacity-75" flip />
          <Sparkle className="twinkle absolute left-[10%] top-[20%] w-3" />
        </>
      }
    >
      <ChapterHeading number={c.number} label={c.label} />
      <Reveal delay={0.1} className="mt-6 text-center">
        <p className="font-display text-[1.45rem] italic leading-snug text-cocoa">{c.intro}</p>
        {c.deadline && <p className="mt-2 font-serif text-cafe">{c.deadline}</p>}
      </Reveal>

      <Reveal delay={0.2} className="mt-9 w-full">
        <div className="paper-card relative w-full px-6 py-9 sm:px-9">
          <div className="absolute inset-[8px] border border-gold/45" aria-hidden />
          <AnimatePresence mode="wait">
            {status === 'saved' ? (
              <motion.div
                key="ok"
                role="status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex flex-col items-center py-8 text-center"
              >
                <Sparkle className="mb-4 w-6" />
                <p className="font-display text-[1.6rem] italic leading-snug text-cocoa">
                  {attending ? c.successYes : c.successNo}
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} noValidate className="relative space-y-8" exit={{ opacity: 0 }}>
                {/* Nombre */}
                <div>
                  <label htmlFor="rsvp-name" className="label block text-cafe">
                    {c.fields.name}
                  </label>
                  <input
                    id="rsvp-name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={c.fields.namePlaceholder}
                    className="field mt-2"
                    aria-invalid={touched && name.trim().length < 2}
                    required
                  />
                </div>

                {/* Asistencia */}
                <fieldset>
                  <legend className="label text-cafe">{c.fields.attending}</legend>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      [true, c.fields.yes],
                      [false, c.fields.no],
                    ].map(([v, label]) => (
                      <label key={String(v)} className={`choice ${attending === v ? 'is-on' : ''}`}>
                        <input
                          type="radio"
                          name="attending"
                          className="sr-only"
                          checked={attending === v}
                          onChange={() => setAttending(v as boolean)}
                        />
                        <span className="choice-dot" aria-hidden />
                        <span>{label as string}</span>
                      </label>
                    ))}
                  </div>
                  {touched && attending === null && (
                    <p className="mt-2 font-serif text-sm italic text-cafe">Por favor elige una opción.</p>
                  )}
                </fieldset>

                {/* Acciones */}
                <div className="flex flex-col items-center gap-3 pt-2">
                  {rsvpStorageConfigured ? (
                    <>
                      <button type="submit" className="btn-primary w-full justify-center" disabled={status === 'sending'}>
                        {status === 'sending' ? c.sending : c.submit}
                      </button>
                      {whatsappConfigured && (
                        <button type="button" onClick={openWhatsApp} className="link-quiet">
                          {c.orWhatsApp}
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button type="submit" className="btn-primary w-full justify-center" disabled={!whatsappConfigured}>
                        <WhatsIcon />
                        {c.submitWhatsApp}
                      </button>
                      {!whatsappConfigured && <Pending>{c.whatsappPending}</Pending>}
                      <Pending>Guardado automático de respuestas sin configurar</Pending>
                    </>
                  )}
                  {status === 'error' && (
                    <p role="alert" className="text-center font-serif text-sm italic text-cafe">
                      {c.error}
                    </p>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </Chapter>
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
