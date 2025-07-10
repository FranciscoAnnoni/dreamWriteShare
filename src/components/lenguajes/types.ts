// Tipos para el sistema de idiomas
export type Language = 'en' | 'es';

export interface Translations {
  // Navegación y menú
  navigation: {
    shareYourIdea: string;
    seeOtherIdeas: string;
    aboutUs: string;
  };

  // Página Share Your Idea
  shareIdea: {
    title: string;
    subtitle: string;
    placeholder: string;
    dailyLimit: string;
    dailyLimitReached: string;
    sendButton: string;
    sendingButton: string;
    comeBackTomorrow: string;
    validation: {
      emptyIdea: string;
      tooShort: string;
      alreadySubmitted: string;
      errorSending: string;
    };
  };

  // Página See Other Ideas
  seeIdeas: {
    title: string;
    subtitle: string;
    noIdeasYet: string;
    noIdeasSubtext: string;
    voteFirstIdea: string;
    voteMoreIdeas: string;
    loading: string;
    sorting: {
      byStars: string;
      byDate: string;
      byViews: string;
    };
  };

  // Diálogo de idea
  ideaDialog: {
    title: string;
    description: string;
    currentRating: string;
    yourVote: string;
    voteThisIdea: string;
    location: string;
    date: string;
    visualizations: string;
    points: string;
    votes: string;
    vote: string;
    voted: string;
    stars: string;
    star: string;
    thankYou: string;
    sending: string;
    notSpecified: string;
  };

  // Modal de votación
  voteModal: {
    title: string;
    subtitle: string;
    noIdeasToVote: string;
    noIdeasSubtext: string;
    rateIdea: string;
    submitVote: string;
    submitting: string;
    skip: string;
    loading: string;
  };

  // About Us
  aboutUs: {
    title: string;
    inspiration: {
      title: string;
      content: string;
    };
    creator: {
      title: string;
      content: string;
      portfolioButton: string;
    };
  };

  // Feedback/Help
  feedback: {
    title: string;
    subtitle: string;
    placeholder: string;
    sendButton: string;
    sending: string;
    cancel: string;
    thankYou: string;
    thankYouSubtext: string;
  };

  // Celebración
  celebration: {
    title: string;
    subtitle: string;
    navigateButton: string;
  };

  // Componentes generales
  common: {
    close: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    yes: string;
    no: string;
    or: string;
    and: string;
    of: string;
    in: string;
    ago: string;
    days: string;
    day: string;
    time: string;
    shareText: string;
    urlCopied: string;
    shareNotAvailable: string;
  };

  // TopIcons
  topIcons: {
    darkMode: string;
    lightMode: string;
    share: string;
    settings: string;
    language: string;
    english: string;
    spanish: string;
  };

  // Fechas y tiempo
  time: {
    now: string;
    today: string;
    yesterday: string;
    daysAgo: string;
    longTimeAgo: string;
  };
}
