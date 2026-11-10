# Guardar confirmaciones en Google Sheets (gratis)

1. Crea una hoja de cálculo en Google Sheets con encabezados: `fecha | nombre | asiste`.
2. Menú **Extensiones → Apps Script**, pega este código y guarda:

```js
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet.appendRow([data.fecha, data.nombre, data.asiste]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como: *Yo*. Acceso: *Cualquier persona*.
4. Copia la URL (`https://script.google.com/macros/s/.../exec`) y pégala en
   `src/content/invitation.ts` → `rsvp.endpoint` (o en la variable `VITE_RSVP_ENDPOINT`).

La página sólo muestra “¡Gracias!” cuando el script responde `{ ok: true }`. Nunca simula un guardado.

**Alternativa:** Formspree — crea un formulario, usa su URL como `endpoint` y pon `provider: 'formspree'`.
