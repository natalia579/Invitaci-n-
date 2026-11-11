/**
 * Simulador local de Google Sheets + Apps Script para probar docs/google-sheets/Codigo.gs
 * SIN cuenta de Google. Ejecuta el código real del script dentro de una hoja en memoria.
 *
 *   node tools/rsvp-mock.mjs test      → pruebas automáticas
 *   node tools/rsvp-mock.mjs serve     → servidor local (http://localhost:8787/exec) para probar la invitación
 */
import fs from 'node:fs';
import http from 'node:http';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const CODE = fs.readFileSync(fileURLToPath(new URL('../docs/google-sheets/Codigo.gs', import.meta.url)), 'utf8');

function colNum(letters) {
  return letters.split('').reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0);
}

class Sheet {
  constructor(name) {
    this.name = name;
    this.cells = new Map(); // "r,c" -> {v, f}
    this.frozen = 0;
  }
  getName() { return this.name; }
  key(r, c) { return `${r},${c}`; }
  get(r, c) { return this.cells.get(this.key(r, c)) ?? { v: '', f: '' }; }
  set(r, c, cell) { this.cells.set(this.key(r, c), cell); }
  getLastRow() {
    let m = 0;
    for (const [k, cell] of this.cells) if (cell.v !== '' || cell.f) m = Math.max(m, Number(k.split(',')[0]));
    return m;
  }
  setFrozenRows(n) { this.frozen = n; }
  getRange(a, b, nr = 1, nc = 1) {
    if (typeof a === 'string') {
      const m = a.match(/^([A-Z]+)(\d*)(?::([A-Z]+)(\d*))?$/);
      const c1 = colNum(m[1]), r1 = Number(m[2] || 1);
      const c2 = m[3] ? colNum(m[3]) : c1, r2 = m[4] ? Number(m[4]) : m[2] ? r1 : 1000;
      return new Range(this, r1, c1, r2 - r1 + 1, c2 - c1 + 1);
    }
    return new Range(this, a, b, nr, nc);
  }
}

class Range {
  constructor(sheet, r, c, nr, nc) { Object.assign(this, { sheet, r, c, nr, nc }); }
  getSheet() { return this.sheet; }
  getRow() { return this.r; }
  getColumn() { return this.c; }
  getNumRows() { return this.nr; }
  getValue() { return this.sheet.get(this.r, this.c).v; }
  getValues() {
    return Array.from({ length: this.nr }, (_, i) => Array.from({ length: this.nc }, (_, j) => this.sheet.get(this.r + i, this.c + j).v));
  }
  setValue(v) { this.sheet.set(this.r, this.c, { v, f: '' }); return this; }
  setValues(rows) {
    rows.forEach((row, i) => row.forEach((v, j) => {
      const isF = typeof v === 'string' && v.startsWith('=');
      this.sheet.set(this.r + i, this.c + j, isF ? { v: '', f: v } : { v, f: '' });
    }));
    return this;
  }
  setFormula(f) { this.sheet.set(this.r, this.c, { v: '', f }); return this; }
  getFormula() { return this.sheet.get(this.r, this.c).f; }
  setFontWeight() { return this; }
  setNumberFormat() { return this; }
}

export function createEnv() {
  const sheets = new Map();
  const ss = {
    tz: 'UTC',
    getSheetByName: (n) => sheets.get(n) ?? null,
    insertSheet: (n) => { const s = new Sheet(n); sheets.set(n, s); return s; },
    setSpreadsheetTimeZone(tz) { this.tz = tz; },
  };
  const ctx = {
    SpreadsheetApp: { getActiveSpreadsheet: () => ss },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput: (text) => ({ text, mime: 'text/plain', setMimeType(m) { this.mime = m; return this; }, getContent() { return this.text; } }),
    },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    Utilities: { getUuid: () => crypto.randomUUID() },
    console,
  };
  vm.createContext(ctx);
  vm.runInContext(CODE, ctx);
  const api = {
    ss, sheets, ctx,
    get: (id) => JSON.parse(ctx.doGet({ parameter: { id } }).getContent()),
    post: (body) => JSON.parse(ctx.doPost({ postData: { contents: typeof body === 'string' ? body : JSON.stringify(body) } }).getContent()),
    addGuests(names) {
      const sh = ss.getSheetByName('Invitados');
      const start = sh.getLastRow() + 1;
      names.forEach((n, i) => sh.getRange(start + i, 1).setValue(n));
      ctx.onEdit({ range: sh.getRange(start, 1, names.length, 1) });
      return names.map((_, i) => sh.getRange(start + i, 2).getValue());
    },
    rows() {
      const sh = ss.getSheetByName('Invitados');
      return sh.getRange(2, 1, Math.max(0, sh.getLastRow() - 1), 7).getValues();
    },
  };
  ctx.configurar();
  return api;
}

