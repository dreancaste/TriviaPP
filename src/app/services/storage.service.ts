import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';
import { RankingItem } from '../models/ranking-item.model';
import { HistoryItem } from '../models/history-item.model';
import { AuthService } from './auth.service';

/**
 * Servicio de almacenamiento local que gestiona la persistencia de datos en localStorage.
 * 
 * Administra perfiles de usuario, historial de partidas, ranking de jugadores y estadísticas.
 * El ranking se reinicia automáticamente al comenzar un nuevo día local.
 * 
 * @injectable
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private authService: AuthService) {}

  /**
   * Clave para almacenar el perfil del usuario en localStorage.
   * @private
   * @type {string}
   */
  private PROFILE_KEY = 'sw_profile';

  /**
   * Clave para almacenar el historial de partidas en localStorage.
   * @private
   * @type {string}
   */
  private HISTORY_KEY = 'sw_history';

  /**
   * Clave para almacenar el ranking de jugadores en localStorage.
   * @private
   * @type {string}
   */
  private RANKING_KEY = 'sw_ranking';

  /**
   * Clave para almacenar estadísticas generales del usuario en localStorage.
   * @private
   * @type {string}
   */
  private STATS_KEY = 'sw_stats';

  /**
   * Clave para almacenar la marca de tiempo del último reinicio del ranking en localStorage.
   * Se utiliza para implementar el reinicio automático cada 24 horas.
   * @private
   * @type {string}
   */
  private RANKING_RESET_KEY = 'sw_ranking_reset_time';

  private scopedKey(key: string): string {
    return `${key}:${encodeURIComponent(this.authService.userStorageScope)}`;
  }

  /**
   * Guarda el perfil del usuario en localStorage reemplazando cualquier perfil anterior.
   * @param {Profile} profile - Objeto de perfil del usuario a guardar.
   * @returns {void}
   */
  saveProfile(profile: Profile): void {
    localStorage.setItem(this.scopedKey(this.PROFILE_KEY), JSON.stringify(profile));
  }

  /**
   * Recupera el perfil del usuario desde localStorage.
   * 
   * Retorna el perfil guardado o un perfil por defecto si no existe.
   * El perfil por defecto tiene displayName y avatar vacíos, y vibración habilitada.
   * @returns {Profile} Perfil del usuario o perfil por defecto.
   */
  getProfile(): Profile {
    const data = localStorage.getItem(this.scopedKey(this.PROFILE_KEY));
    return data ? JSON.parse(data) : {
      displayName: '',
      avatar: '',
      vibrateOnError: true
    };
  }

  /**
   * Guarda el historial completo de partidas en localStorage reemplazando el anterior.
   * @param {HistoryItem[]} history - Arreglo de registros de historial a guardar.
   * @returns {void}
   */
  saveHistory(history: HistoryItem[]): void {
    localStorage.setItem(this.scopedKey(this.HISTORY_KEY), JSON.stringify(history));
  }

  /**
   * Recupera el historial completo de partidas desde localStorage.
   * 
   * Retorna el historial guardado o un arreglo vacío si no existe.
   * @returns {HistoryItem[]} Arreglo de registros históricos o arreglo vacío.
   */
  getHistory(): HistoryItem[] {
    const data = localStorage.getItem(this.scopedKey(this.HISTORY_KEY));
    return data ? JSON.parse(data) : [];
  }

  /**
   * Agrega un nuevo registro al inicio del historial de partidas (más reciente primero).
   * 
   * Obtiene el historial actual, inserta el nuevo elemento al inicio
   * y guarda el historial actualizado.
   * @param {HistoryItem} item - Registro de partida a agregar al historial.
   * @returns {void}
   */
  addHistory(item: HistoryItem): void {
    const history = this.getHistory();
    history.unshift(item);
    this.saveHistory(history);
  }

  /**
   * Guarda el ranking completo en localStorage reemplazando el anterior.
   * @param {RankingItem[]} ranking - Arreglo de elementos del ranking a guardar.
   * @returns {void}
   */
  saveRanking(ranking: RankingItem[]): void {
    localStorage.setItem(this.scopedKey(this.RANKING_KEY), JSON.stringify(ranking));
  }

  /**
   * Verifica si comenzó un nuevo día local desde el último reinicio del ranking.
   * 
   * Si no hay marca de tiempo de reinicio anterior, la establece.
   * Si han pasado más de 24 horas, elimina el ranking y actualiza la marca de tiempo.
   * @private
   * @returns {void}
   */
  private checkAndResetRanking(): void {
    const resetKey = this.scopedKey(this.RANKING_RESET_KEY);
    const rankingKey = this.scopedKey(this.RANKING_KEY);
    const lastReset = localStorage.getItem(resetKey);
    const today = this.getLocalDateKey();

    if (!lastReset) {
      localStorage.setItem(resetKey, today);
      return;
    }

    if (lastReset !== today) {
      localStorage.removeItem(rankingKey);
      localStorage.setItem(resetKey, today);
    }
  }

  private getLocalDateKey(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Recupera el ranking actual desde localStorage con reinicio diario local.
   * 
   * Verifica si debe reiniciarse antes de retornar el ranking.
   * Retorna el ranking guardado o un arreglo vacío si no existe.
   * @returns {RankingItem[]} Arreglo de elementos del ranking u arreglo vacío.
   */
  getRanking(): RankingItem[] {
    this.checkAndResetRanking();
    const data = localStorage.getItem(this.scopedKey(this.RANKING_KEY));
    return data ? JSON.parse(data) : [];
  }

  /**
   * Agrega o actualiza un elemento en el ranking.
   * 
   * Verifica si el jugador ya existe en el ranking. Si existe, actualiza su puntaje
   * solo si el nuevo puntaje es mayor. Si no existe, lo agrega.
   * El ranking se ordena descendentemente por puntaje y se mantiene limitado a 20 elementos.
   * @param {RankingItem} item - Elemento del ranking a agregar o actualizar.
   * @returns {void}
   */
  addRankingItem(item: RankingItem): void {
    this.checkAndResetRanking();

    const ranking = this.getRanking();

    const existingIndex = ranking.findIndex(
      (r: RankingItem) => r.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
    );

    if (existingIndex !== -1) {
      if (item.score > ranking[existingIndex].score) {
        ranking[existingIndex] = item;
      }
    } else {
      ranking.push(item);
    }

    ranking.sort((a: RankingItem, b: RankingItem) => b.score - a.score);
    localStorage.setItem(this.scopedKey(this.RANKING_KEY), JSON.stringify(ranking.slice(0, 20)));
  }

  /**
   * Elimina completamente el ranking de localStorage.
   * 
   * Se utiliza típicamente para iniciar una nueva competencia o limpiar datos.
   * @returns {void}
   */
  clearRanking(): void {
    localStorage.removeItem(this.scopedKey(this.RANKING_KEY));
  }

  /**
   * Guarda las estadísticas generales del usuario en localStorage.
   * 
   * Las estadísticas incluyen juegos jugados, respuestas correctas totales y puntuación máxima.
   * @param {any} stats - Objeto de estadísticas a guardar.
   * @returns {void}
   */
  saveStats(stats: any): void {
    localStorage.setItem(this.scopedKey(this.STATS_KEY), JSON.stringify(stats));
  }

  /**
   * Recupera las estadísticas generales del usuario desde localStorage.
   * 
   * Retorna las estadísticas guardadas o estadísticas por defecto (todos los contadores en cero).
   * @returns {any} Objeto de estadísticas con propiedades gamesPlayed, correctAnswers y maxScore.
   */
  getStats(): any {
    const data = localStorage.getItem(this.scopedKey(this.STATS_KEY));
    return data ? JSON.parse(data) : {
      gamesPlayed: 0,
      correctAnswers: 0,
      maxScore: 0
    };
  }

  /**
   * Actualiza las estadísticas del usuario después de completar una partida.
   * 
   * Incrementa el contador de juegos jugados, agrega las respuestas correctas
   * y actualiza la puntuación máxima si la partida actual la supera.
   * @param {number} score - Puntaje obtenido en la partida.
   * @param {number} correctCount - Número de respuestas correctas en la partida.
   * @returns {void}
   */
  updateStats(score: number, correctCount: number): void {
    const stats = this.getStats();
    stats.gamesPlayed += 1;
    stats.correctAnswers += correctCount;

    if (score > stats.maxScore) {
      stats.maxScore = score;
    }

    this.saveStats(stats);
  }
}
