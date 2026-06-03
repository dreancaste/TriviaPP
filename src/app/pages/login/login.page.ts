import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';

/**
 * Página de inicio de sesión para usuarios existentes.
 * 
 * Autentica usuarios registrados contra AWS Amplify/Cognito.
 * Verifica automáticamente si hay una sesión activa y redirige a inicio si es el caso.
 * Valida credenciales y proporciona retroalimentación de errores.
 * 
 * **Servicios consumidos:**
 * - AuthService: Para autenticar usuario y verificar sesión activa.
 * - NavController: Para navegación entre pantallas (desde Ionic).
 * 
 * **Acciones disponibles para el usuario:**
 * - Ingresar correo y contraseña
 * - Iniciar sesión
 * - Navegar a la página de registro para crear nueva cuenta
 * - Ver mensajes de error si las credenciales son incorrectas
 * 
 * @component
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  /**
   * Correo electrónico ingresado por el usuario.
   * @type {string}
   */
  email = '';

  /**
   * Contraseña ingresada por el usuario.
   * @type {string}
   */
  password = '';

  /**
   * Mensaje de error a mostrar al usuario si la autenticación falla.
   * Se vacía cada vez que el usuario intenta loguear.
   * @type {string}
   */
  errorMessage = '';

  /**
   * Indica si se está procesando una solicitud de inicio de sesión.
   * Usado para mostrar un indicador de carga en la interfaz.
   * @type {boolean}
   */
  loading = false;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) {}

  /**
   * Verifica si hay una sesión activa al entrar a la página.
   * 
   * Si el usuario ya está autenticado, lo redirige directamente a la página de inicio.
   * Si no hay sesión o hay error, el usuario permanece en la página de login.
   * Este ciclo de vida de Ionic se ejecuta cada vez que la página es visible.
   * @async
   * @returns {Promise<void>}
   */
  async ionViewWillEnter() {
    try {
      const usuarioActivo = await this.authService.getCurrentUser();
      
      if (usuarioActivo) {
        this.navCtrl.navigateRoot('/home');
      }
    } catch (error) {
      console.log('No hay sesión activa, listo para loguear.');
    }
  }

  /**
   * Autentica el usuario con el correo y contraseña ingresados.
   * 
   * Valida que ambos campos no estén vacíos antes de procesar.
   * Si la autenticación es exitosa, redirige a la página de inicio.
   * Si hay error, muestra un mensaje de error al usuario.
   * @async
   * @returns {Promise<void>}
   */
  async login() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Completá email y contraseña';
      return;
    }

    try {
      this.loading = true;
      await this.authService.login(this.email, this.password);
      this.navCtrl.navigateRoot('/home', { replaceUrl: true });
    } catch (error) {
      this.errorMessage = 'No se pudo iniciar sesión';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Navega a la página de registro para usuarios nuevos.
   * @returns {void}
   */
  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}
