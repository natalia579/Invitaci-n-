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
    hosts: 'Natali y Santiago',
  },

  /** Rutas a ilustraciones propias en acuarela (dentro de /public/illustrations).
   *  Si un valor es `null`, se usa la ilustración vectorial incluida. */
  illustrations: {
    balloon: null as string | null, // p. ej. 'illustrations/globo.png'
    cloud: null as string | null,
    rockingHorse: 'illustrations/caballito.png' as string | null,
    giftBox: null as string | null,
    stork: null as string | null,
    venue: 'illustrations/lugar.jpg' as string | null, // ilustración del lugar
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
    calendarTitle: 'Gender Reveal & Baby Shower · Natali y Santiago',
  },

  chapter4: {
    number: 'IV',
    label: 'Nuestro lugar de encuentro',
    venueName: 'Orquideorama' as string | null,
    address: 'Av. 2 Nte. #48, Olaya Herrera, Cali, Valle del Cauca' as string | null,
    /** PENDIENTE: enlace de Google Maps (p. ej. https://maps.app.goo.gl/...). */
    mapsUrl: 'https://maps.app.goo.gl/BF4CZeqT5JXgYqsJ8' as string | null,
    directionsButton: 'Cómo llegar',
    venueNameFallback: 'Lugar por confirmar',
    addressFallback: 'Muy pronto compartiremos la dirección',
    illustrationCaption: 'Ilustración del lugar',
  },

  chapter5: {
    number: 'V',
    label: 'Dress Code',
    title: 'Dress Code',
    /** Cada línea: quién lo dice + qué dice. */
    quotes: [
      { who: 'Como diría Santiago:', what: 'Old Money.', emphasis: true },
      { who: 'Como diría Natali:', what: 'ponte bien lindo y ven a celebrar con nosotros.', emphasis: false },
    ],
    /** Muestra un pequeño corazón café ilustrado al final. */
    heart: true,
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
    },
    submit: 'Enviar confirmación',
    submitWhatsApp: 'Confirmar por WhatsApp',
    orWhatsApp: 'o confirmar por WhatsApp',
    sending: 'Enviando…',
    successYes: '¡Gracias! Ya eres parte de nuestra historia.',
    successNo: 'Gracias por avisarnos. Te llevaremos en el corazón ese día.',
    error: 'No pudimos guardar tu respuesta. Intenta de nuevo o confírmanos por WhatsApp.',
    whatsappPending: 'El número de WhatsApp aún no está configurado.',
    /** Mensaje que se envía por WhatsApp. {name} y {attending} se reemplazan. */
    whatsappTemplate: 'Hola Natali y Santiago, soy {name}. {attending}',
    whatsappYes: '¡Confirmo mi asistencia al Gender Reveal & Baby Shower! Ahí estaré.',
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
    signature: 'Natali y Santiago',
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
    /** WhatsApp de Santiago (+57 300 7512688), con indicativo y sin signos. */
    whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || '573007512688',
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
