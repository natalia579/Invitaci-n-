import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { invitation } from '../content/invitation';
import { MusicBox } from '../audio/musicBox';

type Player = { play: () => Promise<boolean>; pause: () => void };

type MusicState = {
  playing: boolean;
  /** El navegador bloqueó la reproducción automática: hay que pedir un toque. */
  blocked: boolean;
  /** Intenta reproducir (respeta si el invitado silenció la música). */
  tryAutoplay: () => void;
  toggle: () => void;
};

const Ctx = createContext<MusicState | null>(null);

function createPlayer(): Player {
  const { src, volume } = invitation.music;
  if (src) {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = volume;
    return {
      play: () =>
        audio.play().then(
          () => true,
          () => false,
        ),
      pause: () => audio.pause(),
    };
  }
  let box: MusicBox | null = null;
  return {
    play: () => {
      box ??= new MusicBox(volume * 0.9);
      return box.play();
    },
    pause: () => box?.pause(),
  };
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const player = useRef<Player | null>(null);
  const userMuted = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const armed = useRef(false);

  const getPlayer = () => (player.current ??= createPlayer());

  const start = useCallback(async () => {
    const ok = await getPlayer().play();
    setPlaying(ok);
    setBlocked(!ok);
    return ok;
  }, []);

  const tryAutoplay = useCallback(() => {
    if (userMuted.current) return;
    armed.current = true;
    void start();
  }, [start]);

  // Si el navegador bloqueó el audio, arranca con el primer toque del invitado
  // (iOS/Safari exigen un gesto explícito).
  useEffect(() => {
    if (!blocked) return;
    const onGesture = (e: Event) => {
      if (!armed.current || userMuted.current) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-music-toggle]')) return; // el botón ya lo maneja
      void start();
    };
    window.addEventListener('pointerup', onGesture, { passive: true });
    window.addEventListener('touchend', onGesture, { passive: true });
    window.addEventListener('keydown', onGesture);
    return () => {
      window.removeEventListener('pointerup', onGesture);
      window.removeEventListener('touchend', onGesture);
      window.removeEventListener('keydown', onGesture);
    };
  }, [blocked, start]);

  // Pausar cuando la pestaña queda en segundo plano
  useEffect(() => {
    const onVis = () => {
      if (!player.current) return;
      if (document.hidden) player.current.pause();
      else if (playing && !userMuted.current) void player.current.play();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [playing]);

  const toggle = useCallback(() => {
    if (playing) {
      userMuted.current = true;
      getPlayer().pause();
      setPlaying(false);
    } else {
      userMuted.current = false;
      armed.current = true;
      void start();
    }
  }, [playing, start]);

  const value = useMemo(() => ({ playing, blocked, tryAutoplay, toggle }), [playing, blocked, tryAutoplay, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMusic() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useMusic debe usarse dentro de MusicProvider');
  return v;
}
