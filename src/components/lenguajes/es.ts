import type { Translations } from './types';

export const spanishTranslations: Translations = {
  // Navegación y menú
  navigation: {
    shareYourIdea: 'Comparte tu idea',
    seeOtherIdeas: 'Ver otras ideas',
    aboutUs: 'Acerca de Nosotros',
  },

  // Página Share Your Idea
  shareIdea: {
    title: 'Comparte tu idea',
    subtitle: 'Una idea simple puede cambiarlo todo.',
    placeholder: '¿Y si existiera una app que...?',
    dailyLimit: 'Puedes compartir una idea por día',
    dailyLimitReached: '¡Ya compartiste tu idea de hoy. Vuelve mañana!',
    sendButton: 'Enviar Idea',
    sendingButton: 'Enviando...',
    comeBackTomorrow: 'Vuelve mañana',
    validation: {
      emptyIdea: 'Por favor escribe tu idea antes de enviarla',
      tooShort: 'Tu idea debe tener al menos 10 caracteres',
      alreadySubmitted: '¡Ya compartiste una idea hoy. Vuelve mañana!',
      errorSending: 'Hubo un error al enviar tu idea. Por favor intenta de nuevo.',
    },
  },

  // Página See Other Ideas
  seeIdeas: {
    title: 'Ver otras ideas',
    subtitle: 'Descubre ideas increíbles de nuestra comunidad. Inspírate, vota y ve lo que otros están creando.',
    noIdeasYet: '¡No hay ideas aún!',
    noIdeasSubtext: 'Sé el primero en compartir una idea.',
    voteFirstIdea: 'Votar una Idea',
    voteMoreIdeas: 'Votar Más Ideas',
    loading: 'Cargando ideas...',
    sorting: {
      byStars: '⭐ Ordenar por estrellas',
      byDate: '📅 Ordenar por fecha',
      byViews: '👁️ Ordenar por vistas',
    },
  },

  // Diálogo de idea
  ideaDialog: {
    title: '💡 Detalle de la Idea',
    description: '📝 Descripción',
    currentRating: '📊 Valoración Actual',
    yourVote: '✅ Tu Voto',
    voteThisIdea: '🌟 Votar Esta Idea',
    location: '🌍 Ubicación',
    date: '📅 Fecha',
    visualizations: '🎯 Visualizaciones',
    points: 'puntos',
    votes: 'votos',
    vote: 'voto',
    voted: 'Votaste',
    stars: 'estrellas',
    star: 'estrella',
    thankYou: '¡Gracias por tu voto!',
    sending: 'Enviando...',
    notSpecified: 'No especificada',
  },

  // Modal de votación
  voteModal: {
    title: '🌟 Votar Ideas',
    subtitle: 'Ayuda a la comunidad calificando ideas aleatorias',
    noIdeasToVote: '¡No hay ideas para votar!',
    noIdeasSubtext: 'Todas las ideas han sido calificadas o no hay ideas aún.',
    rateIdea: 'Califica esta idea',
    submitVote: 'Enviar Voto',
    submitting: 'Enviando...',
    skip: 'Saltar',
    loading: 'Cargando idea...',
  },

  // About Us
  aboutUs: {
    title: 'Acerca de Nosotros',
    inspiration: {
      title: '✨ Nuestra Visión',
      content: 'En DreamWriteShare creemos que las grandes ideas nacen de pensamientos simples. Aquí, la creatividad y la comunidad se unen para inspirar el cambio.',
   },
    creator: {
      title: '👨‍💻 Conoce al Creador',
      content: '¡Hola! Soy Francisco Annoni, un desarrollador que cree en el poder de las ideas para transformar. DreamWriteShare nació como un espacio para compartir creatividad y conectar personas. Si querés apoyar mi trabajo, cualquier aporte es bienvenido.',
     portfolioButton: 'Ver Portfolio',
      donateButton: 'Apoyar el Desarrollo'
    }
  },

  // Feedback/Help
  feedback: {
    title: 'Ayúdanos a Mejorar',
    subtitle: '¡Nos encantaría escuchar tus ideas! Comparte cualquier sugerencia, problema o idea para ayudarnos a mejorar la experiencia de la app.',
    placeholder: 'Cuéntanos qué piensas... (ej: nuevas funciones, mejoras, errores)',
    sendButton: 'Enviar Comentario',
    sending: 'Enviando...',
    cancel: 'Cancelar',
    thankYou: '¡Gracias por tu comentario!',
    thankYouSubtext: 'Tus sugerencias nos ayudan a hacer la app mejor para todos.',
  },

  // Componente LetAiImprovement
  improvement: {
    title: 'Ayúdanos a Mejorar',
    subtitle: '¡Nos encantaría escuchar tus ideas! Comparte cualquier sugerencia, problema o idea para ayudarnos a mejorar la experiencia de la app.',
    placeholder: 'Cuéntanos qué piensas... (ej: nuevas funciones, mejoras, errores)',
    sendButton: 'Enviar Comentario',
    sending: 'Enviando...',
    cancel: 'Cancelar',
    thankYou: '¡Gracias por tu comentario!',
    thankYouSubtext: 'Tus sugerencias nos ayudan a hacer la app mejor para todos.',
  },

  // Celebración
  celebration: {
    title: '¡Idea Compartida Exitosamente!',
    subtitle: 'Tu creatividad ha sido añadida a nuestra comunidad.',
    navigateButton: 'Ver Otras Ideas',
  },

  // Componentes generales
  common: {
    close: 'Cerrar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    yes: 'Sí',
    no: 'No',
    or: 'o',
    and: 'y',
    of: 'de',
    in: 'en',
    ago: 'hace',
    days: 'días',
    day: 'día',
    time: 'tiempo',
    shareText: '¡Echa un vistazo a esta increíble app para compartir ideas!',
    urlCopied: '¡URL copiada al portapapeles!',
    shareNotAvailable: 'Función de compartir no disponible',
  },

  // TopIcons
  topIcons: {
    darkMode: 'Cambiar a modo oscuro',
    lightMode: 'Cambiar a modo claro',
    share: 'Compartir',
    settings: 'Configuración',
    language: 'Idioma',
    english: 'Inglés',
    spanish: 'Español',
  },

  // Fechas y tiempo
  time: {
    now: 'Ahora mismo',
    today: 'Hoy',
    yesterday: 'Ayer',
    daysAgo: 'días atrás',
    longTimeAgo: 'Hace mucho tiempo',
  },
};
