import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de ruta que protege las rutas de la aplicación verificando si el usuario está autenticado.
 * 
 * Implementa la interfaz CanActivate de Angular para validar el acceso a rutas protegidas.
 * Si el usuario no está autenticado, redirige a la página de login.
 * 
 * @injectable
 * @implements {CanActivate}
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Valida si el usuario puede activar una ruta verificando su estado de autenticación.
   * 
   * Consulta el servicio de autenticación para obtener el usuario actual.
   * Si el usuario existe (está autenticado), permite el acceso a la ruta.
   * Si no existe, redirige a la página de login y deniega el acceso.
   * @async
   * @returns {Promise<boolean>} true si el usuario está autenticado y puede acceder; false en caso contrario.
   */
  async canActivate(): Promise<boolean> {
    const user = await this.authService.getCurrentUser();

    if (user) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
