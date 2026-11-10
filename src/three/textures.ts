import * as THREE from 'three';

/**
 * Texturas generadas en el navegador (sin descargas): lino, tela de la tapa
 * con dorado en relieve, cantos de las páginas, guardas, páginas interiores
 * y la acuarela de la página final.
 */

type Ctx = CanvasRenderingContext2D;

function canvas(w: number, h: number): [HTMLCanvasElement, Ctx] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!];
}

function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function tex(c: HTMLCanvasElement, srgb = true, repeat = false) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Trama de tejido (lino) sobre un color base. */
function weave(ctx: Ctx, w: number, h: number, base: string, seed: number, strength = 1, step = 3) {
  const r = rand(seed);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += step) {
    ctx.fillStyle = `rgba(80,60,45,${(0.025 + r() * 0.035) * strength})`;
    ctx.fillRect(0, y, w, 1);
  }
  for (let x = 0; x < w; x += step) {
    ctx.fillStyle = `rgba(255,255,255,${(0.03 + r() * 0.04) * strength})`;
    ctx.fillRect(x, 0, 1, h);
  }
  // fibras irregulares (slubs del lino)
  for (let i = 0; i < (w * h) / 900; i++) {
    const x = r() * w, y = r() * h, l = 6 + r() * 26;
    ctx.fillStyle = `rgba(${r() > 0.5 ? '255,250,240' : '90,70,55'},${0.05 * strength})`;
    if (r() > 0.5) ctx.fillRect(x, y, l, 1);
    else ctx.fillRect(x, y, 1, l);
  }
}

/* ───────────────────────────── Superficie de lino ───────────────────────────── */
export function linenTexture() {
  const [c, ctx] = canvas(512, 512);
  weave(ctx, 512, 512, '#f3eee4', 3, 1.1, 3);
  const t = tex(c, true, true);
  t.repeat.set(6, 6);
  return t;
}

