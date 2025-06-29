/**
 * Componente simple para manejar el límite de una idea por día
 * Usa localStorage para almacenar si el usuario ya envió una idea hoy
 * Se resetea automáticamente a las 00:00
 */

export interface DailySubmissionStatus {
  canSubmit: boolean;
  hasSubmittedToday: boolean;
}

export class DailySubmissionManager {
  private static instance: DailySubmissionManager;
  private readonly STORAGE_KEY = 'dreamWriteShare_dailySubmission';

  private constructor() {}

  public static getInstance(): DailySubmissionManager {
    if (!DailySubmissionManager.instance) {
      DailySubmissionManager.instance = new DailySubmissionManager();
    }
    return DailySubmissionManager.instance;
  }

  /**
   * Obtener un ID único para el usuario
   */
  private getUserId(): string {
    let userId = localStorage.getItem('dreamWriteShare_userId');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('dreamWriteShare_userId', userId);
    }
    return userId;
  }

  /**
   * Obtener la fecha de hoy en formato YYYY-MM-DD
   */
  private getTodayString(): string {
    const today = new Date();
    return today.getFullYear() + '-' + 
           String(today.getMonth() + 1).padStart(2, '0') + '-' + 
           String(today.getDate()).padStart(2, '0');
  }

  /**
   * Verificar si el usuario ya envió una idea hoy
   */
  public hasSubmittedToday(): boolean {
    const userId = this.getUserId();
    const todayString = this.getTodayString();
    const storageKey = `${this.STORAGE_KEY}_${userId}`;
    
    const lastSubmissionDate = localStorage.getItem(storageKey);
    
    // Si no hay registro, no ha enviado nada
    if (!lastSubmissionDate) {
      return false;
    }
    
    // Comparar fechas: si es el mismo día, ya envió
    return lastSubmissionDate === todayString;
  }

  /**
   * Verificar si el usuario puede enviar una idea
   */
  public canSubmitToday(): boolean {
    return !this.hasSubmittedToday();
  }

  /**
   * Marcar que el usuario envió una idea hoy
   */
  public markAsSubmittedToday(): void {
    const userId = this.getUserId();
    const todayString = this.getTodayString();
    const storageKey = `${this.STORAGE_KEY}_${userId}`;
    
    localStorage.setItem(storageKey, todayString);
  }

  /**
   * Obtener el estado completo del usuario
   */
  public getSubmissionStatus(): DailySubmissionStatus {
    const hasSubmitted = this.hasSubmittedToday();
    return {
      canSubmit: !hasSubmitted,
      hasSubmittedToday: hasSubmitted
    };
  }

  /**
   * Limpiar datos (para testing o reset manual)
   */
  public clearUserData(): void {
    const userId = this.getUserId();
    const storageKey = `${this.STORAGE_KEY}_${userId}`;
    localStorage.removeItem(storageKey);
  }

  /**
   * Obtener el ID del usuario actual
   */
  public getCurrentUserId(): string {
    return this.getUserId();
  }
}

// Exportar instancia singleton
export const dailySubmissionManager = DailySubmissionManager.getInstance();
