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
  updateDoc,
  getDoc
} from "firebase/firestore";
import { db } from "./config";

// Interfaz para un voto individual
export interface IdeaVote {
  userId: string;
  stars: number; // 1-5
}

// Interfaz para las ideas
export interface Idea {
  id?: string;
  idea: string;
  points: number;
  createdAt: Timestamp;
  userId?: string;
  country?: string;
  votes: IdeaVote[]; // Array de votos
  averageStars: number; // Promedio calculado
  totalVotes: number; // Total de votos
  views?: number; // Campo para las vistas
}

// Interfaz para el feedback del usuario
export interface UserFeedback {
  id?: string;
  feedback: string;
  timestamp: Timestamp;
  userId?: string;
}

export const saveIdea = async (ideaText: string, userId?: string, country?: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "ideas"), {
      idea: ideaText,
      points: 0,
      votes: [], // Array vacío de votos
      averageStars: 0, // Promedio inicial
      totalVotes: 0, // Total de votos inicial
      views: 0, // Inicializar vistas en 0
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

// Función para obtener ideas sin votos (totalVotes = 0)
export const getIdeasWithoutVotes = async (limitCount: number = 10): Promise<Idea[]> => {
  try {
    const q = query(
      collection(db, "ideas"), 
      where("totalVotes", "==", 0),
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
    console.error("Error obteniendo las ideas sin votos: ", error);
    throw error;
  }
};

// Función para verificar si un usuario ya votó una idea
export const hasUserVotedIdea = async (ideaId: string, userId: string): Promise<boolean> => {
  try {
    const ideaRef = doc(db, "ideas", ideaId);
    const ideaDoc = await getDoc(ideaRef);
    
    if (ideaDoc.exists()) {
      const idea = ideaDoc.data() as Idea;
      return idea.votes?.some(vote => vote.userId === userId) || false;
    }
    return false;
  } catch (error) {
    console.error("Error verificando voto del usuario:", error);
    return false;
  }
};

// Función para votar una idea
export const voteIdea = async (ideaId: string, stars: number, userId: string): Promise<void> => {
  try {
    // Verificar que el usuario no haya votado ya
    const hasVoted = await hasUserVotedIdea(ideaId, userId);
    if (hasVoted) {
      throw new Error("El usuario ya ha votado esta idea");
    }

    // Crear el nuevo voto
    const newVote: IdeaVote = {
      userId,
      stars
    };

    // Obtener la idea actual
    const ideaRef = doc(db, "ideas", ideaId);
    const ideaDoc = await getDoc(ideaRef);
    
    if (!ideaDoc.exists()) {
      throw new Error("Idea no encontrada");
    }

    const currentIdea = ideaDoc.data() as Idea;
    const currentVotes = currentIdea.votes || [];
    
    // Agregar el nuevo voto
    const updatedVotes = [...currentVotes, newVote];
    
    // Calcular nuevo promedio
    const totalStars = updatedVotes.reduce((sum, vote) => sum + vote.stars, 0);
    const newAverage = totalStars / updatedVotes.length;
    
    // Actualizar la idea
    await updateDoc(ideaRef, {
      votes: updatedVotes,
      averageStars: Math.round(newAverage * 100) / 100, // Redondear a 2 decimales
      totalVotes: updatedVotes.length
    });

    console.log("Voto agregado exitosamente:", { ideaId, stars, userId });
  } catch (error) {
    console.error("Error votando idea:", error);
    throw error;
  }
};

// Función para obtener el voto de un usuario específico para una idea
export const getUserVoteForIdea = async (ideaId: string, userId: string): Promise<IdeaVote | null> => {
  try {
    const ideaRef = doc(db, "ideas", ideaId);
    const ideaDoc = await getDoc(ideaRef);
    
    if (ideaDoc.exists()) {
      const idea = ideaDoc.data() as Idea;
      return idea.votes?.find(vote => vote.userId === userId) || null;
    }
    return null;
  } catch (error) {
    console.error("Error obteniendo voto del usuario:", error);
    return null;
  }
};

// Función para obtener una idea aleatoria sin votos (totalVotes = 0)
export const getRandomIdeaWithoutStars = async (): Promise<Idea | null> => {
  try {
    const q = query(
      collection(db, "ideas"),
      where("totalVotes", "==", 0) // Ideas sin votos
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
      
      const ideasWithoutVotes: Idea[] = [];
      allIdeasSnapshot.forEach((doc) => {
        const idea = { id: doc.id, ...doc.data() } as Idea;
        if (!idea.totalVotes || idea.totalVotes === 0) {
          ideasWithoutVotes.push(idea);
        }
      });
      
      if (ideasWithoutVotes.length === 0) {
        return null;
      }
      
      const randomIndex = Math.floor(Math.random() * ideasWithoutVotes.length);
      return ideasWithoutVotes[randomIndex];
    } catch (fallbackError) {
      console.error("Error en fallback:", fallbackError);
      return null;
    }
  }
};

// Función para obtener ideas con votos (totalVotes > 0)
export const getIdeasWithStars = async (limitCount: number = 10): Promise<Idea[]> => {
  try {
    const q = query(
      collection(db, "ideas"), 
      where("totalVotes", ">", 0),
      orderBy("averageStars", "desc"), // Ordenar por promedio de estrellas descendente
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
    console.error("Error obteniendo las ideas con votos: ", error);
    // Fallback: obtener todas las ideas y filtrar localmente
    try {
      const allIdeasQuery = query(
        collection(db, "ideas"),
        orderBy("createdAt", "desc"),
        limit(limitCount * 2) // Obtener más ideas para filtrar
      );
      const allIdeasSnapshot = await getDocs(allIdeasQuery);
      
      const ideasWithVotes: Idea[] = [];
      allIdeasSnapshot.forEach((doc) => {
        const idea = { id: doc.id, ...doc.data() } as Idea;
        if (idea.totalVotes && idea.totalVotes > 0) {
          ideasWithVotes.push(idea);
        }
      });
      
      // Ordenar por promedio de estrellas descendente
      ideasWithVotes.sort((a, b) => (b.averageStars || 0) - (a.averageStars || 0));
      
      return ideasWithVotes.slice(0, limitCount);
    } catch (fallbackError) {
      console.error("Error en fallback para ideas con votos:", fallbackError);
      throw fallbackError;
    }
  }
};

// Función para incrementar las vistas de una idea
export const incrementIdeaViews = async (ideaId: string): Promise<void> => {
  try {
    const ideaRef = doc(db, "ideas", ideaId);
    await updateDoc(ideaRef, {
      views: (await getDocs(query(collection(db, "ideas"), where("__name__", "==", ideaId))))
        .docs[0]?.data()?.views || 0 + 1
    });
    console.log("Vista incrementada para la idea:", ideaId);
  } catch (error) {
    console.error("Error incrementando vistas:", error);
  }
};

// Función para enviar feedback del usuario
export const submitUserFeedback = async (
  feedbackText: string, 
  userId?: string
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "feedback"), {
      feedback: feedbackText,
      timestamp: Timestamp.now(),
      userId: userId || null
    });
    
    console.log("Feedback enviado con ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error enviando feedback: ", error);
    throw error;
  }
};
