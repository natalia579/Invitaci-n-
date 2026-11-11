import { invitation } from '../content/invitation';

/**
 * Confirmaciones individuales conectadas a Google Sheets a través de una
 * aplicación web de Google Apps Script (docs/google-sheets/Codigo.gs).
 *
 *  · Cada invitado tiene un enlace con un código aleatorio: ?i=XXXXXXXX…
 *  · El navegador NUNCA tiene credenciales de Google: sólo envía el código y la respuesta.
 *  · Con un código sólo se puede leer/cambiar la respuesta de esa invitación.
 *  · Nunca se muestra “guardado” si el servicio no lo confirmó.
 */

export type Attending = 'yes' | 'no';
export type InviteInfo = { name: string; attending: Attending | null };

const ID_RE = /^[A-Za-z0-9]{20,40}$/;

/** Código de invitación del enlace personal (?i=…). */
export function inviteIdFromUrl(): string | null {
  try {
    const url = new URL(window.location.href);
    const raw = url.searchParams.get('i') ?? new URLSearchParams(url.hash.replace(/^#/, '')).get('i');
    return raw && ID_RE.test(raw) ? raw : null;
  } catch {
    return null;
  }
}

export const rsvpConfigured = () => Boolean(invitation.rsvp.endpoint);

async function withTimeout<T>(p: Promise<T>, ms = 15000): Promise<T> {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
}

/** Lee el nombre y la respuesta actual de ESTA invitación. */
export async function fetchInvite(id: string): Promise<InviteInfo | 'not_found' | 'error'> {
  const endpoint = invitation.rsvp.endpoint;
  if (!endpoint) return 'error';
  try {
    const res = await withTimeout(fetch(`${endpoint}?id=${encodeURIComponent(id)}`, { method: 'GET', redirect: 'follow' }));
    if (!res.ok) return 'error';
    const json = (await res.json()) as { ok?: boolean; error?: string; name?: string; attending?: Attending | null };
    if (json.ok) return { name: String(json.name ?? ''), attending: json.attending ?? null };
    return json.error === 'not_found' ? 'not_found' : 'error';
  } catch {
    return 'error';
  }
}

/** Guarda (o cambia) la respuesta. Sólo devuelve true si Google Sheets confirmó el guardado. */
export async function saveRsvp(id: string, name: string, attending: Attending): Promise<boolean> {
  const endpoint = invitation.rsvp.endpoint;
  if (!endpoint) return false;
  try {
    // text/plain = petición “simple”: Apps Script la acepta sin preflight CORS
    const res = await withTimeout(
      fetch(endpoint, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ id, name: name.trim(), attending }),
      }),
    );
    if (!res.ok) return false;
    const json = (await res.json().catch(() => null)) as { ok?: boolean; attending?: string } | null;
    return json?.ok === true && json.attending === attending;
  } catch {
    return false;
  }
}

/** Enlace de WhatsApp para preguntas (canal privado; no se usa para confirmar). */
export function whatsappQuestionUrl(): string | null {
  const q = invitation.questions;
  const n = q.whatsappNumber?.replace(/\D/g, '');
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(q.message)}`;
}
