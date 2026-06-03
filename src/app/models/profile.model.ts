/**
 * Interfaz que define la estructura del perfil de usuario en la aplicación.
 * 
 * Almacena preferencias y configuraciones personales del usuario
 * que afectan su experiencia en la aplicación de trivia.
 * @interface
 */
export interface Profile {
  /**
   * Nombre mostrado del usuario en la interfaz de la aplicación.
   * Se utiliza en la página de perfil y en el ranking.
   * @type {string}
   */
  displayName: string;

  /**
   * URL o identificador del avatar del usuario.
   * Se utiliza para mostrar la imagen de perfil del usuario.
   * @type {string}
   */
  avatar: string;

  /**
   * Indica si el usuario desea recibir retroalimentación háptica (vibración) en caso de error.
   * Mejora la experiencia del usuario con retroalimentación táctil en dispositivos compatibles.
   * @type {boolean}
   */
  vibrateOnError: boolean;
}