import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

/**
 * Página de registro de nuevos usuarios con verificación por código.
 * 
 * Implementa un flujo de dos pasos:
 * 1. Registro inicial: El usuario ingresa correo y contraseña
 * 2. Confirmación: El usuario ingresa el código de 6 dígitos enviado por AWS Amplify
 * 
 * Valida que la contraseña tenga al menos 6 caracteres.
 * Captura mensajes de error detallados de AWS (usuario duplicado, contraseña débil, etc).
 * 
 * **Servicios consumidos:**
 * - AuthService: Para registrar usuario y confirmar código de verificación.
 * - Router: Para navegación después del registro exitoso.
 * 
 * **Acciones disponibles para el usuario:**
 * - Ingresar correo y contraseña
 * - Registrarse (paso 1)
 * - Ingresar código de verificación recibido por correo
 * - Confirmar código y completar registro (paso 2)
 * - Retroceder entre pasos
 * - Retornar a la página de login
 * 
 * @component
 */
@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage {
  /**
   * Correo electrónico ingresado por el usuario para registro.
   * @type {string}
   */
  email = "";

  /**
   * Contraseña ingresada por el usuario (debe tener al menos 6 caracteres).
   * @type {string}
   */
  password = "";

  /**
   * Mensaje de error a mostrar si el registro o confirmación falla.
   * Se vacía cada intento de registro o confirmación.
   * @type {string}
   */
  errorMessage = "";

  /**
   * Indica si se está procesando una solicitud (registro o confirmación).
   * Usado para mostrar indicador de carga en la interfaz.
   * @type {boolean}
   */
  loading = false;

  /**
   * Código de 6 dígitos enviado por AWS Amplify para confirmar el correo.
   * Se utiliza en el paso 2 del flujo de registro.
   * @type {string}
   */
  codigo = "";

  /**
   * Bandera que controla qué paso del flujo está activo.
   * false = Paso 1: Formulario de registro (correo y contraseña)
   * true = Paso 2: Formulario de confirmación (código de 6 dígitos)
   * @type {boolean}
   */
  pasoConfirmacion = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  /**
   * Inicia el proceso de registro del usuario (Paso 1).
   * 
   * Valida que correo y contraseña no estén vacíos y que la contraseña tenga
   * al menos 6 caracteres. Si la validación es exitosa, solicita el registro a AWS Amplify,
   * que envía un código de confirmación al correo del usuario.
   * Si es exitoso, cambia a pasoConfirmacion para mostrar el formulario de código.
   * @async
   * @returns {Promise<void>}
   */
  async register() {
    this.errorMessage = "";

    if (!this.email || !this.password) {
      this.errorMessage = "Completá email y contraseña";
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = "La contraseña debe tener al menos 6 caracteres";
      return;
    }

    try {
      this.loading = true;
      await this.authService.register(this.email, this.password);
      
      // Cambiar al paso de confirmación
      this.pasoConfirmacion = true;
    } catch (error: any) {
      this.errorMessage = error.message || "No se pudo registrar";
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Confirma el registro con el código de verificación (Paso 2).
   * 
   * Valida que el código no esté vacío, luego solicita a AWS Amplify
   * la confirmación del registro. Si es exitosa, redirige a la página de login.
   * Si el código es incorrecto o ha vencido, muestra un mensaje de error.
   * @async
   * @returns {Promise<void>}
   */
  async confirmarCodigo() {
    this.errorMessage = "";

    if (!this.codigo) {
      this.errorMessage = "Por favor ingresá el código de verificación";
      return;
    }

    try {
      this.loading = true;
      await this.authService.confirmarRegistro(this.email, this.codigo);
      
      // Registro confirmado, ir a login
      this.router.navigateByUrl("/login", { replaceUrl: true });
    } catch (error: any) {
      this.errorMessage = error.message || "Código incorrecto o vencido";
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Controla el comportamiento del botón "Volver" según el paso actual.
   * 
   * Si está en paso 2 (confirmación), retrocede al paso 1 (formulario de registro).
   * Si está en paso 1, redirige a la página de login.
   * Limpia los errores al retroceder.
   * @returns {void}
   */
  goBack() {
    if (this.pasoConfirmacion) {
      // Retroceder al formulario inicial
      this.pasoConfirmacion = false;
      this.codigo = "";
      this.errorMessage = "";
    } else {
      // Ir a login
      this.router.navigateByUrl("/login");
    }
  }
}