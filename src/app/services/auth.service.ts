import { Injectable } from "@angular/core";

import { signUp, signIn, signOut, confirmSignUp, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

/**
 * Servicio de autenticación que gestiona el registro, inicio de sesión y cierre de sesión de usuarios.
 * 
 * Integra AWS Amplify para el manejo seguro de credenciales y sesiones.
 * Mantiene en memoria el correo electrónico del usuario autenticado actual
 * para acceso rápido sin consultas repetidas a AWS Amplify.
 * 
 * @injectable
 */
@Injectable({
  providedIn: "root",
})
export class AuthService {
  
  /**
   * Correo electrónico del usuario autenticado actualmente.
   * Se mantiene en memoria tras login exitoso o verificación de sesión activa.
   * @private
   * @type {string}
   */
  private currentEmail: string = "";
  private currentUserId: string = "";

  constructor() {}

  /**
   * Registra un nuevo usuario en el sistema de autenticación.
   * 
   * Envía una solicitud de registro a AWS Amplify con el correo y contraseña proporcionados.
   * Genera un código de confirmación que se envía al correo del usuario para validar la cuenta.
   * @async
   * @param {string} email - Correo electrónico del nuevo usuario.
   * @param {string} password - Contraseña del nuevo usuario.
   * @returns {Promise<any>} Respuesta de AWS Amplify con información del registro.
   */
  async register(email: string, password: string) {
    return signUp({ username: email, password });
  }

  /**
   * Confirma el registro de un usuario validando el código de confirmación.
   * 
   * Completa el proceso de registro después de que el usuario ingresa
   * el código de confirmación recibido en su correo electrónico.
   * @async
   * @param {string} email - Correo electrónico del usuario registrándose.
   * @param {string} codigo - Código de confirmación enviado al correo del usuario.
   * @returns {Promise<any>} Respuesta de AWS Amplify confirmando el registro.
   */
  async confirmarRegistro(email: string, codigo: string) {
    return confirmSignUp({ username: email, confirmationCode: codigo });
  }

  /**
   * Autentica un usuario existente con su correo y contraseña.
   * 
   * Si el login es exitoso, almacena el correo en memoria para acceso rápido.
   * El comentario original indica que se mantiene el nombre "login" por compatibilidad
   * con el resto de la aplicación.
   * @async
   * @param {string} email - Correo electrónico del usuario.
   * @param {string} password - Contraseña del usuario.
   * @returns {Promise<any>} Respuesta de AWS Amplify con información de sesión.
   */
  async login(email: string, password: string) {
    const response = await signIn({ username: email, password });
    if (response.isSignedIn) {
      await this.getCurrentUser();
    }
    return response;
  }

  /**
   * Cierra la sesión del usuario autenticado actualmente.
   * 
   * Limpia el correo almacenado en memoria y solicita a AWS Amplify que cierre la sesión.
   * @async
   * @returns {Promise<void>} Promesa que se resuelve cuando la sesión se cierra exitosamente.
   */
  async logout() {
    this.currentEmail = "";
    this.currentUserId = "";
    return signOut();
  }

  /**
   * Obtiene la información del usuario autenticado actualmente.
   * 
   * Consulta AWS Amplify para verificar si hay una sesión activa.
   * Si hay sesión, extrae y almacena el correo del usuario.
   * Retorna null si no hay usuario autenticado o si ocurre un error.
   * @async
   * @returns {Promise<any|null>} Objeto de usuario de AWS Amplify o null si no autenticado.
   */
  async getCurrentUser(): Promise<any | null> {
    try {
      const user = await getCurrentUser();
      this.currentEmail = user.signInDetails?.loginId || "";
      this.currentUserId = user.userId || user.username || this.currentEmail;
      return user;
    } catch (error) {
      this.currentEmail = "";
      this.currentUserId = "";
      return null; 
    }
  }

  /**
   * Obtiene el correo electrónico del usuario autenticado actualmente.
   * 
   * Acceso rápido al correo almacenado en memoria sin hacer consultas a AWS Amplify.
   * Retorna una cadena vacía si no hay usuario autenticado.
   * @returns {string} Correo electrónico del usuario autenticado o cadena vacía.
   */
  get userEmail(): string {
    return this.currentEmail;
  }

  get userStorageScope(): string {
    return this.currentUserId || this.currentEmail || "anonymous";
  }

  /**
   * Obtiene el token JWT de la sesión autenticada actual.
   * 
   * Consulta AWS Amplify para recuperar el token de identidad JWT
   * que se utiliza para autenticar solicitudes a servicios backend.
   * Retorna null si no hay sesión activa o si ocurre un error.
   * @async
   * @returns {Promise<string|null>} Token JWT como cadena o null si no disponible.
   */
  async obtenerTokenJWT() {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString() || null;
    } catch (error) {
      return null;
    }
  }
}
