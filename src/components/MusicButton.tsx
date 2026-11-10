import { AnimatePresence, motion } from 'framer-motion';
import { invitation } from '../content/invitation';
import { useMusic } from '../hooks/useMusic';

/** Botón discreto para activar / silenciar la música. */
export function MusicButton({ visible, onReplay }: { visible: boolean; onReplay: () => void }) {
  const { playing, blocked, toggle } = useMusic();
  const m = invitation.music;
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed right-[max(14px,env(safe-area-inset-right))] top-[max(14px,env(safe-area-inset-top))] z-50 flex items-center gap-2"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
        >
          <AnimatePresence>
            {blocked && !playing && (
              <motion.button
                type="button"
                data-music-toggle
                onClick={toggle}
                className="music-pill"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
              >
                {m.enableLabel}
              </motion.button>
            )}
          </AnimatePresence>
          <button type="button" onClick={onReplay} aria-label={invitation.opening.replay} title={invitation.opening.replay} className="music-btn">
            <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden>
              <path d="M4 5.5c2.6-1 5.4-1 8 .8 2.6-1.8 5.4-1.8 8-.8v13c-2.6-1-5.4-1-8 .8-2.6-1.8-5.4-1.8-8-.8z" />
              <path d="M12 6.3v13" />
            </svg>
          </button>
          <button
            type="button"
            data-music-toggle
            onClick={toggle}
            aria-pressed={playing}
            aria-label={playing ? m.muteLabel : m.playLabel}
            className="music-btn"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden>
              <path d="M9 17.5V6.5l9-2v11" />
              <ellipse cx="7" cy="17.5" rx="2.2" ry="1.7" />
              <ellipse cx="16" cy="15.5" rx="2.2" ry="1.7" />
              {!playing && <path d="M4 4l16 16" />}
            </svg>
            {playing && (
              <span className="music-bars" aria-hidden>
                <i /> <i /> <i />
              </span>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
