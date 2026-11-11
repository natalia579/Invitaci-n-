/**
 * Pintura en el navegador: cielo y nubes con técnica de acuarela por capas
 * (aguadas transparentes, bordes húmedos, granulado y papel).
 * Se pinta una sola vez y se usa como imagen; no son formas geométricas.
 */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type C = CanvasRenderingContext2D;

/** Mancha de aguada: muchas capas muy transparentes con borde irregular. */
function wash(ctx: C, r: () => number, x: number, y: number, rx: number, ry: number, rgb: string, alpha: number, layers = 7) {
  for (let i = 0; i < layers; i++) {
    const jx = x + (r() - 0.5) * rx * 0.25;
    const jy = y + (r() - 0.5) * ry * 0.25;
    const k = 0.75 + r() * 0.4;
    ctx.save();
    ctx.translate(jx, jy);
    ctx.rotate((r() - 0.5) * 0.4);
    ctx.scale(1, (ry / rx) * (0.85 + r() * 0.3));
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * k);
    const a = alpha / layers;
    g.addColorStop(0, `rgba(${rgb},${a * 0.85})`);
    g.addColorStop(0.72, `rgba(${rgb},${a})`);
    g.addColorStop(0.9, `rgba(${rgb},${a * 1.35})`); // pigmento acumulado en el borde
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    // contorno irregular
    const steps = 28;
    for (let s = 0; s <= steps; s++) {
      const t = (s / steps) * Math.PI * 2;
      const rr = rx * k * (0.86 + r() * 0.16);
      const px = Math.cos(t) * rr, py = Math.sin(t) * rr;
      if (s === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function grain(ctx: C, w: number, h: number, r: () => number, amount: number, dark = '110,85,62') {
  for (let i = 0; i < amount; i++) {
    ctx.fillStyle = `rgba(${r() > 0.45 ? dark : '255,252,245'},${0.02 + r() * 0.035})`;
    ctx.fillRect(r() * w, r() * h, 1 + r() * 1.6, 1 + r() * 1.6);
  }
}

/** Cielo vertical a pantalla completa. */
export function paintSky(w: number, h: number): string {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  const r = rng(17);
  // papel marfil
  ctx.fillStyle = '#f6f1e6';
  ctx.fillRect(0, 0, w, h);
  // aguada general: azul grisáceo arriba, crema cálido abajo
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, 'rgba(160,178,190,0.62)');
  g.addColorStop(0.45, 'rgba(184,196,202,0.38)');
  g.addColorStop(0.75, 'rgba(232,218,196,0.45)');
  g.addColorStop(1, 'rgba(226,206,178,0.55)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // variaciones de pigmento (el cielo nunca es plano)
  for (let i = 0; i < 26; i++) {
    const y = r() * h * 0.8;
    wash(ctx, r, r() * w, y, w * (0.25 + r() * 0.35), h * (0.06 + r() * 0.08), y < h * 0.45 ? '150,170,184' : '214,196,170', 0.16, 4);
  }
  // luz cálida (como un amanecer suave)
  const sun = ctx.createRadialGradient(w * 0.7, h * 0.32, 0, w * 0.7, h * 0.32, w * 0.9);
  sun.addColorStop(0, 'rgba(255,244,222,0.55)');
  sun.addColorStop(1, 'rgba(255,244,222,0)');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);
  // bancos de nubes lejanos
  const bank = (cy: number, s: number) => {
    for (let i = 0; i < 9; i++) {
      wash(ctx, r, (i / 8) * w * 1.2 - w * 0.1, cy + (r() - 0.5) * h * 0.03, w * 0.16 * s, h * 0.035 * s, '170,186,196', 0.22, 4);
      wash(ctx, r, (i / 8) * w * 1.2 - w * 0.1, cy - h * 0.018 * s, w * 0.15 * s, h * 0.032 * s, '255,253,247', 0.7, 5);
    }
  };
  void bank;
  // nubes sueltas muy diluidas, a distintas alturas (nunca en franjas)
  for (let i = 0; i < 7; i++) {
    const x = r() * w, y = h * (0.15 + r() * 0.75), s = 0.6 + r() * 0.8;
    wash(ctx, r, x, y + h * 0.015 * s, w * 0.2 * s, h * 0.03 * s, '160,178,190', 0.16, 4);
    wash(ctx, r, x, y, w * 0.18 * s, h * 0.035 * s, '255,253,247', 0.45, 5);
  }
  grain(ctx, w, h, r, (w * h) / 55);
  return c.toDataURL('image/jpeg', 0.86);
}

/** Nube suelta con transparencia (para las capas de parallax). */
export function paintCloud(w: number, h: number, seed: number): string {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  const r = rng(seed);
  const cx = w / 2, base = h * 0.66;
  // sombra azul grisácea en la base
  for (let i = 0; i < 6; i++) {
    wash(ctx, r, cx + (r() - 0.5) * w * 0.55, base + h * 0.04, w * 0.2, h * 0.11, '150,168,182', 0.38, 4);
  }
  // cuerpo: cúmulos
  const puffs = 7 + Math.floor(r() * 4);
  for (let i = 0; i < puffs; i++) {
    const t = i / (puffs - 1);
    const px = w * 0.14 + t * w * 0.72 + (r() - 0.5) * w * 0.05;
    const py = base - Math.sin(t * Math.PI) * h * (0.24 + r() * 0.12) - r() * h * 0.05;
    const pr = w * (0.09 + Math.sin(t * Math.PI) * 0.07 + r() * 0.03);
    wash(ctx, r, px, py, pr, pr * 0.82, '252,249,242', 0.95, 6);
    // sombra suave en el lado derecho/inferior
    wash(ctx, r, px + pr * 0.25, py + pr * 0.3, pr * 0.7, pr * 0.45, '178,190,198', 0.18, 3);
  }
  // luz cálida en las cimas
  for (let i = 0; i < 5; i++) {
    wash(ctx, r, cx + (r() - 0.6) * w * 0.4, base - h * 0.32 + r() * h * 0.06, w * 0.1, h * 0.06, '255,246,230', 0.5, 3);
  }
  grain(ctx, w, h, r, (w * h) / 90, '120,130,140');
  // borrar el granulado fuera de la nube
  ctx.globalCompositeOperation = 'destination-in';
  const m = ctx.createRadialGradient(cx, base - h * 0.1, 0, cx, base - h * 0.1, w * 0.52);
  m.addColorStop(0.7, 'rgba(0,0,0,1)');
  m.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = m;
  ctx.fillRect(0, 0, w, h);
  return c.toDataURL('image/png');
}
