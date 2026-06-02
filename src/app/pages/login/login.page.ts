import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
    // Al iniciar la página, se verifica si ya hay una sesión activa. Si es así, se redirige al menú/home.
    async ngOnInit() {
    // Verificar si ya hay sesión activa
    const user = await this.authService.getCurrentUser();
    if (user) {
      // Si hay sesión → redirigir al menú/home
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }
  }
  
  // Login, requiere email y contrasenia correcta.

  async login() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Completá email y contraseña';
      return;
    }

    try {
      this.loading = true;
      await this.authService.login(this.email, this.password);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error) {
      this.errorMessage = 'No se pudo iniciar sesión';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  // Redirije a la pagina registro.

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}
