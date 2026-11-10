import { invitation } from '../content/invitation';

export type RsvpData = { name: string; attending: boolean; guests: number };

/** ¿Hay un servicio real configurado para guardar confirmaciones? */
export const rsvpStorageConfigured = Boolean(invitation.rsvp.endpoint);
export const whatsappConfigured = Boolean(invitation.rsvp.whatsappNumber);

/**
 * Envía la confirmación al servicio configurado.
 * Sólo devuelve `true` si el servicio respondió correctamente — nunca simula un guardado.
 */
export async function submitRsvp(data: RsvpData): Promise<boolean> {
  const { endpoint, provider } = invitation.rsvp;
  if (!endpoint) return false;
  const payload = {
    nombre: data.name,
    asiste: data.attending ? 'Sí' : 'No',
    asistentes: data.attending ? data.guests : 0,
    fecha: new Date().toISOString(),
  };
  try {
    if (provider === 'formspree') {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.ok;
    }
    // Google Apps Script: petición “simple” (text/plain) para evitar preflight CORS.
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return false;
    const json = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    return json?.ok === true;
  } catch {
    return false;
  }
}

export function whatsappUrl(data: RsvpData): string | null {
  const n = invitation.rsvp.whatsappNumber?.replace(/\D/g, '');
  if (!n) return null;
  const c = invitation.chapter7;
  const guests = `${data.guests} ${data.guests === 1 ? 'persona' : 'personas'}`;
  const attending = data.attending ? c.whatsappYes.replace('{guests}', guests) : c.whatsappNo;
  const text = c.whatsappTemplate.replace('{name}', data.name.trim()).replace('{attending}', attending);
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}
