# Ilustraciones propias en acuarela

Coloca aquí los archivos y activa cada uno en `src/content/invitation.ts → illustrations`.
Mientras un valor sea `null`, se usa la ilustración vectorial incluida.

| Archivo sugerido        | Clave            | Formato recomendado                                   |
|-------------------------|------------------|-------------------------------------------------------|
| `globo.png`             | `balloon`        | PNG transparente, ~1000×1300 px, cesta incluida        |
| `nube.png`              | `cloud`          | PNG transparente, ~1200×560 px, bordes muy suaves      |
| `caballito.png`         | `rockingHorse`   | PNG transparente, ~1200×1000 px                         |
| `regalo.png`            | `giftBox`        | PNG transparente, ~1000×1000 px, lazo café             |
| `ciguena.png`           | `stork`          | PNG transparente, ~1000×700 px, en vuelo               |
| `lugar.jpg`             | `venue`          | JPG/WEBP vertical 3:4, ~1200×1600 px (se recorta en arco) |

Ejemplo: `balloon: 'illustrations/globo.png'`.
Exporta en sRGB, optimiza con https://squoosh.app (WEBP calidad 80 o PNG cuantizado).
