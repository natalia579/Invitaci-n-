import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RibbonStrip, type Frame, ease, easeIn, span } from './ribbon';
import {
  blankPageTexture,
  clothTexture,
  contactShadowTexture,
  coverTextures,
  endpaperTexture,
  fontsReady,
  linenTexture,
  pageEdgeTexture,
  satinWeaveNormal,
  skyPageTexture,
  titlePageTexture,
} from './textures';

/**
 * ESCENA 3D DE LA APERTURA (WebGL, Three.js)
 *
 *  Libro de tapa dura sobre lino, iluminado como en un estudio.
 *  Una cinta de raso (geometría 3D real) lo envuelve con un lazo que:
 *   1. se desata (las gazas se recogen, las colas se alargan),
 *   2. pierde tensión y se desliza fuera del libro.
 *  La tapa gira sobre el lomo, pasan dos páginas y la cámara entra
 *  en la página final, una acuarela de cielo que continúa en la web.
 */

// Línea de tiempo (segundos)
export const TL = {
  untieL: [0.9, 1.9],
  untieR: [1.35, 2.35],
  knot: [2.1, 2.6],
  release: [2.3, 3.7],
  cover: [3.2, 5.0],
  page1: [4.25, 5.55],
  page2: [4.8, 6.15],
  camera: [4.9, 7.4],
  handoff: 6.9, // la web toma el relevo (fundido del canvas)
  end: 7.8,
} as const;

// Medidas del libro
const W = 1.0;
const D = 1.38;
const T = 0.16;
const BOARD = 0.018;
const PAGE_X0 = -0.47;
const PAGE_W = 0.955;
const PAGE_D = 1.34;
const ZC = 0.17; // posición de la cinta (hacia abajo de la tapa)
const RW = 0.078; // ancho de la cinta

const UP = new THREE.Vector3(0, 1, 0);
const Z = new THREE.Vector3(0, 0, 1);

export type BookSceneOptions = {
  canvas: HTMLCanvasElement;
  title: [string, string];
  kicker: string;
  pageTitle: string;
  pageSub: string;
  onHandoff: () => void;
  onEnd: () => void;
};

