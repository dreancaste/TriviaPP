import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async register() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Completá email y contraseña';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    try {
      this.loading = true;
      await this.authService.register(this.email, this.password);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error) {
      this.errorMessage = 'No se pudo registrar';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigateByUrl('/login');
  }
}
