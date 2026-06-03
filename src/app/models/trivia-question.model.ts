/**
 * Interfaz que define la estructura de una pregunta de trivia sobre Star Wars.
 * 
 * Contiene todos los elementos necesarios para presentar una pregunta interactiva
 * con opciones múltiples y validación de respuestas.
 * @interface
 */
export interface TriviaQuestion {
  /**
   * Enunciado de la pregunta de trivia.
   * @type {string}
   */
  question: string;

  /**
   * Arreglo de opciones disponibles como respuestas a la pregunta.
   * Generalmente contiene 4 opciones.
   * @type {string[]}
   */
  options: string[];

  /**
   * Respuesta correcta entre las opciones disponibles.
   * Debe coincidir exactamente con una de las opciones.
   * @type {string}
   */
  correctAnswer: string;

  /**
   * Categoría temática de la pregunta (ej: "Lore", "Personajes", "Planetas", "Películas").
   * Se utiliza para organizar y filtrar preguntas.
   * @type {string}
   */
  category: string;
}