export class BookScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(30, 1, 0.05, 30);
  private clock = new THREE.Clock(false);
  private raf = 0;
  private opts: BookSceneOptions;
  private disposed = false;
  private handed = false;

  private coverPivot = new THREE.Group();
  private pages: { geo: THREE.BufferGeometry; pos: Float32Array; cols: number }[] = [];
  private ribbons: Record<string, RibbonStrip> = {};
  private camStart = { pos: new THREE.Vector3(), target: new THREE.Vector3() };
  private camEnd = { pos: new THREE.Vector3(), target: new THREE.Vector3() };

  constructor(opts: BookSceneOptions) {
    this.opts = opts;
    const mobile = Math.min(window.innerWidth, window.innerHeight) < 700;
    this.renderer = new THREE.WebGLRenderer({ canvas: opts.canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 2 : 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.92;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene.background = new THREE.Color('#efe9de');
    this.camera.up.set(0, 0, -1);
  }

  async init() {
    await fontsReady();
    const r = this.renderer;
    const pmrem = new THREE.PMREMGenerator(r);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.42;
    pmrem.dispose();

    this.buildLights();
    this.buildTable();
    this.buildBook();
    this.buildRibbon();
    this.resize();
    window.addEventListener('resize', this.resize);
    // primer cuadro en reposo, ya compilado
    this.update(0);
    r.compile(this.scene, this.camera);
    r.render(this.scene, this.camera);
  }

  start() {
    this.clock.start();
    const loop = () => {
      if (this.disposed) return;
      const t = this.clock.getElapsedTime();
      this.update(t);
      this.renderer.render(this.scene, this.camera);
      if (!this.handed && t >= TL.handoff) {
        this.handed = true;
        this.opts.onHandoff();
      }
      if (t >= TL.end) {
        this.opts.onEnd();
        return;
      }
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.resize);
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      for (const mat of mats) {
        for (const v of Object.values(mat)) if (v instanceof THREE.Texture) v.dispose();
        mat.dispose();
      }
    });
    this.scene.environment?.dispose();
    this.renderer.dispose();
  }

  /* ─────────────────────────────── construcción ─────────────────────────────── */

  private buildLights() {
    const hemi = new THREE.HemisphereLight('#fff7ec', '#bba78d', 0.42);
    this.scene.add(hemi);
    const key = new THREE.DirectionalLight('#ffeed6', 2.1);
    key.position.set(-1.9, 2.6, 0.9);
    key.castShadow = true;
    const mobile = Math.min(window.innerWidth, window.innerHeight) < 700;
    key.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
    key.shadow.camera.left = -1.3;
    key.shadow.camera.right = 1.3;
    key.shadow.camera.top = 1.3;
    key.shadow.camera.bottom = -1.3;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 8;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.01;
    key.shadow.radius = 5;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight('#e9eef2', 0.35);
    rim.position.set(2, 1.4, -1.5);
    this.scene.add(rim);
  }

  private buildTable() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.MeshStandardMaterial({ map: linenTexture(), roughness: 0.95, envMapIntensity: 0.3 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const contact = new THREE.Mesh(
      new THREE.PlaneGeometry(W * 1.5, D * 1.3),
      new THREE.MeshBasicMaterial({ map: contactShadowTexture(), transparent: true, depthWrite: false }),
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = 0.001;
    this.scene.add(contact);
  }

  private buildBook() {
    const cloth = clothTexture();
    const clothMat = new THREE.MeshStandardMaterial({ map: cloth, roughness: 0.88, envMapIntensity: 0.4 });
    const edge = pageEdgeTexture();
    const edgeMatZ = new THREE.MeshStandardMaterial({ map: edge, roughness: 0.9, envMapIntensity: 0.3 });
    const edgeTexX = edge.clone();
    edgeTexX.needsUpdate = true;
    const edgeMatX = new THREE.MeshStandardMaterial({ map: edgeTexX, roughness: 0.9, envMapIntensity: 0.3 });
    const sky = skyPageTexture();
    const topMat = new THREE.MeshStandardMaterial({ map: sky, roughness: 0.92, envMapIntensity: 0.35 });

    // tapa trasera
    const back = new THREE.Mesh(new THREE.BoxGeometry(W + 0.01, BOARD, D + 0.01), clothMat);
    back.position.set(0.005, BOARD / 2, 0);
    back.castShadow = back.receiveShadow = true;
    this.scene.add(back);

    // bloque de páginas (la cara superior es la acuarela final)
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(PAGE_W, T - BOARD * 2, PAGE_D),
      [edgeMatX, edgeMatX, topMat, edgeMatZ, edgeMatZ, edgeMatZ],
    );
    block.position.set(PAGE_X0 + PAGE_W / 2, T / 2, 0);
    block.castShadow = block.receiveShadow = true;
    this.scene.add(block);

    // lomo redondeado
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(T / 2, T / 2, D + 0.01, 32, 1, false, Math.PI, Math.PI), clothMat);
    spine.rotation.x = Math.PI / 2;
    spine.scale.x = 0.32; // lomo apenas redondeado
    spine.position.set(-W / 2 + 0.006, T / 2, 0);
    spine.castShadow = true;
    this.scene.add(spine);

    // tapa delantera (gira sobre el lomo)
    const { map, orm, bump } = coverTextures(this.opts.title, this.opts.kicker);
    const coverMat = new THREE.MeshStandardMaterial({
      map,
      roughnessMap: orm,
      metalnessMap: orm,
      roughness: 1,
      metalness: 1,
      bumpMap: bump,
      bumpScale: 1.6,
      envMapIntensity: 0.9,
    });
    const endMat = new THREE.MeshStandardMaterial({ map: endpaperTexture(), roughness: 0.9, envMapIntensity: 0.3 });
    const front = new THREE.Mesh(new THREE.BoxGeometry(W + 0.01, BOARD, D + 0.01), [
      clothMat, clothMat, coverMat, endMat, clothMat, clothMat,
    ]);
    // el mapa de la tapa se ve “desde arriba”: orientación correcta en +Y
    front.position.set((W + 0.01) / 2, -BOARD / 2, 0);
    front.castShadow = front.receiveShadow = true;
    this.coverPivot.position.set(-W / 2, T, 0);
    this.coverPivot.add(front);
    this.scene.add(this.coverPivot);

    // dos hojas que pasan
    const p1f = new THREE.MeshStandardMaterial({ map: titlePageTexture(this.opts.pageTitle, this.opts.pageSub), roughness: 0.92, envMapIntensity: 0.3, side: THREE.FrontSide });
    const p1b = new THREE.MeshStandardMaterial({ map: blankPageTexture('i', 41, true), roughness: 0.92, envMapIntensity: 0.3, side: THREE.BackSide });
    const p2f = new THREE.MeshStandardMaterial({ map: blankPageTexture('', 42), roughness: 0.92, envMapIntensity: 0.3, side: THREE.FrontSide });
    const p2b = new THREE.MeshStandardMaterial({ map: blankPageTexture('ii', 43, true), roughness: 0.92, envMapIntensity: 0.3, side: THREE.BackSide });
    [
      [p1f, p1b, 2],
      [p2f, p2b, 1],
    ].forEach(([f, b, layer]) => {
      const cols = 28;
      const geo = new THREE.PlaneGeometry(PAGE_W, PAGE_D, cols, 1);
      geo.rotateX(-Math.PI / 2);
      const pos = geo.attributes.position.array as Float32Array;
      const m1 = new THREE.Mesh(geo, f as THREE.Material);
      const m2 = new THREE.Mesh(geo, b as THREE.Material);
      for (const m of [m1, m2]) {
        m.castShadow = true;
        m.receiveShadow = true;
        m.frustumCulled = false;
        m.position.y = T - BOARD + 0.0012 * (layer as number);
        this.scene.add(m);
      }
      this.pages.push({ geo, pos, cols });
    });
    // las hojas deben ir en orden: la primera queda encima
    this.pages.reverse();
  }

  private buildRibbon() {
    const satin = new THREE.MeshPhysicalMaterial({
      color: '#3a2218',
      roughness: 0.4,
      metalness: 0,
      sheen: 1,
      sheenColor: new THREE.Color('#a57a62'),
      sheenRoughness: 0.35,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      anisotropy: 0.65,
      normalMap: satinWeaveNormal(),
      normalScale: new THREE.Vector2(0.35, 0.35),
      envMapIntensity: 1.6,
      side: THREE.DoubleSide,
    });
    for (const k of ['bandL', 'bandR', 'loopL', 'loopR', 'tailL', 'tailR', 'knot']) {
      this.ribbons[k] = new RibbonStrip(satin, k.startsWith('band') ? 80 : 56);
      this.scene.add(this.ribbons[k].mesh);
    }
  }

  /* ─────────────────────────────── animación ─────────────────────────────── */

  private update(t: number) {
    this.updateRibbon(t);
    // tapa
    const c = ease(span(t, TL.cover[0], TL.cover[1]));
    this.coverPivot.rotation.z = c * Math.PI * 0.985;
    // hojas
    this.flipPage(0, ease(span(t, TL.page1[0], TL.page1[1])), 0.0026);
    this.flipPage(1, ease(span(t, TL.page2[0], TL.page2[1])), 0.0014);
    // cámara
    const k = ease(span(t, TL.camera[0], TL.camera[1]));
    const breathe = Math.sin(t * 0.6) * 0.006 * (1 - k);
    this.camera.position.lerpVectors(this.camStart.pos, this.camEnd.pos, k);
    this.camera.position.x += breathe;
    const target = new THREE.Vector3().lerpVectors(this.camStart.target, this.camEnd.target, k);
    this.camera.lookAt(target);
  }

  /** Curvatura de la hoja al pasar: cada columna gira un poco más que la anterior. */
  private flipPage(i: number, p: number, lift: number) {
    const page = this.pages[i];
    const { pos, cols } = page;
    const theta = p * Math.PI;
    const curl = Math.sin(p * Math.PI) * 0.85;
    const du = PAGE_W / cols;
    let x = PAGE_X0, y = 0;
    for (let c = 0; c <= cols; c++) {
      const u = c / cols;
      if (c > 0) {
        const phi = Math.min(Math.PI, theta * (1 + curl * u * 0.9) + Math.sin(u * Math.PI) * 0.06 * Math.sin(p * Math.PI));
        x += Math.cos(phi) * du;
        y += Math.sin(phi) * du;
      }
      // dos filas (z = ±PAGE_D/2) por columna
      for (let row = 0; row < 2; row++) {
        const k = (row * (cols + 1) + c) * 3;
        pos[k] = x;
        pos[k + 1] = y + lift * (1 - p) + (p > 0 && p < 1 ? 0.004 : 0);
      }
    }
    page.geo.attributes.position.needsUpdate = true;
    page.geo.computeVertexNormals();
  }

  private updateRibbon(t: number) {
    const top = T + 0.0035;
    const r = this.ribbons;
    const sL = 1 - ease(span(t, TL.untieL[0], TL.untieL[1]));
    const sR = 1 - ease(span(t, TL.untieR[0], TL.untieR[1]));
    const rel = span(t, TL.release[0], TL.release[1]);
    const relE = easeIn(rel);
    const loose = 1 - Math.min(sL, sR); // tensión que se pierde
    const K = new THREE.Vector3(0, top, ZC);

    // ── banda horizontal (dos mitades que parten del nudo) ──
    const band = (dir: 1 | -1): Frame[] => {
      const f: Frame[] = [];
      const slide = relE * 1.9 * dir;
      const n = 22;
      for (let i = 0; i <= n; i++) {
        const u = i / n;
        // recorrido: sobre la tapa → canto → bajo el libro
        let x: number, y: number;
        if (u < 0.7) {
          x = (u / 0.7) * (W / 2 + 0.012);
          y = top;
        } else {
          const a = ((u - 0.7) / 0.3) * (Math.PI / 2);
          x = W / 2 + 0.012 + Math.sin(a) * 0.02;
          y = top - (1 - Math.cos(a)) * 0 - ((u - 0.7) / 0.3) * (T + 0.002);
        }
        x *= dir;
        // al soltarse: se levanta en ondas y se desliza hacia afuera
        const wave = Math.sin(u * 9 - t * 7) * 0.018 * rel + Math.sin(u * 3.2 + 1) * 0.008 * loose;
        const lift = Math.sin(Math.PI * Math.min(1, rel * 1.3)) * 0.09 * (1 - u * 0.4) + loose * 0.003 * Math.sin(u * Math.PI);
        const yy = Math.max(y, 0.002) + wave + lift + (u >= 0.7 ? relE * 0.04 : 0);
        const zz = ZC + Math.sin(u * 6 + t * 3) * 0.02 * rel;
        f.push({ p: new THREE.Vector3(x + slide, yy, zz), b: Z.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.sin(u * 8 + t * 5) * 0.5 * rel) });
      }
      return f;
    };
    r.bandL.update(band(-1), RW, 0, 0.003);
    r.bandR.update(band(1), RW, 0, 0.003);

    // ── gazas del lazo (curvas en el plano vertical, ancho a lo largo de Z) ──
    const loop = (dir: 1 | -1, s: number, yaw: number): Frame[] => {
      const pts: [number, number][] = [
        [0, 0.016], [0.05, 0.05], [0.12, 0.085], [0.21, 0.098], [0.285, 0.078], [0.31, 0.04], [0.28, 0.012], [0.2, 0.004], [0.11, 0.004], [0.04, 0.008], [0.0, 0.014],
      ];
      const rot = new THREE.Quaternion().setFromAxisAngle(UP, yaw * dir);
      return pts.map(([x, y], i) => {
        const p = new THREE.Vector3(x * dir * s, y * (0.35 + 0.65 * s), 0).applyQuaternion(rot).add(K);
        p.y += 0.002;
        // la gaza se abre en abanico hacia sus bordes
        const b = Z.clone().applyAxisAngle(UP, yaw * dir + (i / pts.length - 0.5) * 0.25 * dir).normalize();
        return { p, b };
      });
    };
    r.loopL.visible = sL > 0.04;
    r.loopR.visible = sR > 0.04;
    if (sL > 0.04) r.loopL.update(loop(-1, sL, 0.42), RW * (0.95 + 0.1 * sL), 0, 0.008);
    if (sR > 0.04) r.loopR.update(loop(1, sR, 0.36), RW * (0.95 + 0.1 * sR), 0, 0.008);

    // ── colas: se alargan cuando se recogen las gazas y luego se van con la banda ──
    const tail = (dir: 1 | -1, s: number): Frame[] => {
      const len = 0.26 + (1 - s) * 0.16;
      const f: Frame[] = [];
      const n = 10;
      const slide = relE * 1.9 * dir;
      for (let i = 0; i <= n; i++) {
        const u = i / n;
        const ang = (0.72 + Math.sin(u * Math.PI) * 0.22 - u * 0.12) * dir;
        const x = Math.sin(ang) * u * len;
        const z = ZC + 0.01 + Math.cos(ang) * u * len;
        const flutter = Math.sin(u * 7 - t * 6) * 0.02 * rel;
        const y = top + 0.003 + (1 - u) * 0.008 + Math.sin(u * Math.PI) * 0.006 + flutter + Math.sin(Math.PI * Math.min(1, rel * 1.3)) * 0.07 * u;
        const tan = new THREE.Vector3(Math.sin(ang), 0, Math.cos(ang)).normalize();
        const b = new THREE.Vector3().crossVectors(UP, tan).normalize().applyAxisAngle(tan, Math.sin(u * 2.4) * 0.35 * dir);
        f.push({ p: new THREE.Vector3(x + slide * (0.5 + u * 0.5), y, z + relE * 0.25 * u), b });
      }
      return f;
    };
    r.tailL.update(tail(-1, sL), RW * 0.96, 0.03, 0.003);
    r.tailR.update(tail(1, sR), RW * 0.96, 0.03, 0.003);

    // ── nudo: un pequeño cilindro de cinta que se afloja ──
    const kS = 1 - ease(span(t, TL.knot[0], TL.knot[1]));
    r.knot.visible = kS > 0.05 && rel < 0.2;
    if (r.knot.visible) {
      const f: Frame[] = [];
      for (let i = 0; i <= 14; i++) {
        const a = -Math.PI * 0.15 + (i / 14) * Math.PI * 1.3;
        f.push({
          p: new THREE.Vector3(0, top + 0.02 * kS + Math.sin(a) * 0.026 * kS, ZC - Math.cos(a) * 0.03 * kS),
          b: new THREE.Vector3(1, 0, 0),
        });
      }
      r.knot.update(f, RW * 0.72, 0, 0.005);
    }
    const gone = rel >= 1;
    r.bandL.visible = r.bandR.visible = r.tailL.visible = r.tailR.visible = !gone;
  }

  /* ─────────────────────────────── cámara ─────────────────────────────── */

  private resize = () => {
    const el = this.renderer.domElement;
    const w = el.clientWidth || window.innerWidth;
    const h = el.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    this.camera.aspect = aspect;
    const tanH = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    // encuadre inicial: todo el libro con aire alrededor
    const needW = 1.48, needD = 1.85;
    const dist = Math.max(needW / (2 * tanH * aspect), needD / (2 * tanH));
    const dir = new THREE.Vector3(0, 1, 0.68).normalize();
    this.camStart.target.set(0, T * 0.5, 0.03);
    this.camStart.pos.copy(this.camStart.target).addScaledVector(dir, dist);
    // encuadre final: la página derecha llena la pantalla
    const pageCx = PAGE_X0 + PAGE_W * 0.53;
    const fillW = 0.62, fillD = 0.95;
    const d2 = Math.min(fillW / (2 * tanH * aspect), fillD / (2 * tanH));
    this.camEnd.target.set(pageCx, T, 0.02);
    this.camEnd.pos.set(pageCx, T + d2, 0.0205);
    this.camera.updateProjectionMatrix();
  };
}

/** ¿Este dispositivo puede mostrar la escena 3D? */
export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
