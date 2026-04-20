import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage {
  email = '';
  password = '';
  code = '';
  errorMessage = '';
  successMessage = '';
  loading = false;
  step: 'register' | 'confirm' = 'register';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async register() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Completá email y contraseña';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    try {
      this.loading = true;
      const result = await this.authService.register(this.email, this.password);

      if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        this.step = 'confirm';
        this.successMessage = 'Te enviamos un código por email';
      } else {
        this.successMessage = 'Cuenta creada';
        this.router.navigateByUrl('/login');
      }
    } catch (error: any) {
      this.errorMessage = error?.message || 'No se pudo registrar';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async confirmAccount() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.code) {
      this.errorMessage = 'Ingresá el código de confirmación';
      return;
    }

    try {
      this.loading = true;
      await this.authService.confirmRegister(this.email, this.code);
      this.successMessage = 'Cuenta confirmada. Ya podés iniciar sesión.';
      this.router.navigateByUrl('/login');
    } catch (error: any) {
      this.errorMessage = error?.message || 'No se pudo confirmar la cuenta';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async resendCode() {
    this.errorMessage = '';
    this.successMessage = '';

    try {
      this.loading = true;
      await this.authService.resendCode(this.email);
      this.successMessage = 'Código reenviado';
    } catch (error: any) {
      this.errorMessage = error?.message || 'No se pudo reenviar el código';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigateByUrl('/login');
  }
}