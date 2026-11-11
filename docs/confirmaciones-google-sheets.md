# Confirmaciones en Google Sheets — guía para iPad

Todo se hace **una sola vez**, en unos 15 minutos. Necesitas tu iPad, Safari y tu cuenta de Google.

> **Qué estamos armando:** una hoja de cálculo **privada** con tu lista de invitados. Dentro
> de ella vive un pequeño programa de Google (Apps Script) que recibe las respuestas de la
> invitación y las escribe en la fila de cada invitado. Nadie más ve la hoja.

---

## Paso 1 · Crear la hoja

1. Abre **Safari** y entra a **sheets.new** (inicia sesión con tu cuenta de Google si te lo pide).
2. Arriba a la izquierda, toca el nombre “Hoja de cálculo sin título” y escribe:
   **Confirmaciones Gender Reveal**.

## Paso 2 · Ver Google Sheets “como en computador”

El editor de scripts no existe en la app de Google Sheets; hay que usar Safari en modo escritorio.

1. En la barra de direcciones de Safari toca **“aA”** (o el ícono de ajustes de la página).
2. Toca **“Solicitar sitio web de escritorio”**.

## Paso 3 · Pegar el programa

1. En el menú de la hoja toca **Extensiones → Apps Script**. Se abre una pestaña nueva.
2. Borra todo lo que aparece en el editor (toca dentro, selecciona todo y borra).
3. Abre el archivo **`docs/google-sheets/Codigo.gs`** de este repositorio en GitHub, toca
   **“Raw”**, selecciona todo y **cópialo**.
4. Vuelve a la pestaña de Apps Script y **pégalo**.
5. Toca el ícono de **disco (Guardar)**. Si te pide un nombre de proyecto, escribe *Confirmaciones*.

## Paso 4 · Crear las pestañas automáticamente

1. Arriba, junto al botón **▷ Ejecutar**, hay un menú desplegable con el nombre de una función.
   Elige **`configurar`**.
2. Toca **▷ Ejecutar**.
3. Google pedirá permiso (es tu propio programa):
   - Toca **Revisar permisos** → elige tu cuenta.
   - Verás “Google no ha verificado esta aplicación”. Es normal porque el programa lo creaste
     tú. Toca **Configuración avanzada** → **Ir a Confirmaciones (no seguro)** → **Permitir**.
4. Vuelve a la pestaña de la hoja: ahora tienes **Invitados**, **Configuración** y **Resumen**.

## Paso 5 · Publicar el programa (para que la invitación pueda guardar respuestas)

1. En Apps Script toca **Implementar → Nueva implementación**.
2. Toca el engranaje ⚙️ junto a “Seleccionar tipo” y elige **Aplicación web**.
3. Completa:
   - **Descripción:** Confirmaciones
   - **Ejecutar como:** **Yo**
   - **Quién tiene acceso:** **Cualquier persona**
4. Toca **Implementar** y copia la **URL de la aplicación web** (termina en `/exec`).
5. **Envíame esa URL.** Yo la conecto a la invitación.

> “Cualquier persona” significa que la invitación puede *enviar* respuestas; **la hoja sigue
> siendo privada**. El programa solo acepta códigos de invitación válidos y, con un código,
> solo se puede ver o cambiar la respuesta de esa persona.

---

## Uso diario

### Agregar invitados
- En la pestaña **Invitados**, escribe **un nombre por fila en la columna A** (desde la fila 2).
- La columna B se llena sola con un **código secreto** y la C con el **enlace personal**.
  (Funciona también desde la app de Google Sheets.)
- Si pegas una lista larga y algún código no aparece: en Apps Script elige la función
  **`generarCodigosFaltantes`** y toca ▷ Ejecutar.
- **No borres ni cambies** los códigos de la columna B después de enviar los enlaces.

### Poner la dirección de la invitación (cuando la publiquemos)
- En **Configuración**, celda **B2**, pega la dirección publicada (yo te la daré).
  Todos los enlaces de la columna C se actualizan solos.

### Enviar el enlace por WhatsApp
1. Toca la celda del invitado en la columna **C (Enlace personal)**.
2. **Copiar**.
3. Pégalo en el chat de WhatsApp de esa persona.
Cada enlace es **solo para esa persona**: no lo reenvíes a otra.

### Ver quién viene
- Pestaña **Resumen**: total de invitados, **confirmados**, **no asistirán**, **pendientes**
  y la lista de nombres de cada grupo.
- Pestaña **Invitados**, columna D: “Sí” / “No” / vacío (pendiente), con fecha y hora.

### Cambiar una respuesta a mano
- Escribe **Sí** o **No** en la columna D del invitado (o borra la celda para dejarlo pendiente).

### Si un invitado cambia de opinión
- Puede volver a abrir su enlace y tocar **“Cambiar mi respuesta”**. Se actualiza su misma
  fila; nunca se crean filas duplicadas.

---

## Preguntas frecuentes

**¿Alguien puede ver la lista?** No. La hoja no se comparte. La invitación solo recibe el
nombre del propio invitado cuando abre su enlace.

**¿Qué pasa si alguien abre la invitación sin enlace personal?** Puede ver la invitación,
pero para confirmar se le pide abrir su enlace personal.

**¿Y si cambio el código del programa?** Después de pegar una versión nueva, ve a
**Implementar → Gestionar implementaciones → ✏️ Editar → Versión: Nueva → Implementar**.
La URL se mantiene.
