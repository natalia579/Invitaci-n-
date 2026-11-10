import { invitation } from '../content/invitation';

const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** Descarga un archivo .ics (en iPhone/iPad abre directamente Calendario). */
export function downloadIcs() {
  const c = invitation.chapter4;
  const v = invitation.chapter5;
  const start = new Date(c.isoDateTime);
  const end = new Date(start.getTime() + c.durationHours * 3600 * 1000);
  const location = [v.venueName, v.address].filter(Boolean).join(', ');
  const esc = (s: string) => s.replace(/([,;])/g, '\\$1');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Invitacion//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${start.getTime()}-gender-reveal@invitacion`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(c.calendarTitle)}`,
    location ? `LOCATION:${esc(location)}` : '',
    v.mapsUrl ? `URL:${v.mapsUrl}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gender-reveal-baby-shower.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