function runTests() {
  const t = createEnv();
  const results = [];
  const check = (name, fn) => {
    try { fn(); results.push(['OK ', name]); } catch (e) { results.push(['FALLA', `${name} — ${e.message}`]); }
  };

  check('configurar() crea pestañas, encabezados, zona horaria y resumen', () => {
    for (const n of ['Invitados', 'Configuración', 'Resumen']) assert.ok(t.ss.getSheetByName(n));
    assert.equal(t.ss.tz, 'America/Bogota');
    assert.equal(t.ss.getSheetByName('Invitados').getRange(1, 1).getValue(), 'Nombre del invitado');
    assert.match(t.ss.getSheetByName('Resumen').getRange('B2').getFormula(), /COUNTIF\('Invitados'!D2:D,"Sí"\)/);
  });

  const [ana, beto, carla] = t.addGuests(['Ana Gómez', 'Beto Ruiz', 'Carla Díaz']);
  check('cada invitado recibe un código único y aleatorio de 32 caracteres', () => {
    for (const id of [ana, beto, carla]) assert.match(id, /^[a-f0-9]{32}$/);
    assert.equal(new Set([ana, beto, carla]).size, 3);
  });
  check('se crea su enlace personal (fórmula con ?i=código)', () => {
    assert.match(t.ss.getSheetByName('Invitados').getRange(2, 3).getFormula(), /\?i="&B2/);
  });

  check('consulta: con su código, el invitado ve SOLO su nombre y estado', () => {
    assert.deepEqual(t.get(ana), { ok: true, name: 'Ana Gómez', attending: null });
  });
  check('privacidad: un código inválido o inexistente no revela nada', () => {
    assert.deepEqual(t.get('abc'), { ok: false, error: 'bad_request' });
    assert.deepEqual(t.get('0'.repeat(32)), { ok: false, error: 'not_found' });
    assert.deepEqual(t.get(''), { ok: false, error: 'bad_request' });
  });

  check('confirmación positiva se guarda', () => {
    assert.deepEqual(t.post({ id: ana, name: 'Ana Gómez', attending: 'yes' }), { ok: true, attending: 'yes' });
    const row = t.rows()[0];
    assert.equal(row[3], 'Sí');
    assert.equal(row[4], 'Ana Gómez');
    assert.equal(Object.prototype.toString.call(row[5]), '[object Date]');
    assert.deepEqual(t.get(ana).attending, 'yes');
  });
  check('confirmación negativa se guarda', () => {
    assert.deepEqual(t.post({ id: beto, name: 'Beto Ruiz', attending: 'no' }), { ok: true, attending: 'no' });
    assert.equal(t.rows()[1][3], 'No');
  });
  check('modificar la respuesta actualiza la MISMA fila (sin duplicados)', () => {
    const before = t.rows().length;
    t.post({ id: ana, name: 'Ana Gómez', attending: 'no' });
    t.post({ id: ana, name: 'Ana Gómez', attending: 'yes' });
    t.post({ id: ana, name: 'Ana Gómez', attending: 'yes' });
    assert.equal(t.rows().length, before);
    assert.equal(t.rows()[0][3], 'Sí');
    assert.equal(t.rows()[0][6], 2); // cambió dos veces (sí→no→sí); repetir “sí” no cuenta
  });
  check('no se puede registrar a nadie sin un código válido', () => {
    const before = t.rows().length;
    assert.equal(t.post({ id: '0'.repeat(32), name: 'Intruso Falso', attending: 'yes' }).error, 'not_found');
    assert.equal(t.post({ id: 'abc', name: 'Código Malo', attending: 'yes' }).error, 'bad_request');
    assert.equal(t.rows().length, before);
  });
  check('enlace general: un invitado nuevo escribe su nombre y queda guardado', () => {
    const before = t.rows().length;
    assert.deepEqual(t.post({ name: 'Elena Restrepo', attending: 'yes' }), { ok: true, attending: 'yes' });
    const rows = t.rows();
    assert.equal(rows.length, before + 1);
    const r = rows.find((x) => x[0] === 'Elena Restrepo');
    assert.equal(r[3], 'Sí');
    assert.match(r[1], /^[a-f0-9]{32}$/);
  });
  check('enlace general: si vuelve a responder (con otras mayúsculas/tildes) se actualiza su fila', () => {
    const before = t.rows().length;
    t.post({ name: '  elena   RESTREPO ', attending: 'no' });
    assert.equal(t.rows().length, before);
    assert.equal(t.rows().find((x) => x[0] === 'Elena Restrepo')[3], 'No');
  });
  check('enlace general: si ya estaba en tu lista, responde en su misma fila (sale de pendientes)', () => {
    const before = t.rows().length;
    t.post({ name: 'Carla Diaz', attending: 'yes' });
    assert.equal(t.rows().length, before);
    assert.equal(t.rows()[2][3], 'Sí');
    t.post({ id: carla, name: 'Carla Díaz', attending: 'no' }); // vuelve a dejarla como estaba para las demás pruebas
    t.ss.getSheetByName('Invitados').getRange(4, 4, 1, 4).setValues([['', '', '', 0]]);
  });
  check('datos inválidos se rechazan', () => {
    assert.equal(t.post({ id: carla, name: 'Carla', attending: 'quizás' }).error, 'bad_request');
    assert.equal(t.post({ id: carla, name: 'C', attending: 'yes' }).error, 'bad_request');
    assert.equal(t.post('no-es-json').error, 'bad_request');
    assert.equal(t.rows()[2][3], '');
  });
  check('pendientes = invitados sin respuesta', () => {
    const rows = t.rows();
    const pend = rows.filter((r) => r[0] && !r[3]).map((r) => r[0]);
    assert.deepEqual(pend, ['Carla Díaz']);
    assert.equal(rows.filter((r) => r[3] === 'Sí').length, 1);
    assert.equal(rows.filter((r) => r[3] === 'No').length, 2); // Beto y Elena
  });
  check('pegar una lista y generar códigos faltantes', () => {
    const sh = t.ss.getSheetByName('Invitados');
    sh.getRange(5, 1).setValue('Diana Mora');
    t.ctx.generarCodigosFaltantes();
    assert.match(sh.getRange(5, 2).getValue(), /^[a-f0-9]{32}$/);
  });

  for (const [s, n] of results) console.log(`${s}  ${n}`);
  const failed = results.filter(([s]) => s !== 'OK ').length;
  console.log(failed ? `\n${failed} prueba(s) fallaron` : `\nTodas las pruebas pasaron (${results.length}).`);
  process.exit(failed ? 1 : 0);
}

function serve() {
  const t = createEnv();
  const ids = t.addGuests(['Invitada de Prueba', 'Invitado de Prueba']);
  fs.writeFileSync(new URL('./.mock-ids.json', import.meta.url), JSON.stringify(ids));
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (url.pathname === '/__rows') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(t.rows()));
    }
    if (url.pathname !== '/exec') { res.statusCode = 404; return res.end(); }
    if (req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(t.get(url.searchParams.get('id'))));
    }
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(t.post(body)));
    });
  });
  server.listen(8787, () => console.log('Simulador en http://localhost:8787/exec  códigos:', ids.join(', ')));
}

if (process.argv[2] === 'test') runTests();
else if (process.argv[2] === 'serve') serve();
