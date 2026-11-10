import { useEffect, useState } from 'react';

export type Remaining = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function diff(target: number): Remaining {
  const ms = Math.max(0, target - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: ms === 0,
  };
}

/** Cuenta regresiva real. `iso` debe incluir zona horaria (p. ej. -05:00 para Colombia). */
export function useCountdown(iso: string): Remaining {
  const target = new Date(iso).getTime();
  const [left, setLeft] = useState(() => diff(target));
  useEffect(() => {
    let id: number;
    const tick = () => {
      setLeft(diff(target));
      // se alinea con el cambio de segundo del reloj
      id = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    tick();
    return () => clearTimeout(id);
  }, [target]);
  return left;
}
