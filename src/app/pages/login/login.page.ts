import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async login() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Completá email y contraseña';
      return;
    }

    try {
      this.loading = true;
      const result = await this.authService.login(this.email, this.password);

      if (result.isSignedIn) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        this.errorMessage = 'No se pudo completar el inicio de sesión';
      }
    } catch (error: any) {
      this.errorMessage = error?.message || 'No se pudo iniciar sesión';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}