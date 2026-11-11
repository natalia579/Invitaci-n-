/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONFIRMACIONES — Gender Reveal & Baby Shower (Nati y Santi)
 *  Pega este código completo en Extensiones → Apps Script de tu hoja de cálculo.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Cómo funciona:
 *   · La hoja “Invitados” es tu lista. Escribe un nombre en la columna A y el
 *     script crea solo su código secreto (columna B) y su enlace personal (C).
 *   · La invitación envía únicamente { código, nombre escrito, sí/no }.
 *     El código identifica la fila: así no se crean duplicados y cada
 *     invitado sólo puede ver y cambiar SU respuesta.
 *   · La hoja nunca se hace pública. El script se ejecuta con tu cuenta.
 */

const HOJA_INVITADOS = 'Invitados';
const HOJA_CONFIG = 'Configuración';
const HOJA_RESUMEN = 'Resumen';

const COL = { NOMBRE: 1, ID: 2, ENLACE: 3, ASISTENCIA: 4, NOMBRE_ESCRITO: 5, FECHA: 6, CAMBIOS: 7 };
const ENCABEZADOS = [
  'Nombre del invitado',
  'Código de invitación',
  'Enlace personal',
  'Asistencia',
  'Nombre que escribió',
  'Fecha y hora de respuesta',
  'Veces que cambió su respuesta',
];
const ID_RE = /^[A-Za-z0-9]{20,40}$/;

/* ═══════════════════════════ API pública (la usa la invitación) ═══════════════════════════ */

/** GET ?id=CODIGO → nombre y respuesta actual de ESA invitación (nada más). */
function doGet(e) {
  const id = limpiarId_(e && e.parameter && e.parameter.id);
  if (!id) return json_({ ok: false, error: 'bad_request' });
  const fila = buscarFila_(id);
  if (!fila) return json_({ ok: false, error: 'not_found' });
  const v = hoja_(HOJA_INVITADOS).getRange(fila, 1, 1, ENCABEZADOS.length).getValues()[0];
  return json_({ ok: true, name: String(v[COL.NOMBRE - 1] || ''), attending: aApi_(v[COL.ASISTENCIA - 1]) });
}

/**
 * POST { name, attending: 'yes' | 'no', id? } → guarda o actualiza la respuesta.
 *  · Con enlace general (sin id): se busca al invitado por su nombre (sin tildes ni
 *    mayúsculas). Si ya está en la lista o ya respondió, se actualiza esa fila;
 *    si no, se agrega una fila nueva. Así no hay duplicados.
 *  · Con enlace personal (id): se actualiza la fila de ese código.
 */
function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '');
  } catch (err) {
    return json_({ ok: false, error: 'bad_request' });
  }
  const asistencia = data && data.attending === 'yes' ? 'Sí' : data && data.attending === 'no' ? 'No' : null;
  const nombre = String((data && data.name) || '').replace(/\s+/g, ' ').trim().slice(0, 120);
  const traeId = data && data.id !== undefined && data.id !== null && data.id !== '';
  const id = traeId ? limpiarId_(data.id) : null;
  if (!asistencia || nombre.length < 3 || (traeId && !id)) return json_({ ok: false, error: 'bad_request' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = hoja_(HOJA_INVITADOS);
    let fila = id ? buscarFila_(id) : buscarPorNombre_(nombre);
    if (id && !fila) return json_({ ok: false, error: 'not_found' });
    if (!fila) {
      fila = Math.max(2, sh.getLastRow() + 1);
      sh.getRange(fila, COL.NOMBRE).setValue(nombre);
      completarCodigos_(sh, fila, 1);
    }
    const anterior = sh.getRange(fila, COL.ASISTENCIA).getValue();
    const cambios = Number(sh.getRange(fila, COL.CAMBIOS).getValue()) || 0;
    const nuevosCambios = anterior && anterior !== asistencia ? cambios + 1 : cambios;
    sh.getRange(fila, COL.ASISTENCIA, 1, 4).setValues([[asistencia, nombre, new Date(), nuevosCambios]]);
    return json_({ ok: true, attending: data.attending });
  } finally {
    lock.releaseLock();
  }
}

/** Busca una fila por nombre de la lista (col. A) o por el nombre que escribió (col. E). */
function buscarPorNombre_(nombre) {
  const sh = hoja_(HOJA_INVITADOS);
  const n = sh.getLastRow() - 1;
  if (n < 1) return 0;
  const buscado = normalizar_(nombre);
  const filas = sh.getRange(2, 1, n, COL.NOMBRE_ESCRITO).getValues();
  for (let i = 0; i < filas.length; i++) {
    if (normalizar_(filas[i][COL.NOMBRE - 1]) === buscado || normalizar_(filas[i][COL.NOMBRE_ESCRITO - 1]) === buscado) return i + 2;
  }
  return 0;
}

