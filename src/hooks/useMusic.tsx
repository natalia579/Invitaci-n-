import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { invitation } from '../content/invitation';

/**
 * Música de fondo: un archivo autorizado (invitation.music.src).
 *  · Empieza con el toque en el sello (dentro del gesto, como exige Safari).
 *  · Entrada gradual de volumen con Web Audio (en iOS `audio.volume` no se puede cambiar).
 *  · Si el navegador la bloquea, se ofrece un botón discreto para activarla.
 *  · Sin archivo configurado, no suena nada y no se muestra el botón.
 */

type MusicState = {
  available: boolean;
  playing: boolean;
  blocked: boolean;
  tryAutoplay: () => void;
  toggle: () => void;
};

const Ctx = createContext<MusicState | null>(null);

type Player = { play: () => Promise<boolean>; pause: () => void };

function createPlayer(src: string): Player {
  const { volume, fadeInSeconds } = invitation.music;
  const audio = new Audio(src);
  audio.loop = true;
  audio.preload = 'auto';
  audio.setAttribute('playsinline', '');
  let ctx: AudioContext | null = null;
  let gain: GainNode | null = null;

  const ensureGraph = () => {
    if (ctx) return;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
      const node = ctx.createMediaElementSource(audio);
      gain = ctx.createGain();
      gain.gain.value = 0;
      node.connect(gain).connect(ctx.destination);
    } catch {
      ctx = null;
      gain = null;
    }
  };

  const fadeTo = (target: number, seconds: number) => {
    if (ctx && gain) {
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(target, now + seconds);
    } else {
      audio.volume = target; // respaldo (escritorio)
    }
  };

  return {
    play: async () => {
      ensureGraph(); // se crea dentro del gesto del usuario
      try {
        void ctx?.resume();
        await audio.play();
        fadeTo(volume, fadeInSeconds);
        return true;
      } catch {
        return false;
      }
    },
    pause: () => {
      fadeTo(0, 0.6);
      window.setTimeout(() => audio.pause(), 650);
    },
  };
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const src = invitation.music.src;
  const player = useRef<Player | null>(null);
  const userMuted = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const getPlayer = () => (src ? (player.current ??= createPlayer(src)) : null);

  const start = useCallback(async () => {
    const p = getPlayer();
    if (!p) return;
    const ok = await p.play();
    setPlaying(ok);
    setBlocked(!ok);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const tryAutoplay = useCallback(() => {
    if (userMuted.current) return;
    void start();
  }, [start]);

  useEffect(() => {
    const onVis = () => {
      const p = player.current;
      if (!p) return;
      if (document.hidden) p.pause();
      else if (playing && !userMuted.current) void p.play();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [playing]);

  const toggle = useCallback(() => {
    if (playing) {
      userMuted.current = true;
      player.current?.pause();
      setPlaying(false);
    } else {
      userMuted.current = false;
      void start();
    }
  }, [playing, start]);

  const value = useMemo(
    () => ({ available: Boolean(src), playing, blocked, tryAutoplay, toggle }),
    [src, playing, blocked, tryAutoplay, toggle],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMusic() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useMusic debe usarse dentro de MusicProvider');
  return v;
}
