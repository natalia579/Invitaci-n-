/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONTENIDO DE LA INVITACIÓN — “Once Upon a Little Dream”
 * ─────────────────────────────────────────────────────────────────────────────
 *  Este es el ÚNICO archivo que necesitas editar para cambiar textos, fecha,
 *  lugar, enlaces, música e ilustraciones. El diseño vive en /src/components.
 *
 *  Los valores `null` están PENDIENTES. Mientras `meta.showPendingMarkers`
 *  sea `true`, la página muestra una etiqueta “Pendiente” en esos lugares.
 *  Antes de publicar, completa los datos y cambia ese valor a `false`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const invitation = {
  meta: {
    /** Muestra etiquetas “Pendiente” en los datos que faltan. Pon `false` antes de publicar. */
    showPendingMarkers: true,
    /** Nombres de los papás: SOLO aparecen al final del cuento. */
    signature: 'Nati y Santi',
  },

  /** Ilustraciones propias (en /public/illustrations). `null` = se usa la ilustración vectorial incluida. */
  illustrations: {
    balloon: null as string | null,
    cloud: null as string | null,
    rockingHorse: 'illustrations/caballito.png' as string | null,
    giftBox: null as string | null,
    stork: null as string | null,
    landscape: null as string | null,
    venue: 'illustrations/lugar.jpg' as string | null,
  },

  /** Apertura cinematográfica: libro 3D, cinta de raso y globo. */
  opening: {
    bookTitle: ['Once Upon', 'a Little Dream'] as [string, string],
    bookKicker: 'Un pequeño sueño',
    titlePage: 'Once Upon a Little Dream',
    titlePageSub: 'Capítulo primero',
    banner: 'Once Upon a Little Dream',
    line1: 'Había una vez una historia que apenas comenzaba…',
    line2: 'Y una pequeña sorpresa que lo cambiaría todo.',
    scrollHint: 'Desliza para entrar al cuento',
    replay: 'Volver a abrir el cuento',
  },

  chapter1: {
    number: 'I',
    label: 'Había una vez…',
    paragraphs: [
      'Había una vez dos personas que tenían muchos planes…',
      'Pero la vida, que a veces escribe historias mejores que las nuestras, tenía preparada una sorpresa.',
    ],
  },

  chapter2: {
    number: 'II',
    label: 'Una pequeña gran sorpresa',
    paragraphs: [
      'Y así, sin pedir permiso, comenzó nuestra aventura más bonita.',
      'Una que todavía no conocemos por completo, pero que ya nos tiene el corazón lleno.',
    ],
  },

  chapter3: {
    number: 'III',
    label: 'Hay secretos que merecen celebrarse',
    paragraphs: [
      'Hay una sorpresa que todavía está por descubrirse…',
      'Y no se nos ocurre una forma más bonita de hacerlo que rodeados de las personas que queremos.',
    ],
    revealKicker: 'Te invitamos a nuestro',
    reveal: ['Gender Reveal', 'Baby Shower'] as [string, string],
  },

  chapter4: {
    number: 'IV',
    label: 'Un día para recordar',
    weekday: 'Sábado',
    day: '28',
    monthYear: 'Noviembre 2026',
    time: '4:00 p. m.',
    /** Fecha y hora exactas del evento, con la zona horaria de Colombia (UTC−5). */
    isoDateTime: '2026-11-28T16:00:00-05:00',
    durationHours: 4,
    countdownTitle: 'Faltan',
    countdownLabels: { days: 'Días', hours: 'Horas', minutes: 'Minutos', seconds: 'Segundos' },
    countdownDone: '¡Hoy comienza este capítulo!',
    addToCalendar: 'Agregar al calendario',
    calendarTitle: 'Gender Reveal & Baby Shower',
  },

  chapter5: {
    number: 'V',
    label: 'El lugar donde nos encontraremos',
    venueName: 'Orquideorama' as string | null,
    address: 'Av. 2 Nte. #48, Olaya Herrera, Cali, Valle del Cauca' as string | null,
    mapsUrl: 'https://maps.app.goo.gl/BF4CZeqT5JXgYqsJ8' as string | null,
    directionsButton: 'Cómo llegar',
    venueNameFallback: 'Lugar por confirmar',
    addressFallback: 'Muy pronto compartiremos la dirección',
  },

  chapter6: {
    number: 'VI',
    label: 'Dress Code',
    quotes: [
      { who: 'Como diría Santi:', what: 'Old Money.', emphasis: true },
      { who: 'Como diría Nati:', what: 'tú ponte lindo, que lo importante es que vengas.', emphasis: false },
    ],
  },

  chapter7: {
    number: 'VII',
    label: 'Un detalle con amor',
    title: 'El mejor regalo es tenerte aquí.',
    paragraphs: [
      'Estamos preparando un día lleno de amor y nos hace muy felices poder compartirlo contigo.',
      'Tu presencia es, sin duda, el regalo más especial. Pero si te nace tener un detalle con nuestro bebé, puedes elegir algo unisex, porque la sorpresa también es parte de esta celebración.',
    ],
  },

  chapter8: {
    number: 'VIII',
    label: '¿Nos acompañas?',
    intro: 'Nos encantaría saber si podremos contar contigo.',
    deadline: null as string | null, // p. ej. 'Por favor confírmanos antes del 20 de noviembre.'
    /** La invitación es individual: por defecto no se pregunta el número de asistentes. */
    askGuestCount: false as boolean,
    maxGuests: 6,
    fields: {
      name: 'Tu nombre',
      namePlaceholder: 'Nombre y apellido',
      attending: '¿Nos acompañas?',
      yes: 'Sí, ahí estaré',
      no: 'No podré asistir',
      guests: 'Número de asistentes',
      guestsHelp: 'Incluyéndote a ti',
    },
    submit: 'Enviar confirmación',
    submitWhatsApp: 'Confirmar por WhatsApp',
    orWhatsApp: 'o confirmar por WhatsApp',
    sending: 'Enviando…',
    successYes: '¡Gracias! Ya eres parte de nuestra historia.',
    successNo: 'Gracias por avisarnos. Te llevaremos en el corazón ese día.',
    error: 'No pudimos guardar tu respuesta. Intenta de nuevo o confírmanos por WhatsApp.',
    whatsappPending: 'El número de WhatsApp aún no está configurado.',
    /** {name} y {attending} se reemplazan; {guests} dentro de whatsappYesGuests. */
    whatsappTemplate: 'Hola Nati y Santi, soy {name}. {attending}',
    whatsappYes: '¡Confirmo mi asistencia al Gender Reveal & Baby Shower! Ahí estaré.',
    whatsappYesGuests: '¡Confirmo mi asistencia al Gender Reveal & Baby Shower! Asistiremos {guests}.',
    whatsappNo: 'Lamentablemente no podré asistir al Gender Reveal & Baby Shower, pero les envío todo mi cariño.',
  },

  chapter9: {
    number: 'IX',
    label: 'El final de nuestra historia… por ahora',
    paragraphs: ['Porque las historias más bonitas no se cuentan solas…', 'Se viven con las personas que queremos.'],
    signoff: 'Con amor,',
    fin: 'Fin… por ahora',
  },

  /** Confirmaciones de asistencia. */
  rsvp: {
    /**
     * URL del servicio donde se guardan las respuestas (opcional).
     * Google Apps Script (ver docs/rsvp-google-sheets.md) o Formspree.
     * Mientras sea `null`, sólo se ofrece WhatsApp y NUNCA se muestra “guardado”.
     */
    endpoint: (import.meta.env.VITE_RSVP_ENDPOINT as string | undefined) || null,
    provider: 'google-apps-script' as 'google-apps-script' | 'formspree',
    /** WhatsApp de Santiago (+57 300 7512688), con indicativo y sin signos. */
    whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || '573007512688',
  },

  music: {
    /** Archivo propio o con licencia en /public/audio (p. ej. 'audio/cancion.mp3').
     *  Si es `null`, suena una melodía original de caja musical generada en el navegador. */
    src: null as string | null,
    volume: 0.55,
    enableLabel: 'Activar música',
    playLabel: 'Reproducir música',
    muteLabel: 'Silenciar música',
  },
} as const;

export type Invitation = typeof invitation;
