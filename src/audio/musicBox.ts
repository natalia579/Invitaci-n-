/**
 * Caja musical generada en el navegador (Web Audio API).
 * Melodía original en 3/4 compuesta para esta invitación — sin derechos de terceros.
 * Se usa sólo cuando no hay un archivo de audio configurado en `invitation.music.src`.
 */

type Note = [midi: number, beat: number, dur: number, vel?: number];

const BPM = 66;
const BEAT = 60 / BPM;
const BAR = 3;

// Melodía (Fa mayor). [nota MIDI, pulso de inicio, duración en pulsos]
const MELODY: Note[] = [
  // frase A
  [69, 0, 1.5], [67, 1.5, 0.5], [65, 2, 1],
  [72, 3, 2], [69, 5, 1],
  [70, 6, 1], [69, 7, 1], [67, 8, 1],
  [69, 9, 3],
  [65, 12, 1.5], [67, 13.5, 0.5], [69, 14, 1],
  [74, 15, 2], [72, 17, 1],
  [70, 18, 1], [67, 19, 1], [64, 20, 1],
  [65, 21, 3],
  // frase B
  [72, 24, 1.5], [74, 25.5, 0.5], [72, 26, 1],
  [69, 27, 2], [65, 29, 1],
  [67, 30, 1], [69, 31, 1], [70, 32, 1],
  [72, 33, 3],
  [74, 36, 1.5], [72, 37.5, 0.5], [70, 38, 1],
  [69, 39, 1], [67, 40, 1], [65, 41, 1],
  [67, 42, 2], [64, 44, 1],
  [65, 45, 3],
];

// Acordes por compás: [bajo, tercera, quinta]
const CHORDS: [number, number, number][] = [
  [53, 57, 60], [53, 57, 60], [55, 58, 62], [53, 57, 60],
  [53, 57, 60], [58, 62, 65], [48, 55, 58], [53, 57, 60],
  [53, 57, 60], [53, 57, 60], [48, 55, 58], [48, 52, 55],
  [58, 62, 65], [53, 57, 60], [48, 55, 58], [53, 57, 60],
];

const LOOP_BEATS = CHORDS.length * BAR;

const freq = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

export class MusicBox {
  private ctx: AudioContext;
  private master: GainNode;
  private wet: GainNode;
  private timer: number | null = null;
  private startTime = 0;
  private nextIndex = 0;
  private events: { t: number; midi: number; vel: number; dur: number }[] = [];
  private loop = 0;

  constructor(volume = 0.5) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);

    // Reverberación suave (impulso sintético)
    const conv = this.ctx.createConvolver();
    conv.buffer = this.impulse(2.8, 2.6);
    this.wet = this.ctx.createGain();
    this.wet.gain.value = 0.42;
    this.wet.connect(conv);
    conv.connect(this.master);
    this.targetVolume = volume;

    // Secuencia: melodía una octava arriba (timbre de caja musical) + acompañamiento
    for (const [m, b, d, v] of MELODY) this.events.push({ t: b, midi: m + 12, vel: v ?? 0.9, dur: d });
    CHORDS.forEach(([bass, third, fifth], bar) => {
      const b0 = bar * BAR;
      this.events.push({ t: b0, midi: bass, vel: 0.42, dur: 3 });
      this.events.push({ t: b0 + 1, midi: third + 12, vel: 0.26, dur: 1 });
      this.events.push({ t: b0 + 2, midi: fifth + 12, vel: 0.24, dur: 1 });
    });
    this.events.sort((a, b) => a.t - b.t);
  }

  private targetVolume: number;
  private pauseTimeout: number | null = null;

  get state() {
    return this.ctx.state;
  }

  private impulse(seconds: number, decay: number) {
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = this.ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  private pluck(time: number, midi: number, vel: number, durBeats: number) {
    const ctx = this.ctx;
    const f = freq(midi);
    const out = ctx.createGain();
    const dry = ctx.createGain();
    dry.gain.value = 0.7;
    out.connect(dry);
    dry.connect(this.master);
    out.connect(this.wet);

    const ring = Math.min(3.2, Math.max(1.4, durBeats * BEAT * 1.6)) * (midi > 72 ? 0.85 : 1.15);
    const peak = 0.16 * vel;
    out.gain.setValueAtTime(0.0001, time);
    out.gain.exponentialRampToValueAtTime(peak, time + 0.006);
    out.gain.exponentialRampToValueAtTime(0.0001, time + ring);

    // Parciales de una lengüeta metálica (ligeramente inarmónicos)
    const partials: [number, number][] = [[1, 1], [2.0, 0.22], [3.01, 0.06], [5.4, 0.035]];
    for (const [ratio, amp] of partials) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f * ratio;
      o.detune.value = (Math.random() - 0.5) * 4;
      g.gain.setValueAtTime(amp, time);
      // los armónicos altos se apagan antes
      g.gain.exponentialRampToValueAtTime(Math.max(0.0001, amp * 0.02), time + ring / (ratio * 0.9));
      o.connect(g);
      g.connect(out);
      o.start(time);
      o.stop(time + ring + 0.05);
    }
  }

  private schedule = () => {
    const ahead = this.ctx.currentTime + 0.6;
    for (;;) {
      if (this.nextIndex >= this.events.length) {
        this.nextIndex = 0;
        this.loop += 1;
      }
      const ev = this.events[this.nextIndex];
      // pausa de un compás entre repeticiones
      const t = this.startTime + (ev.t + this.loop * (LOOP_BEATS + BAR)) * BEAT;
      if (t > ahead) break;
      // pequeña humanización
      const jitter = (Math.random() - 0.5) * 0.018;
      if (t >= this.ctx.currentTime - 0.05) this.pluck(t + jitter, ev.midi, ev.vel * (0.92 + Math.random() * 0.12), ev.dur);
      this.nextIndex += 1;
    }
  };

  async play(): Promise<boolean> {
    try {
      // En iOS, resume() sólo funciona dentro de un gesto del usuario.
      await Promise.race([this.ctx.resume(), new Promise((r) => setTimeout(r, 350))]);
    } catch {
      /* noop */
    }
    if (this.pauseTimeout !== null) {
      clearTimeout(this.pauseTimeout);
      this.pauseTimeout = null;
    }
    if (this.ctx.state !== 'running') return false;
    if (this.timer === null) {
      this.startTime = this.ctx.currentTime + 0.15;
      this.nextIndex = 0;
      this.loop = 0;
      this.timer = window.setInterval(this.schedule, 120);
      this.schedule();
    }
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(this.targetVolume, now + 1.6);
    return true;
  }

  pause() {
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 0.5);
    this.pauseTimeout = window.setTimeout(() => {
      this.pauseTimeout = null;
      if (this.timer !== null) {
        clearInterval(this.timer);
        this.timer = null;
      }
      void this.ctx.suspend();
    }, 550);
  }
}
