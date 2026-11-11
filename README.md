# Once Upon a Little Dream

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
- `rsvp.endpoint` — URL de Apps Script para guardar confirmaciones ([guía para iPad](docs/confirmaciones-google-sheets.md)).
- `questions.whatsappNumber` — número para el botón “Escríbenos por WhatsApp”.
- `music.src` — grabación autorizada de *Clair de Lune* (ver `public/audio/README.md`).

Mientras `meta.showPendingMarkers` sea `true`, la página muestra etiquetas “Pendiente”.
**Antes de publicar**, completa los datos y cámbialo a `false`.

## La apertura: el globo y la carta sellada

1. **La llegada:** un globo monumental desciende entre nubes en capas; de la canasta cuelga un sobre.
2. **El sobre:** la cámara se acerca hasta que el sobre es el protagonista.
3. **Interacción:** todo se detiene hasta que el invitado toca el sello de lacre (un botón real).
   El sello se rompe, la solapa se abre, sale la carta y empieza la música.
4. **La carta:** se despliega a pantalla completa con el inicio de la historia.

El cielo y las nubes se pintan en el navegador (`src/opening/paint.ts`); el sobre, el lacre y la
carta están en `src/opening/Envelope.tsx`. El globo y el cielo se pueden reemplazar por arte
propio en `invitation.illustrations.balloon` y `openingSky`.

## Probar las confirmaciones sin cuenta de Google

```bash
node tools/rsvp-mock.mjs test     # pruebas automáticas del script de Google Sheets
node tools/rsvp-mock.mjs serve    # simulador local en http://localhost:8787/exec
VITE_RSVP_ENDPOINT=http://localhost:8787/exec npm run dev
```

## Estructura

```
src/content/invitation.ts     ← contenido editable
src/opening/                  ← sobre, lacre, carta y pintura del cielo
src/components/Opening.tsx    ← orquesta las cuatro escenas de apertura
src/components/chapters/      ← capítulos I–VIII
src/components/illustrations/ ← ilustraciones SVG en acuarela + filtros
src/audio/musicBox.ts         ← caja musical original (Web Audio)
public/illustrations/         ← tus ilustraciones en acuarela (ver README)
public/audio/                 ← tu música (ver README)
```

Accesibilidad: respeta “Reducir movimiento” del sistema (la apertura se omite y las animaciones se detienen).
