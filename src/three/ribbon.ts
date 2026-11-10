import * as THREE from 'three';

/**
 * Cinta de raso como geometría 3D real:
 * se “barre” una sección transversal ligeramente curva a lo largo de una curva.
 * La geometría se reconstruye en cada cuadro mientras se anima.
 */

const ACROSS = 6; // vértices a lo ancho (sección curva → volumen de tela)

export type Frame = { p: THREE.Vector3; b: THREE.Vector3 };

export class RibbonStrip {
  readonly mesh: THREE.Mesh;
  private geo: THREE.BufferGeometry;
  private pos: Float32Array;
  private samples: number;

  constructor(material: THREE.Material, samples = 64) {
    this.samples = samples;
    this.geo = new THREE.BufferGeometry();
    const n = samples * ACROSS;
    this.pos = new Float32Array(n * 3);
    const uv = new Float32Array(n * 2);
    const idx: number[] = [];
    for (let i = 0; i < samples; i++) {
      for (let j = 0; j < ACROSS; j++) {
        const k = i * ACROSS + j;
        uv[k * 2] = (i / (samples - 1)) * 6; // u a lo largo (repetición del tejido)
        uv[k * 2 + 1] = j / (ACROSS - 1);
        if (i < samples - 1 && j < ACROSS - 1) {
          const a = k, b = k + 1, c = k + ACROSS, d = k + ACROSS + 1;
          idx.push(a, c, b, b, c, d);
        }
      }
    }
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    this.geo.setIndex(idx);
    this.mesh = new THREE.Mesh(this.geo, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
  }

  /**
   * @param frames   puntos de la curva con su dirección de ancho (b)
   * @param width    ancho de la cinta
   * @param notch    profundidad del corte en “cola de golondrina” en el extremo final (0 = recto)
   * @param cup      curvatura de la sección (la tela nunca es perfectamente plana)
   */
  update(frames: Frame[], width: number, notch = 0, cup = 0.0035) {
    const S = this.samples;
    const pts = resample(frames, S);
    const t = new THREE.Vector3();
    const nrm = new THREE.Vector3();
    for (let i = 0; i < S; i++) {
      const { p, b } = pts[i];
      const prev = pts[Math.max(0, i - 1)].p;
      const next = pts[Math.min(S - 1, i + 1)].p;
      t.subVectors(next, prev).normalize();
      nrm.crossVectors(b, t).normalize();
      for (let j = 0; j < ACROSS; j++) {
        const s = j / (ACROSS - 1) - 0.5; // -0.5 .. 0.5
        const k = (i * ACROSS + j) * 3;
        const lift = (1 - (2 * s) ** 2) * cup; // centro un poco elevado
        let back = 0;
        if (notch > 0 && i === S - 1) back = notch * (1 - Math.abs(s) * 2); // centro retrocede
        this.pos[k] = p.x + b.x * s * width + nrm.x * lift - t.x * back;
        this.pos[k + 1] = p.y + b.y * s * width + nrm.y * lift - t.y * back;
        this.pos[k + 2] = p.z + b.z * s * width + nrm.z * lift - t.z * back;
      }
    }
    (this.geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    this.geo.computeVertexNormals();
    this.geo.computeBoundingSphere();
  }

  set visible(v: boolean) {
    this.mesh.visible = v;
  }
}

/** Remuestrea una polilínea (con su vector de ancho) en `count` puntos usando Catmull-Rom. */
function resample(frames: Frame[], count: number): Frame[] {
  const curve = new THREE.CatmullRomCurve3(frames.map((f) => f.p), false, 'centripetal', 0.5);
  const lengths = curve.getLengths(frames.length * 8);
  const total = lengths[lengths.length - 1] || 1;
  const out: Frame[] = [];
  for (let i = 0; i < count; i++) {
    const u = i / (count - 1);
    const p = curve.getPointAt(u);
    // interpola el vector de ancho según la posición relativa
    const f = u * (frames.length - 1);
    const i0 = Math.floor(f), i1 = Math.min(frames.length - 1, i0 + 1);
    const b = frames[i0].b.clone().lerp(frames[i1].b, f - i0).normalize();
    out.push({ p, b });
  }
  void total;
  return out;
}

/* ───────────────────────────── utilidades de animación ───────────────────────────── */

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const ease = (x: number) => {
  const t = clamp01(x);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
export const easeIn = (x: number) => Math.pow(clamp01(x), 2.2);
/** progreso 0..1 de `t` dentro de [a, b] */
export const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
