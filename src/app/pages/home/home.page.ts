import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Página principal de la aplicación que actúa como hub de navegación.
 * 
 * Proporciona acceso a todas las secciones principales de la aplicación:
 * trivia, perfil, ranking, historial, wiki y gestión de sesión.
 * Es la pantalla central desde la cual el usuario puede acceder a todas las funcionalidades.
 * 
 * **Servicios consumidos:**
 * - AuthService: Para cerrar sesión del usuario.
 * - Router: Para navegación entre pantallas.
 * 
 * **Acciones disponibles para el usuario:**
 * - Acceder a la sección de trivia
 * - Editar su perfil
 * - Ver el ranking de jugadores
 * - Consultar historial de partidas
 * - Explorar la wiki de Star Wars
 * - Ver detalles de planetas
 * - Cerrar sesión
 * 
 * @component
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Navega a la página de trivia para iniciar una nueva partida.
   * @returns {void}
   */
  goToTrivia() {
    this.router.navigateByUrl('/trivia');
  }

  /**
   * Navega a la página de perfil del usuario.
   * @returns {void}
   */
  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

  /**
   * Navega a la página de ranking diario de jugadores.
   * @returns {void}
   */
  goToRanking() {
    this.router.navigateByUrl('/ranking');
  }

  /**
   * Navega a la página de historial de partidas del usuario.
   * @returns {void}
   */
  goToHistory() {
    this.router.navigateByUrl('/history');
  }

  /**
   * Navega a la página principal de la wiki de Star Wars.
   * @returns {void}
   */
  goToWiki() {
    this.router.navigateByUrl('/wiki');
  }

  /**
   * Navega a la página de detalle de un planeta.
   * @returns {void}
   */
  goToPlanetDetail() {
    this.router.navigateByUrl('/planet-detail');
  }

  /**
   * Cierra la sesión del usuario autenticado y redirige a la página de login.
   * 
   * Solicita al AuthService que cierre la sesión en AWS Amplify,
   * luego redirige a la página de login reemplazando el historial de navegación.
   * @async
   * @returns {Promise<void>} Promesa que se resuelve cuando la sesión se cierra.
   */
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
