/**
 * Interfaz que define un elemento en la tabla de clasificación (ranking) de jugadores.
 * 
 * Representa el desempeño de un usuario en la aplicación de trivia,
 * utilizado para mostrar la competencia y comparación entre jugadores.
 * @interface
 */
export interface RankingItem {
  /**
   * Nombre del jugador en la tabla de clasificación.
   * Generalmente corresponde al displayName del perfil del usuario.
   * @type {string}
   */
  name: string;

  /**
   * Puntuación acumulada del jugador en la aplicación.
   * Se incrementa con cada respuesta correcta.
   * @type {number}
   */
  score: number;

  /**
   * Fecha de la última actualización del puntaje (opcional).
   * Formato ISO 8601 (ej: "2025-12-31T23:59:59Z").
   * @type {string}
   * @optional
   */
  date?: string;

  /**
   * Identificador estable de la cuenta que obtuvo el puntaje.
   */
  accountId?: string;

  /**
   * Fecha y hora en la que la cuenta alcanzó su mejor puntaje diario.
   */
  updatedAt?: any;
}
