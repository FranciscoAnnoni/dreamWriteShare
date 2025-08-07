// Definición de tipos para el sistema de filtrado
type WordCategory = 'discriminatory' | 'offensive' | 'insults';

interface BadWord {
  word: string;
  variations?: string[];
  category: WordCategory;
  language: 'es' | 'en' | 'both';
}

// Lista de palabras prohibidas (se mantiene como const para mejor rendimiento)
const badWords: BadWord[] = [
  // Discriminatorias
  {
    word: 'negro',
    variations: ['negr@', 'negrit@'],
    category: 'discriminatory',
    language: 'es'
  },
  // Insultos generales - español
  {
    word: 'boludo',
    variations: ['bolud@', 'boludx', 'boludos', 'boluda', 'boludas'],
    category: 'insults',
    language: 'es'
  },
  {
    word: 'puto',
    variations: ['put@', 'putx', 'putos', 'puta', 'putas'],
    category: 'offensive',
    language: 'es'
  },
  // Palabras ofensivas - inglés
  {
    word: 'faggot',
    variations: ['fag'],
    category: 'offensive',
    language: 'en'
  },
  // ... más palabras se pueden agregar aquí
];

// Función para normalizar el texto (quitar acentos, convertir a minúsculas)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Función para verificar si una palabra está en la lista negra
const isWordBanned = (word: string): boolean => {
  const normalizedWord = normalizeText(word);
  
  return badWords.some(badWord => {
    // Verificar la palabra principal
    if (normalizeText(badWord.word) === normalizedWord) {
      return true;
    }
    
    // Verificar variaciones
    return badWord.variations?.some(
      variation => normalizeText(variation) === normalizedWord
    ) || false;
  });
};

// Función para verificar el texto usando la API de PurgoMalum
const checkWithPurgoMalum = async (text: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://www.purgomalum.com/service/containsprofanity?text=${encodeURIComponent(text)}`);
    const result = await response.text();
    return result === 'true';
  } catch (error) {
    console.warn('Error al consultar PurgoMalum API, usando verificación local:', error);
    return false;
  }
};

// Función principal para verificar el texto completo
export const containsBadWords = async (text: string): Promise<boolean> => {
  // Primero verificamos localmente
  const words = text.split(/\s+/);
  const hasLocalBadWords = words.some(isWordBanned);
  
  if (hasLocalBadWords) {
    return true;
  }
  
  // Si no encontramos palabras localmente, consultamos la API
  try {
    return await checkWithPurgoMalum(text);
  } catch {
    // Si hay un error con la API, solo usamos la verificación local
    return hasLocalBadWords;
  }
};

// Función para obtener sugerencias de palabras alternativas (para futura implementación)
export const getSuggestions = (badWord: string): string[] => {
  // Aquí se podría implementar un sistema de sugerencias de palabras alternativas
  return [];
};

// Función para censurar palabras prohibidas
export const censorText = (text: string): string => {
  let censoredText = text;
  const words = text.split(/\s+/);
  
  words.forEach(word => {
    if (isWordBanned(word)) {
      // Reemplazar la palabra con asteriscos manteniendo la longitud
      const censored = '*'.repeat(word.length);
      censoredText = censoredText.replace(new RegExp(word, 'gi'), censored);
    }
  });
  
  return censoredText;
};
