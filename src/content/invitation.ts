/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONTENIDO DE LA INVITACIÓN
 * ─────────────────────────────────────────────────────────────────────────────
 *  Este es el ÚNICO archivo que necesitas editar para cambiar textos, fecha,
 *  lugar, enlaces, música e ilustraciones. El diseño vive en /src/components.
 *
 *  Los valores marcados con `null` están PENDIENTES. Mientras
 *  `meta.showPendingMarkers` sea `true`, la página mostrará una pequeña
 *  etiqueta “Pendiente” en esos lugares para que sea fácil identificarlos.
 *  Antes de publicar, completa los datos y cambia ese valor a `false`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const invitation = {
  meta: {
    /** Muestra etiquetas “Pendiente” en los datos que faltan. Pon `false` antes de publicar. */
    showPendingMarkers: true,
    hosts: 'Natali y Santi',
  },

  /** Rutas a ilustraciones propias en acuarela (dentro de /public/illustrations).
   *  Si un valor es `null`, se usa la ilustración vectorial incluida. */
  illustrations: {
    balloon: null as string | null, // p. ej. 'illustrations/globo.png'
    cloud: null as string | null,
    rockingHorse: null as string | null,
    giftBox: null as string | null,
    stork: null as string | null,
    venue: null as string | null, // ilustración del lugar (pendiente)
  },

  opening: {
    banner: 'Gender Reveal & Baby Shower',
    cardKicker: 'Una invitación para ti',
    line1: 'Una pequeña historia está por comenzar…',
    line2: 'Y queremos que seas parte de ella.',
    scrollHint: 'Desliza para comenzar',
  },

  chapter1: {
    number: 'I',
    label: 'Una nueva aventura',
    paragraphs: [
      'Hay historias que llegan sin avisar y terminan convirtiéndose en las más bonitas de nuestra vida.',
      'Y la nuestra está a punto de comenzar un capítulo completamente nuevo.',
    ],
  },

  chapter2: {
    number: 'II',
    label: 'La celebración',
    title: 'Gender Reveal & Baby Shower',
    paragraphs: [
      'Entre tantas sorpresas que nos ha regalado la vida, hay una que queremos descubrir y celebrar rodeados de nuestras personas favoritas.',
      'Por eso, queremos invitarte a compartir una tarde muy especial con nosotros.',
    ],
  },

  chapter3: {
    number: 'III',
    label: 'Save the Date',
    weekday: 'Sábado',
    day: '28',
    monthYear: 'Noviembre 2026',
    time: '4:00 p. m.',
    /** Fecha y hora exactas del evento, con la zona horaria de Colombia (UTC−5). */
    isoDateTime: '2026-11-28T16:00:00-05:00',
    durationHours: 4,
    countdownLabels: { days: 'Días', hours: 'Horas', minutes: 'Minutos', seconds: 'Segundos' },
    countdownDone: '¡Hoy comienza nuestra historia!',
    addToCalendar: 'Agregar al calendario',
    calendarTitle: 'Gender Reveal & Baby Shower · Natali y Santi',
  },

  chapter4: {
    number: 'IV',
    label: 'Nuestro lugar de encuentro',
    /** PENDIENTE: nombre del lugar. */
    venueName: null as string | null,
    /** PENDIENTE: dirección. */
    address: null as string | null,
    /** PENDIENTE: enlace de Google Maps (p. ej. https://maps.app.goo.gl/...). */
    mapsUrl: null as string | null,
    directionsButton: 'Cómo llegar',
    venueNameFallback: 'Lugar por confirmar',
    addressFallback: 'Muy pronto compartiremos la dirección',
    illustrationCaption: 'Ilustración del lugar',
  },

  chapter5: {
    number: 'V',
    label: 'Dress Code',
    title: 'Dress Code',
    quote: 'Como diría Santi: All Money.',
    /** Frase complementaria — edítala libremente. */
    note: 'Tu mejor versión, con un toque de elegancia de otra época: telas lindas, colores suaves y ese detalle que guardas para las ocasiones que valen la pena.',
  },

  chapter6: {
    number: 'VI',
    label: 'Un detalle con amor',
    title: 'El mejor regalo es tenerte aquí.',
    paragraphs: [
      'Estamos preparando un día lleno de amor y nos hace muy felices poder compartirlo contigo.',
      'Tu presencia es, sin duda, el regalo más especial. Pero si te nace tener un detalle con nuestro bebé, puedes elegir algo unisex, porque la sorpresa también es parte de esta celebración.',
    ],
  },

  chapter7: {
    number: 'VII',
    label: 'Confirma tu asistencia',
    intro: 'Nos encantaría saber si podremos contar contigo.',
    deadline: null as string | null, // p. ej. 'Por favor confírmanos antes del 20 de noviembre.'
    fields: {
      name: 'Tu nombre',
      namePlaceholder: 'Nombre y apellido',
      attending: '¿Nos acompañas?',
      yes: 'Sí, ahí estaré',
      no: 'No podré asistir',
      guests: 'Número de asistentes',
      guestsHelp: 'Incluyéndote a ti',
    },
    maxGuests: 6,
    submit: 'Enviar confirmación',
    submitWhatsApp: 'Confirmar por WhatsApp',
    orWhatsApp: 'o confirmar por WhatsApp',
    sending: 'Enviando…',
    successYes: '¡Gracias! Ya eres parte de nuestra historia.',
    successNo: 'Gracias por avisarnos. Te llevaremos en el corazón ese día.',
    error: 'No pudimos guardar tu respuesta. Intenta de nuevo o confírmanos por WhatsApp.',
    whatsappPending: 'El número de WhatsApp aún no está configurado.',
    /** Mensaje que se envía por WhatsApp. {name}, {attending} y {guests} se reemplazan. */
    whatsappTemplate: 'Hola Natali y Santi, soy {name}. {attending}',
    whatsappYes: '¡Confirmo mi asistencia al Gender Reveal & Baby Shower! Asistiremos {guests}.',
    whatsappNo: 'Lamentablemente no podré asistir al Gender Reveal & Baby Shower, pero les envío todo mi cariño.',
  },

  chapter8: {
    number: 'VIII',
    label: 'El final del cuento',
    paragraphs: [
      'Las historias más bonitas siempre tienen algo en común: las personas con quienes las compartimos.',
      'Gracias por ser parte de la nuestra.',
    ],
    signoff: 'Con amor,',
    signature: 'Natali y Santi',
    fin: 'Fin',
  },

  /** Confirmaciones de asistencia. */
  rsvp: {
    /**
     * URL del servicio donde se guardan las respuestas (PENDIENTE).
     * Compatible con un Web App de Google Apps Script (ver docs/rsvp-google-sheets.md)
     * o con Formspree (https://formspree.io/f/xxxx).
     * Mientras sea `null`, sólo se ofrece la confirmación por WhatsApp
     * y NUNCA se muestra un mensaje de “guardado”.
     */
    endpoint: (import.meta.env.VITE_RSVP_ENDPOINT as string | undefined) || null,
    provider: 'google-apps-script' as 'google-apps-script' | 'formspree',
    /** Número de WhatsApp con indicativo y sin signos, p. ej. '573001234567' (PENDIENTE). */
    whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || null,
  },

  music: {
    /**
     * Archivo de audio propio o con licencia dentro de /public/audio
     * (p. ej. 'audio/cancion.mp3'). Si es `null`, suena una melodía de caja
     * musical original, generada en el navegador.
     */
    src: null as string | null,
    volume: 0.55,
    enableLabel: 'Activar música',
    playLabel: 'Reproducir música',
    muteLabel: 'Silenciar música',
  },
} as const;

export type Invitation = typeof invitation;
