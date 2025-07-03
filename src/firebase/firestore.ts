import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  where,
  Timestamp,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "./config";

// Interfaz para las ideas
export interface Idea {
  id?: string;
  idea: string;
  points: number;
  createdAt: Timestamp;
  userId?: string;
  country?: string;
  stars?: number; // Campo para las estrellas (0-5)
}

export const saveIdea = async (ideaText: string, userId?: string, country?: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "ideas"), {
      idea: ideaText,
      points: 0,
      stars: 0, // Inicializar estrellas en 0
      createdAt: Timestamp.now(),
      userId: userId || null,
      country: country || null
    });
    console.log("Idea guardada con ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error guardando la idea: ", error);
    throw error;
  }
};

export const getIdeas = async (limitCount: number = 10): Promise<Idea[]> => {
  try {
    const q = query(
      collection(db, "ideas"), 
      orderBy("createdAt", "desc"), 
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    const ideas: Idea[] = [];
    querySnapshot.forEach((doc) => {
      ideas.push({
        id: doc.id,
        ...doc.data()
      } as Idea);
    });
    
    return ideas;
  } catch (error) {
    console.error("Error obteniendo las ideas: ", error);
    throw error;
  }
};

// Función para verificar si un usuario ya envió una idea hoy
export const hasUserSubmittedToday = async (userId: string): Promise<boolean> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);
    
    const q = query(
      collection(db, "ideas"),
      where("userId", "==", userId),
      where("createdAt", ">=", todayTimestamp)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error: any) {
    // Si el error es por falta de índice, simplemente devolvemos false
    // para permitir que la funcionalidad continúe
    if (error?.code === 'failed-precondition' && error?.message?.includes('index')) {
      console.warn("🔄 Firebase index is building or not ready yet. Using local storage only. This will resolve automatically once the index is ready.");
      return false;
    }
    console.error("Error verificando ideas del día: ", error);
    // En lugar de lanzar el error, retornamos false para no romper la funcionalidad
    return false;
  }
};

// Función para probar si el índice de Firebase está listo
export const testFirebaseIndex = async (): Promise<boolean> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);
    
    // Hacer una consulta simple con un userId de prueba
    const q = query(
      collection(db, "ideas"),
      where("userId", "==", "test-user"),
      where("createdAt", ">=", todayTimestamp)
    );
    
    await getDocs(q);
    console.log("✅ Firebase index is ready!");
    return true;
  } catch (error: any) {
    if (error?.code === 'failed-precondition' && error?.message?.includes('index')) {
      console.log("🔄 Firebase index is still building...");
      return false;
    }
    console.warn("Unexpected error testing Firebase index:", error);
    return false;
  }
};

// Función para obtener ideas sin estrellas (stars = 0)
export const getIdeasWithoutStars = async (limitCount: number = 10): Promise<Idea[]> => {
  try {
    const q = query(
      collection(db, "ideas"), 
      where("stars", "==", 0),
      orderBy("createdAt", "desc"), 
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    const ideas: Idea[] = [];
    querySnapshot.forEach((doc) => {
      ideas.push({
        id: doc.id,
        ...doc.data()
      } as Idea);
    });
    
    return ideas;
  } catch (error) {
    console.error("Error obteniendo las ideas sin estrellas: ", error);
    throw error;
  }
};

// Función para guardar las estrellas de una idea
export const saveIdeaStars = async (ideaId: string, stars: number): Promise<void> => {
  try {
    const ideaRef = doc(db, "ideas", ideaId);
    await updateDoc(ideaRef, {
      stars: stars
    });
    console.log("Estrellas guardadas para la idea ID: ", ideaId);
  } catch (error) {
    console.error("Error guardando las estrellas de la idea: ", error);
    throw error;
  }
};

// Función para obtener una idea aleatoria sin estrellas (stars = 0)
export const getRandomIdeaWithoutStars = async (): Promise<Idea | null> => {
  try {
    const q = query(
      collection(db, "ideas"),
      where("stars", "==", 0) // Ideas sin estrellas
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const ideas: Idea[] = [];
    querySnapshot.forEach((doc) => {
      ideas.push({
        id: doc.id,
        ...doc.data()
      } as Idea);
    });
    
    // Seleccionar una idea aleatoria
    const randomIndex = Math.floor(Math.random() * ideas.length);
    return ideas[randomIndex];
  } catch (error) {
    console.error("Error obteniendo idea aleatoria:", error);
    // Si hay error con el índice, obtener todas las ideas y filtrar localmente
    try {
      const allIdeasQuery = query(collection(db, "ideas"));
      const allIdeasSnapshot = await getDocs(allIdeasQuery);
      
      const ideasWithoutStars: Idea[] = [];
      allIdeasSnapshot.forEach((doc) => {
        const idea = { id: doc.id, ...doc.data() } as Idea;
        if (!idea.stars || idea.stars === 0) {
          ideasWithoutStars.push(idea);
        }
      });
      
      if (ideasWithoutStars.length === 0) {
        return null;
      }
      
      const randomIndex = Math.floor(Math.random() * ideasWithoutStars.length);
      return ideasWithoutStars[randomIndex];
    } catch (fallbackError) {
      console.error("Error en fallback:", fallbackError);
      return null;
    }
  }
};

// Función para actualizar las estrellas de una idea
export const updateIdeaStars = async (ideaId: string, stars: number): Promise<void> => {
  try {
    const ideaRef = doc(db, "ideas", ideaId);
    await updateDoc(ideaRef, {
      stars: stars
    });
    console.log("Estrellas actualizadas para la idea:", ideaId);
  } catch (error) {
    console.error("Error actualizando estrellas:", error);
    throw error;
  }
};
