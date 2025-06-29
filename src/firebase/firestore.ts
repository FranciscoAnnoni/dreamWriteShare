import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  where,
  Timestamp 
} from "firebase/firestore";
import { db } from "./config";

// Interfaz para las ideas
export interface Idea {
  id?: string;
  idea: string;
  points: number;
  createdAt: Timestamp;
  userId?: string;
}

// Función para guardar una nueva idea
export const saveIdea = async (ideaText: string, userId?: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "ideas"), {
      idea: ideaText,
      points: 0, // Inicializar con 0 puntos
      createdAt: Timestamp.now(),
      userId: userId || null
    });
    console.log("Idea guardada con ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error guardando la idea: ", error);
    throw error;
  }
};

// Función para obtener todas las ideas
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
