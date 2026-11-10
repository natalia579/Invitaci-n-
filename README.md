# A Little Story Is About to Begin

Invitación digital interactiva — Gender Reveal & Baby Shower de Natali y Santi.
React + TypeScript + Tailwind CSS + Vite + Framer Motion.

## Ver la invitación

```bash
npm install
npm run dev        # servidor de desarrollo (también accesible desde la red local)
npm run build      # genera /dist listo para publicar
npm run preview    # sirve /dist
```

## Editar contenido

**Todo el texto, la fecha, el lugar, los enlaces, la música y las ilustraciones** están en
[`src/content/invitation.ts`](src/content/invitation.ts). No hace falta tocar los componentes.

### Datos pendientes (marcados con `null`)
- `chapter4.venueName`, `chapter4.address`, `chapter4.mapsUrl` — lugar, dirección y enlace de Google Maps.
- `illustrations.venue` — ilustración en acuarela del lugar.
- `rsvp.whatsappNumber` — número para confirmar por WhatsApp (formato `573001234567`).
- `rsvp.endpoint` — servicio para guardar confirmaciones ([guía Google Sheets](docs/rsvp-google-sheets.md)).
- `music.src` — opcional: canción propia o con licencia.
- `chapter7.deadline` — opcional: fecha límite para confirmar.

Mientras `meta.showPendingMarkers` sea `true`, la página muestra etiquetas “Pendiente”.
**Antes de publicar**, completa los datos y cámbialo a `false`.

## Estructura

```
src/content/invitation.ts     ← contenido editable
src/components/Opening.tsx    ← apertura cinematográfica (cinta + globo)
src/components/chapters/      ← capítulos I–VIII
src/components/illustrations/ ← ilustraciones SVG en acuarela + filtros
src/audio/musicBox.ts         ← caja musical original (Web Audio)
public/illustrations/         ← tus ilustraciones en acuarela (ver README)
public/audio/                 ← tu música (ver README)
```

Accesibilidad: respeta “Reducir movimiento” del sistema (la apertura se omite y las animaciones se detienen).