function normalizar_(v) {
  return String(v || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-zñ0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ═══════════════════════════ Automatización de la hoja ═══════════════════════════ */

/** Al escribir nombres en la columna A, crea su código y su enlace personal. */
function onEdit(e) {
  if (!e || !e.range) return;
  const sh = e.range.getSheet();
  if (sh.getName() !== HOJA_INVITADOS || e.range.getColumn() > COL.NOMBRE) return;
  completarCodigos_(sh, e.range.getRow(), e.range.getNumRows());
}

/** Por si pegas una lista larga: crea los códigos que falten. */
function generarCodigosFaltantes() {
  const sh = hoja_(HOJA_INVITADOS);
  completarCodigos_(sh, 2, Math.max(0, sh.getLastRow() - 1));
}

function completarCodigos_(sh, desde, cuantas) {
  for (let r = Math.max(2, desde); r < desde + cuantas; r++) {
    const nombre = String(sh.getRange(r, COL.NOMBRE).getValue() || '').trim();
    const id = String(sh.getRange(r, COL.ID).getValue() || '').trim();
    if (nombre && !id) {
      sh.getRange(r, COL.ID).setValue(nuevoCodigo_());
      sh.getRange(r, COL.ENLACE).setFormula(`=IF(B${r}="","",'${HOJA_CONFIG}'!$B$2&"?i="&B${r})`);
    }
  }
}

/** Ejecútalo UNA vez: crea las pestañas, encabezados y el resumen. */
function configurar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('America/Bogota');

  const inv = ss.getSheetByName(HOJA_INVITADOS) || ss.insertSheet(HOJA_INVITADOS);
  inv.getRange(1, 1, 1, ENCABEZADOS.length).setValues([ENCABEZADOS]).setFontWeight('bold');
  inv.setFrozenRows(1);
  inv.getRange('F:F').setNumberFormat('dd/mm/yyyy hh:mm');

  const cfg = ss.getSheetByName(HOJA_CONFIG) || ss.insertSheet(HOJA_CONFIG);
  cfg.getRange('A1:B1').setValues([['Ajuste', 'Valor']]).setFontWeight('bold');
  cfg.getRange('A2').setValue('Dirección de la invitación publicada');
  if (!cfg.getRange('B2').getValue()) cfg.getRange('B2').setValue('PENDIENTE-pega-aqui-la-direccion');

  const res = ss.getSheetByName(HOJA_RESUMEN) || ss.insertSheet(HOJA_RESUMEN);
  res.getRange('A1:B5').setValues([
    ['Total de invitados', `=COUNTA('${HOJA_INVITADOS}'!A2:A)`],
    ['Confirmados', `=COUNTIF('${HOJA_INVITADOS}'!D2:D,"Sí")`],
    ['No asistirán', `=COUNTIF('${HOJA_INVITADOS}'!D2:D,"No")`],
    ['Pendientes', '=B1-B2-B3'],
    ['', ''],
  ]);
  res.getRange('A1:A4').setFontWeight('bold');
  res.getRange('D1:F1').setValues([['Confirmados', 'No asistirán', 'Pendientes']]).setFontWeight('bold');
  res.getRange('D2').setFormula(`=IFERROR(FILTER('${HOJA_INVITADOS}'!A2:A,'${HOJA_INVITADOS}'!D2:D="Sí"),"")`);
  res.getRange('E2').setFormula(`=IFERROR(FILTER('${HOJA_INVITADOS}'!A2:A,'${HOJA_INVITADOS}'!D2:D="No"),"")`);
  res.getRange('F2').setFormula(`=IFERROR(FILTER('${HOJA_INVITADOS}'!A2:A,'${HOJA_INVITADOS}'!A2:A<>"",'${HOJA_INVITADOS}'!D2:D=""),"")`);
}

/* ═══════════════════════════ utilidades ═══════════════════════════ */

function hoja_(nombre) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombre);
  if (!sh) throw new Error('Falta la pestaña “' + nombre + '”. Ejecuta la función configurar().');
  return sh;
}

function buscarFila_(id) {
  const sh = hoja_(HOJA_INVITADOS);
  const n = sh.getLastRow() - 1;
  if (n < 1) return 0;
  const ids = sh.getRange(2, COL.ID, n, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]).trim() === id) return i + 2;
  return 0;
}

function limpiarId_(v) {
  const s = String(v || '').trim();
  return ID_RE.test(s) ? s : null;
}

/** Código aleatorio de 32 caracteres (UUID v4 sin guiones: ~122 bits de azar). */
function nuevoCodigo_() {
  return Utilities.getUuid().replace(/-/g, '');
}

function aApi_(v) {
  return v === 'Sí' ? 'yes' : v === 'No' ? 'no' : null;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