/** Sombra de contacto suave bajo el libro. */
export function contactShadowTexture() {
  const [c, ctx] = canvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  g.addColorStop(0, 'rgba(60,40,30,0.55)');
  g.addColorStop(0.55, 'rgba(60,40,30,0.22)');
  g.addColorStop(1, 'rgba(60,40,30,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return tex(c, false);
}

/** Tejido del raso (normal map de microsurcos a lo largo de la cinta). */
export function satinWeaveNormal() {
  const [c, ctx] = canvas(256, 64);
  ctx.fillStyle = 'rgb(128,128,255)';
  ctx.fillRect(0, 0, 256, 64);
  const r = rand(9);
  for (let y = 0; y < 64; y += 2) {
    const v = 128 + (r() - 0.5) * 30;
    ctx.fillStyle = `rgb(128,${v},255)`;
    ctx.fillRect(0, y, 256, 1);
  }
  const t = tex(c, false, true);
  return t;
}

/* ───────────────────────────── Tapa del libro ───────────────────────────── */

function ornamentFrame(ctx: Ctx, x: number, y: number, w: number, h: number, lw: number) {
  ctx.lineWidth = lw;
  ctx.strokeRect(x, y, w, h);
  ctx.lineWidth = lw * 0.55;
  ctx.strokeRect(x + 14, y + 14, w - 28, h - 28);
  // esquinas con volutas
  const corner = (cx: number, cy: number, sx: number, sy: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(sx, sy);
    ctx.lineWidth = lw * 0.7;
    ctx.beginPath();
    ctx.moveTo(0, 70);
    ctx.bezierCurveTo(0, 30, 30, 0, 70, 0);
    ctx.moveTo(14, 70);
    ctx.bezierCurveTo(14, 40, 40, 14, 70, 14);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(34, 34, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(34, 34, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  corner(x + 24, y + 24, 1, 1);
  corner(x + w - 24, y + 24, -1, 1);
  corner(x + 24, y + h - 24, 1, -1);
  corner(x + w - 24, y + h - 24, -1, -1);
}

function sparkle(ctx: Ctx, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.quadraticCurveTo(x + s * 0.12, y - s * 0.12, x + s, y);
  ctx.quadraticCurveTo(x + s * 0.12, y + s * 0.12, x, y + s);
  ctx.quadraticCurveTo(x - s * 0.12, y + s * 0.12, x - s, y);
  ctx.quadraticCurveTo(x - s * 0.12, y - s * 0.12, x, y - s);
  ctx.fill();
}

/** Dibuja los elementos dorados de la tapa (se reutiliza para color, relieve y brillo). */
function coverArt(ctx: Ctx, W: number, H: number, title: [string, string], kicker: string) {
  ornamentFrame(ctx, 56, 56, W - 112, H - 112, 5);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '500 34px Montserrat, Arial, sans-serif';
  ctx.letterSpacing = '10px';
  ctx.fillText(kicker.toUpperCase(), W / 2 + 5, H * 0.17);
  ctx.letterSpacing = '0px';
  ctx.font = 'italic 400 132px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(title[0], W / 2, H * 0.27);
  ctx.fillText(title[1], W / 2, H * 0.37);
  // pequeño globo emblema
  const cx = W / 2, cy = H * 0.82;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 70);
  ctx.bezierCurveTo(cx + 56, cy - 70, cx + 62, cy - 10, cx + 30, cy + 26);
  ctx.lineTo(cx - 30, cy + 26);
  ctx.bezierCurveTo(cx - 62, cy - 10, cx - 56, cy - 70, cx, cy - 70);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx, cy - 22, 18, 48, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 26, cy + 30); ctx.lineTo(cx - 12, cy + 56);
  ctx.moveTo(cx + 26, cy + 30); ctx.lineTo(cx + 12, cy + 56);
  ctx.stroke();
  ctx.fillRect(cx - 14, cy + 56, 28, 18);
  sparkle(ctx, cx - 120, cy - 40, 16);
  sparkle(ctx, cx + 128, cy - 8, 11);
  sparkle(ctx, cx + 92, cy - 82, 8);
}

export function coverTextures(title: [string, string], kicker: string) {
  const W = 1024, H = 1412;
  // color
  const [c, ctx] = canvas(W, H);
  weave(ctx, W, H, '#dccab0', 5, 1.4, 4);
  // leve viñeta de envejecimiento
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.8);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(120,90,60,0.16)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
  const gold = ctx.createLinearGradient(0, 0, W, H);
  gold.addColorStop(0, '#c9ac78');
  gold.addColorStop(0.5, '#a88a58');
  gold.addColorStop(1, '#c2a26c');
  ctx.strokeStyle = gold;
  ctx.fillStyle = gold;
  coverArt(ctx, W, H, title, kicker);

  // ORM: G = rugosidad, B = metalicidad
  const [o, octx] = canvas(W, H);
  octx.fillStyle = 'rgb(255,235,0)';
  octx.fillRect(0, 0, W, H);
  octx.strokeStyle = 'rgb(255,90,255)';
  octx.fillStyle = 'rgb(255,90,255)';
  coverArt(octx, W, H, title, kicker);

  // relieve: el dorado está grabado (hundido)
  const [b, bctx] = canvas(W, H);
  weave(bctx, W, H, '#888', 6, 3, 4);
  bctx.strokeStyle = '#2a2a2a';
  bctx.fillStyle = '#2a2a2a';
  bctx.filter = 'blur(1.2px)';
  coverArt(bctx, W, H, title, kicker);

  return { map: tex(c), orm: tex(o, false), bump: tex(b, false) };
}

/** Tela lisa para lomo y cantos de la tapa. */
export function clothTexture() {
  const [c, ctx] = canvas(256, 256);
  weave(ctx, 256, 256, '#dccdb6', 8, 1.4, 4);
  const t = tex(c, true, true);
  return t;
}

/** Cantos de las páginas (muchas hojas finas). */
export function pageEdgeTexture() {
  const [c, ctx] = canvas(64, 256);
  const r = rand(4);
  ctx.fillStyle = '#efe7d8';
  ctx.fillRect(0, 0, 64, 256);
  for (let y = 0; y < 256; y += 2) {
    ctx.fillStyle = `rgba(120,95,70,${0.08 + r() * 0.12})`;
    ctx.fillRect(0, y, 64, 1);
  }
  const t = tex(c, true, true);
  t.repeat.set(1, 1);
  return t;
}

/* ───────────────────────────── Páginas interiores ───────────────────────────── */

function paper(ctx: Ctx, W: number, H: number, seed: number, tone = '#f8f3e8') {
  const r = rand(seed);
  ctx.fillStyle = tone;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = `rgba(${r() > 0.5 ? '120,95,70' : '255,255,255'},${0.025 + r() * 0.03})`;
    ctx.fillRect(r() * W, r() * H, 1 + r() * 2, 1 + r() * 2);
  }
  // sombra hacia el lomo
  const g = ctx.createLinearGradient(0, 0, W * 0.16, 0);
  g.addColorStop(0, 'rgba(110,85,60,0.22)');
  g.addColorStop(1, 'rgba(110,85,60,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W * 0.16, H);
}

/** Guardas: papel crema con pequeñas estrellas doradas. */
export function endpaperTexture() {
  const W = 512, H = 706;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = '#eee3d0';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(176,150,105,0.75)';
  for (let y = 24; y < H; y += 48) {
    for (let x = (y / 48) % 2 ? 24 : 48; x < W; x += 48) sparkle(ctx, x, y, 5);
  }
  ctx.fillStyle = 'rgba(168,183,192,0.55)';
  for (let y = 48; y < H; y += 48) {
    for (let x = (y / 48) % 2 ? 48 : 24; x < W; x += 48) {
      ctx.beginPath();
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const t = tex(c);
  return t;
}

/** Portadilla: el título de la historia. */
export function titlePageTexture(title: string, sub: string) {
  const W = 724, H = 1000;
  const [c, ctx] = canvas(W, H);
  paper(ctx, W, H, 12);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#6b5143';
  ctx.font = 'italic 400 66px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(title, W / 2 + 30, H * 0.44);
  ctx.font = '400 20px Montserrat, Arial, sans-serif';
  ctx.letterSpacing = '7px';
  ctx.fillStyle = '#9c8565';
  ctx.fillText(sub.toUpperCase(), W / 2 + 34, H * 0.52);
  ctx.letterSpacing = '0px';
  ctx.fillStyle = '#b5a082';
  sparkle(ctx, W / 2 + 30, H * 0.36, 14);
  return tex(c);
}

/** Reverso casi en blanco con folio. */
export function blankPageTexture(folio: string, seed: number, mirrored = false) {
  const W = 724, H = 1000;
  const [c, ctx] = canvas(W, H);
  paper(ctx, W, H, seed);
  ctx.fillStyle = '#9c8565';
  ctx.textAlign = 'center';
  ctx.font = 'italic 400 26px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(folio, W / 2 + 30, H - 60);
  const t = tex(c);
  if (mirrored) {
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1;
  }
  return t;
}

/** Acuarela de la página final: cielo, nubes y luz. Se funde con la escena ilustrada. */
export function skyPageTexture() {
  const W = 724, H = 1000;
  const [c, ctx] = canvas(W, H);
  paper(ctx, W, H, 21, '#f8f4ec');
  const r = rand(31);
  // aguada de cielo
  const g = ctx.createRadialGradient(W * 0.5, -H * 0.1, 40, W * 0.5, H * 0.1, H * 0.85);
  g.addColorStop(0, 'rgba(168,183,192,0.75)');
  g.addColorStop(0.6, 'rgba(168,183,192,0.25)');
  g.addColorStop(1, 'rgba(168,183,192,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // nubes: aguadas blancas grandes con base azul grisácea muy diluida
  const blob = (x: number, y: number, rx: number, ry: number, col: string, a: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, ry / rx);
    const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    gg.addColorStop(0, `rgba(${col},${a})`);
    gg.addColorStop(0.6, `rgba(${col},${a * 0.7})`);
    gg.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  const cloud = (cx: number, cy: number, s: number) => {
    blob(cx + 6 * s, cy + 34 * s, 170 * s, 46 * s, '168,183,192', 0.16);
    for (let i = 0; i < 9; i++) {
      const x = cx + (r() - 0.5) * 230 * s;
      const y = cy - Math.sin((i / 8) * Math.PI) * 30 * s + (r() - 0.5) * 16 * s;
      blob(x, y, (48 + r() * 40) * s, (40 + r() * 26) * s, '255,253,248', 0.75);
    }
  };
  cloud(W * 0.26, H * 0.2, 1);
  cloud(W * 0.8, H * 0.36, 0.85);
  cloud(W * 0.36, H * 0.63, 1.05);
  cloud(W * 0.86, H * 0.82, 0.75);
  ctx.fillStyle = 'rgba(181,160,130,0.9)';
  sparkle(ctx, W * 0.62, H * 0.14, 9);
  sparkle(ctx, W * 0.2, H * 0.44, 7);
  sparkle(ctx, W * 0.7, H * 0.55, 6);
  return tex(c);
}

/** Espera a que las fuentes estén listas antes de pintar textos en canvas. */
export async function fontsReady() {
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('italic 400 64px "Cormorant Garamond"'),
        document.fonts.load('400 20px Montserrat'),
        document.fonts.load('500 20px Montserrat'),
      ]),
      new Promise((r) => setTimeout(r, 1800)),
    ]);
  } catch {
    /* noop */
  }
}
