// ============================================
// CONFIGURACIÓN SIMPLE DE PALABRAS PROHIBIDAS
// ============================================
// Solo agrega las palabras malas aquí, una por línea:

const bannedWords: string[] = [
  // Insultos en español
  'idiota',
  'estúpido', 
  'tonto',
  'boludo',
  'pelotudo',
  'puto',
  'puta',
  'hijo de puta',
  'cabrón',
  'cabron',
  'pendejo',
  'imbécil',
  'imbecil',
  'gilipollas',
  'capullo',
  'coño',
  'joder',
  'mierda',
  'carajo',
  'pinche',
  
  // Palabras discriminatorias
  'negro', // cuando se usa como insulto
  'maricón',
  'maricon', 
  'faggot',
  'retrasado',
  'mongolito',
  
  // Insultos en inglés
  'stupid',
  'idiot', 
  'moron',
  'retard',
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'damn',
  'hell',
  
  // Agregar más palabras aquí fácilmente:
  // 'nueva_palabra_mala',
  // 'otra_palabra',
];

// ============================================
// SUGERENCIAS DE PALABRAS ALTERNATIVAS
// ============================================
// Mapeo simple: palabra mala -> alternativas positivas

const wordAlternatives: Record<string, string[]> = {
  // Insultos generales
  'idiota': ['persona', 'amigo', 'compañero'],
  'estúpido': ['confundido', 'equivocado', 'poco informado'],
  'tonto': ['ingenuo', 'novato', 'principiante'],
  'boludo': ['amigo', 'compañero', 'tipo'],
  'pelotudo': ['amigo', 'compañero', 'persona'],
  'imbécil': ['persona', 'individuo', 'alguien'],
  'imbecil': ['persona', 'individuo', 'alguien'],
  
  // Palabras vulgares
  'puto': ['tipo', 'persona', 'individuo'],
  'puta': ['persona', 'mujer', 'individuo'],
  'mierda': ['cosa', 'problema', 'situación'],
  'carajo': ['rayos', 'cielos', 'demonios'],
  'coño': ['vaya', 'rayos', 'cielos'],
  'joder': ['molestar', 'fastidiar', 'complicar'],
  
  // Términos discriminatorios
  'retrasado': ['persona especial', 'persona con discapacidad'],
  'maricón': ['persona', 'individuo'],
  'maricon': ['persona', 'individuo'],
  
  // Inglés
  'stupid': ['confused', 'mistaken', 'uninformed'],
  'idiot': ['person', 'individual'],
  'moron': ['person', 'individual'],
  'fuck': ['darn', 'gosh'],
  'shit': ['stuff', 'thing'],
  'bitch': ['person', 'individual'],
  'asshole': ['person', 'individual'],
};

// Función para normalizar el texto (quitar acentos, convertir a minúsculas)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Función para verificar si una palabra está en la lista negra (SIMPLIFICADA)
const isWordBanned = (word: string): boolean => {
  const normalizedWord = normalizeText(word);
  
  return bannedWords.some(badWord => {
    const normalizedBadWord = normalizeText(badWord);
    return normalizedBadWord === normalizedWord;
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

// Función para obtener sugerencias de palabras alternativas (SIMPLIFICADA)
export const getSuggestions = (badWord: string): string[] => {
  const normalizedWord = normalizeText(badWord);
  
  // Buscar alternativas en el mapa
  for (const [key, alternatives] of Object.entries(wordAlternatives)) {
    if (normalizeText(key) === normalizedWord) {
      return alternatives;
    }
  }
  
  // Si no encuentra alternativas específicas, devolver genéricas
  return ['persona', 'individuo', 'alguien'];
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
