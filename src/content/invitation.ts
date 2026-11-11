/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONTENIDO DE LA INVITACIÓN — una carta personal
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
    /** Nombres de los papás: SOLO aparecen en la firma final. */
    signature: 'Nati y Santi',
  },

  /** Ilustraciones propias (en /public/illustrations). `null` = se usa la ilustración vectorial incluida. */
  illustrations: {
    /** Globo monumental de la apertura (PNG/WebP con transparencia). */
    balloon: null as string | null,
    /** Fondo de cielo pintado a pantalla completa (vertical). `null` = cielo pintado por código. */
    openingSky: null as string | null,
    cloud: null as string | null,
    rockingHorse: 'illustrations/caballito.png' as string | null,
    giftBox: null as string | null,
    stork: null as string | null,
    landscape: null as string | null,
    venue: 'illustrations/lugar.jpg' as string | null,
  },

  /** Apertura (aprobada): el globo trae una carta sellada. */
  opening: {
    envelopeLine: 'Hay algo que queremos contarte…',
    tapHint: 'Toca para descubrir',
    sealLabel: 'Romper el sello y abrir la carta',
    scrollHint: 'Desliza para seguir leyendo',
    replay: 'Ver la apertura de nuevo',
  },

  /**
   * LA CARTA. Se lee de corrido, sin títulos. `emphasis` marca las frases con
   * protagonismo; `opening` son las que aparecen al desplegarse la carta.
   */
  letter: {
    opening: {
      lead: 'Hay cosas que no se planean…',
      follow: 'Y terminan siendo las que más ilusión nos hacen.',
    },
    body: [
      { text: 'Hoy estamos viviendo uno de esos momentos que todavía no sabemos muy bien cómo contar, pero que nos morimos de ganas de compartir con las personas que más queremos.' },
      { text: 'Entre tantos planes, la vida nos sorprendió con uno que no teníamos escrito. Y aquí estamos, esperando a alguien que todavía no conocemos, pero que ya nos tiene el corazón llenito de ilusión.' },
      { text: 'Y aunque esta historia apenas comienza, hay algo que tenemos muy claro: queremos vivirla rodeados de las personas que han sido parte de la nuestra.' },
      { text: 'Por eso, esta carta es para ti.', emphasis: true },
      { text: 'Porque eres una de esas personas que queremos tener cerquita, que hacen más bonitos los momentos importantes y con quienes nos emociona imaginar los recuerdos que vienen.' },
      { text: 'Tenemos una sorpresa por descubrir y muchísimas ganas de celebrarla contigo.', emphasis: true, final: true },
    ] as { text: string; emphasis?: boolean; final?: boolean }[],
  },

  /** La revelación: el momento en que se entiende qué celebramos. */
  reveal: {
    title: ['Gender Reveal', 'Baby Shower'] as [string, string],
  },

  date: {
    weekday: 'Sábado',
    day: '28',
    monthYear: 'Noviembre 2026',
    time: '4:00 p. m.',
    /** Fecha y hora exactas, hora de Colombia (America/Bogota, UTC−5). */
    isoDateTime: '2026-11-28T16:00:00-05:00',
    durationHours: 4,
    countdownTitle: 'Faltan',
    countdownLabels: { days: 'Días', hours: 'Horas', minutes: 'Minutos', seconds: 'Segundos' },
    countdownDone: '¡Hoy es el día!',
    addToCalendar: 'Agregar al calendario',
    calendarTitle: 'Gender Reveal & Baby Shower',
  },

  /** UBICACIÓN — APROBADA. No modificar. */
  venue: {
    label: 'El lugar donde nos encontraremos',
    venueName: 'Orquideorama' as string | null,
    address: 'Av. 2 Nte. #48, Olaya Herrera, Cali, Valle del Cauca' as string | null,
    mapsUrl: 'https://maps.app.goo.gl/BF4CZeqT5JXgYqsJ8' as string | null,
    directionsButton: 'Cómo llegar',
    venueNameFallback: 'Lugar por confirmar',
    addressFallback: 'Muy pronto compartiremos la dirección',
  },

  dressCode: {
    title: 'Dress Code',
    quotes: [
      { who: 'Como diría Santi:', what: 'Old Money.', emphasis: true },
      { who: 'Como diría Nati:', what: 'tú ponte lindo, que lo importante es que vengas.', emphasis: false },
    ],
  },

  gifts: {
    title: 'El mejor regalo es tenerte aquí.',
    paragraphs: [
      'Estamos preparando un día lleno de amor y nos hace muy felices poder compartirlo contigo.',
      'Tu presencia es, sin duda, el regalo más especial. Pero si te nace tener un detalle con nuestro bebé, puedes elegir algo unisex, porque la sorpresa también es parte de esta celebración.',
    ],
  },

  /** Confirmación de asistencia — estrictamente individual (una invitación = una persona). */
  rsvpText: {
    title: '¿Nos acompañas?',
    intro: 'Nos haría mucha ilusión compartir este día contigo. ¿Podemos contar con tu presencia?',
    nameLabel: 'Nombre y apellido',
    namePlaceholder: 'Tu nombre y apellido',
    question: '¿Podrás acompañarnos?',
    yes: '¡Claro que sí!',
    no: 'Esta vez no podré acompañarlos.',
    submit: 'Confirmar mi respuesta',
    sending: 'Guardando tu respuesta…',
    loading: 'Abriendo tu invitación…',
    successYes: '¡Qué felicidad saber que nos acompañarás! Nos vemos pronto.',
    successNo: 'Gracias por hacérnoslo saber. Te tendremos presente en este día tan especial.',
    change: 'Cambiar mi respuesta',
    previousYes: 'Ya nos confirmaste que vienes.',
    previousNo: 'Nos contaste que esta vez no podrás venir.',
    error: 'No pudimos guardar tu respuesta. Revisa tu conexión e inténtalo de nuevo.',
    noLink: 'Para confirmar, abre el enlace personal que te enviamos por WhatsApp.',
    unknownLink: 'No encontramos esta invitación. Verifica que hayas abierto el enlace completo que te enviamos.',
    notConfigured: 'Las confirmaciones todavía no están conectadas.',
  },

  questions: {
    title: '¿Tienes alguna pregunta?',
    text: 'Escríbenos, estaremos felices de ayudarte.',
    button: 'Escríbenos por WhatsApp',
    message: '¡Hola! 🤎 Tengo una preguntita sobre el Gender Reveal & Baby Shower.',
    /** WhatsApp de Santi (+57 300 7512688), con indicativo y sin signos. */
    whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || '573007512688',
  },

  closing: {
    title: 'Qué bonito que seas parte de esto.',
    text: 'Hay momentos que sabemos que vamos a recordar toda la vida. Y nos hace muy felices imaginarte en este.',
    signoff: 'Con amor,',
  },

  /** Servicio de confirmaciones (Google Apps Script). Ver docs/confirmaciones-google-sheets.md */
  rsvp: {
    /** Aplicación web de Apps Script conectada a la hoja privada de Nati. */
    endpoint:
      (import.meta.env.VITE_RSVP_ENDPOINT as string | undefined) ||
      'https://script.google.com/macros/s/AKfycbwPXcpZ74pwNUtzgBixxCttu6UG7pf43YpsdcpP_yRcxpPpTTAdINjPB7PlDQt9moRp1w/exec',
  },

  music: {
    /**
     * Sin música por decisión de Nati y Santi. Si algún día quieren música, poner aquí
     * un archivo autorizado de /public/audio (p. ej. 'audio/cancion.mp3').
     * Mientras sea `null` no suena nada y el botón de música no aparece.
     */
    src: null as string | null,
    title: 'Clair de Lune — Claude Debussy',
    volume: 0.5,
    fadeInSeconds: 4,
    enableLabel: 'Activar música',
    playLabel: 'Reproducir música',
    muteLabel: 'Silenciar música',
  },
} as const;

export type Invitation = typeof invitation;
