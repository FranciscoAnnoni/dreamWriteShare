// Función para validar si el texto tiene sentido
export const isValidIdea = (text: string): boolean => {
  const cleanText = text.toLowerCase().trim();
  
  // 1. Verificar repetición excesiva de caracteres (como "hahahaha", "lalalalala")
  const repeatedPattern = /(.)\1{4,}|(.{1,3})\2{3,}/;
  if (repeatedPattern.test(cleanText)) {
    return false;
  }
  
  // 2. Verificar que no sea solo teclado random (como "sdfskjfskjf")
  const keyboardPatterns = [
    /^[qwertyuiop]+$/,
    /^[asdfghjkl]+$/,
    /^[zxcvbnm]+$/,
    /^[qwerty]+$/,
    /^[asdfgh]+$/,
    /^[zxcvb]+$/,
    /^[poiuyt]+$/,
    /^[lkjhgf]+$/,
    /^[mnbvcx]+$/
  ];
  
  if (keyboardPatterns.some(pattern => pattern.test(cleanText))) {
    return false;
  }
  
  // 3. Verificar que contenga al menos algunas vocales y consonantes
  const vowels = (cleanText.match(/[aeiouáéíóú]/g) || []).length;
  const consonants = (cleanText.match(/[bcdfghjklmnpqrstvwxyzñ]/g) || []).length;
  
  if (vowels === 0 || consonants === 0) {
    return false;
  }
  
  // 4. Verificar que no sea todo mayúsculas (spam común)
  if (text === text.toUpperCase() && text.length > 20) {
    return false;
  }
  
  // 5. Verificar que tenga al menos 2 palabras diferentes
  const words = cleanText.split(/\s+/).filter(word => word.length > 2);
  const uniqueWords = new Set(words);
  
  if (words.length >= 2 && uniqueWords.size < 2) {
    return false;
  }
  
  return true;
};

// Función adicional para obtener un mensaje específico del error
export const getValidationMessage = (text: string): string => {
  const cleanText = text.toLowerCase().trim();
  
  // Verificar tipos específicos de errores para dar mensajes más precisos
  const repeatedPattern = /(.)\1{4,}|(.{1,3})\2{3,}/;
  if (repeatedPattern.test(cleanText)) {
    return 'Please avoid excessive repetition of characters or patterns';
  }
  
  const keyboardPatterns = [
    /^[qwertyuiop]+$/,
    /^[asdfghjkl]+$/,
    /^[zxcvbnm]+$/,
    /^[qwerty]+$/,
    /^[asdfgh]+$/,
    /^[zxcvb]+$/,
    /^[poiuyt]+$/,
    /^[lkjhgf]+$/,
    /^[mnbvcx]+$/
  ];
  
  if (keyboardPatterns.some(pattern => pattern.test(cleanText))) {
    return 'Please write real words instead of random keyboard characters';
  }
  
  const vowels = (cleanText.match(/[aeiouáéíóú]/g) || []).length;
  const consonants = (cleanText.match(/[bcdfghjklmnpqrstvwxyzñ]/g) || []).length;
  
  if (vowels === 0 || consonants === 0) {
    return 'Please write a proper idea with real words';
  }
  
  if (text === text.toUpperCase() && text.length > 20) {
    return 'Please avoid writing in all capital letters';
  }
  
  const words = cleanText.split(/\s+/).filter(word => word.length > 2);
  const uniqueWords = new Set(words);
  
  if (words.length >= 2 && uniqueWords.size < 2) {
    return 'Please write a more varied idea with different words';
  }
  
  return 'Please write a meaningful idea with real words';
};
