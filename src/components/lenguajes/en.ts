import type { Translations } from './types';

export const englishTranslations: Translations = {
  // Navegación y menú
  navigation: {
    shareYourIdea: 'Share your idea',
    seeOtherIdeas: 'See other ideas',
    aboutUs: 'About Us',
  },

  // Página Share Your Idea
  shareIdea: {
    title: 'Share your idea',
    subtitle: 'A simple idea can change everything.',
    placeholder: 'What if there was an app that...?',
    dailyLimit: 'You can share one idea per day',
    dailyLimitReached: "You've shared your idea for today. Come back tomorrow!",
    sendButton: 'Send Idea',
    sendingButton: 'Sending...',
    comeBackTomorrow: 'Come back tomorrow',
    validation: {
      emptyIdea: 'Please write your idea before submitting',
      tooShort: 'Your idea must be at least 10 characters long',
      alreadySubmitted: 'You have already shared an idea today. Come back tomorrow!',
      errorSending: 'There was an error sending your idea. Please try again.',
      inappropriateLanguage: 'Your idea contains inappropriate language. Please review it and try again.',
    },
  },

  // Página See Other Ideas
  seeIdeas: {
    title: 'See other ideas',
    subtitle: 'Discover amazing ideas from our community. Get inspired, vote, and see what others are creating.',
    noIdeasYet: 'No ideas yet!',
    noIdeasSubtext: 'Be the first to share an idea.',
    voteFirstIdea: 'Vote an Idea',
    voteMoreIdeas: 'Vote More Ideas',
    loading: 'Loading ideas...',
    sorting: {
      byStars: '⭐ Sort by stars',
      byDate: '📅 Sort by date',
      byViews: '👁️ Sort by views',
    },
  },

  // Diálogo de idea
  ideaDialog: {
    title: '💡 Idea Detail',
    description: '📝 Description',
    currentRating: '📊 Current Rating',
    yourVote: '✅ Your Vote',
    voteThisIdea: '🌟 Vote This Idea',
    location: '🌍 Location',
    date: '📅 Date',
    visualizations: '🎯 Visualizations',
    points: 'points',
    votes: 'votes',
    vote: 'vote',
    voted: 'You voted',
    stars: 'stars',
    star: 'star',
    thankYou: 'Thanks for your vote!',
    sending: 'Sending...',
    notSpecified: 'Not specified',
  },

  // Modal de votación
  voteModal: {
    title: '🌟 Vote for Ideas',
    subtitle: 'Help the community by rating random ideas',
    noIdeasToVote: 'No ideas to vote on!',
    noIdeasSubtext: 'All ideas have been rated or there are no ideas yet.',
    rateIdea: 'Rate this idea',
    submitVote: 'Submit Vote',
    submitting: 'Submitting...',
    skip: 'Skip',
    loading: 'Loading idea...',
  },

  // About Us
  aboutUs: {
    title: 'About Us',
    inspiration: {
      title: '✨ Our Vision',
      content: 'We believe great ideas start simple. DreamWriteShare is where creativity and community spark the unexpected.',
    },
    creator: {
      title: '👨‍💻 Meet the Creator',
      content: 'Hi! I\'m Francisco Annoni, a passionate developer who believes in the power of ideas to change the world. If you enjoy what I do and want to support my work, consider making a small contribution — every bit helps me keep creating.',
      portfolioButton: 'Visit Portfolio',
      donateButton: 'Support Development'
    }
  },

  // Feedback/Help
  feedback: {
    title: 'Help Us Improve',
    subtitle: "We'd love to hear your thoughts! Share any suggestions, issues, or ideas to help us improve the app experience.",
    placeholder: 'Tell us what you think... (e.g., new features, improvements, bugs)',
    sendButton: 'Send Feedback',
    sending: 'Sending...',
    cancel: 'Cancel',
    thankYou: 'Thank you for your feedback!',
    thankYouSubtext: 'Your suggestions help us make the app better for everyone.',
  },

  // Componente LetAiImprovement
  improvement: {
    title: 'Help Us Improve',
    subtitle: "We'd love to hear your thoughts! Share any suggestions, issues, or ideas to help us improve the app experience.",
    placeholder: 'Tell us what you think... (e.g., new features, improvements, bugs)',
    sendButton: 'Send Feedback',
    sending: 'Sending...',
    cancel: 'Cancel',
    thankYou: 'Thank you for your feedback!',
    thankYouSubtext: 'Your suggestions help us make the app better for everyone.',
  },

  // Celebración
  celebration: {
    title: 'Idea Shared Successfully!',
    subtitle: 'Your creativity has been added to our community.',
    navigateButton: 'See Other Ideas',
  },

  // Componentes generales
  common: {
    close: 'Close',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    or: 'or',
    and: 'and',
    of: 'of',
    in: 'in',
    ago: 'ago',
    days: 'days',
    day: 'day',
    time: 'time',
    shareText: 'Check out this amazing idea sharing app!',
    urlCopied: 'URL copied to clipboard!',
    shareNotAvailable: 'Share feature not available',
  },

  // TopIcons
  topIcons: {
    darkMode: 'Switch to dark mode',
    lightMode: 'Switch to light mode',
    share: 'Share',
    settings: 'Settings',
    language: 'Language',
    english: 'English',
    spanish: 'Spanish',
  },

  // Fechas y tiempo
  time: {
    now: 'Just now',
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: 'days ago',
    longTimeAgo: 'Long time ago',
  },
};
