/**
 * Interfaz que define un registro en el historial de partidas del usuario.
 * 
 * Almacena información sobre cada sesión de trivia completada,
 * permitiendo al usuario revisar su desempeño a lo largo del tiempo.
 * @interface
 */
export interface HistoryItem {
  /**
   * Fecha y hora en que se completó la partida.
   * Formato ISO 8601 (ej: "2025-12-31T23:59:59Z").
   * @type {string}
   */
  date: string;

  /**
   * Puntuación total obtenida en esta partida.
   * Se calcula en función de las respuestas correctas.
   * @type {number}
   */
  score: number;

  /**
   * Número de preguntas respondidas correctamente en esta partida.
   * @type {number}
   */
  correctAnswers: number;

  /**
   * Número total de preguntas que se presentaron en esta partida.
   * Se utiliza para calcular el porcentaje de acierto.
   * @type {number}
   */
  totalQuestions: number;
}