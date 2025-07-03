// Función para obtener el país del usuario usando ipapi.co (gratuita y simple)
export const getUserCountry = async (): Promise<string> => {
  try {
    console.log('🌍 Obteniendo ubicación del usuario...');
    
    // Usar ipapi.co que es gratuita y no requiere API key
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error('Error al obtener ubicación');
    }
    
    const data = await response.json();
    console.log('✅ País obtenido:', data.country_name);
    
    return data.country_name || 'Desconocido';
  } catch (error) {
    console.warn('⚠️ No se pudo obtener la ubicación:', error);
    
    // Fallback: intentar con otra API
    try {
      const fallbackResponse = await fetch('https://api.country.is/');
      const fallbackData = await fallbackResponse.json();
      console.log('✅ País obtenido (fallback):', fallbackData.country);
      
      // Convertir código de país a nombre completo
      return getCountryName(fallbackData.country) || 'Desconocido';
    } catch (fallbackError) {
      console.warn('⚠️ Fallback también falló:', fallbackError);
      return 'Desconocido';
    }
  }
};

// Función helper para convertir código de país a nombre
const getCountryName = (countryCode: string): string => {
  const countries: { [key: string]: string } = {
    'AR': 'Argentina',
    'US': 'Estados Unidos',
    'ES': 'España',
    'MX': 'México',
    'CL': 'Chile',
    'CO': 'Colombia',
    'PE': 'Perú',
    'FR': 'Francia',
    'IT': 'Italia',
    'DE': 'Alemania',
    'BR': 'Brasil',
    'UY': 'Uruguay',
    'PY': 'Paraguay',
    'BO': 'Bolivia',
    'EC': 'Ecuador',
    'VE': 'Venezuela',
    'CR': 'Costa Rica',
    'GT': 'Guatemala',
    'HN': 'Honduras',
    'NI': 'Nicaragua',
    'PA': 'Panamá',
    'SV': 'El Salvador',
    'DO': 'República Dominicana',
    'CU': 'Cuba',
    'PR': 'Puerto Rico'
  };
  
  return countries[countryCode] || countryCode;
};

// Función para obtener ubicación usando localStorage como cache
export const getCachedUserCountry = async (): Promise<string> => {
  // Verificar si ya tenemos la ubicación en cache (válida por 24 horas)
  const cached = localStorage.getItem('userCountry');
  const cacheTime = localStorage.getItem('userCountryTime');
  
  if (cached && cacheTime) {
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const cacheAge = now - parseInt(cacheTime);
    
    if (cacheAge < twentyFourHours) {
      console.log('✅ Usando país desde cache:', cached);
      return cached;
    }
  }
  
  // Si no hay cache válido, obtener nueva ubicación
  const country = await getUserCountry();
  
  // Guardar en cache
  localStorage.setItem('userCountry', country);
  localStorage.setItem('userCountryTime', Date.now().toString());
  
  return country;
};
