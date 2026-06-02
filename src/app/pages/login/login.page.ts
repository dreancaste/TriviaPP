import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
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
    private navCtrl: NavController
  ) {}
  async ionViewWillEnter() {
    try {
      //chequeamos usuario activo
      const usuarioActivo = await this.authService.getCurrentUser();
      
      //nos dirigimos con funcion de ionic al home directo
      if (usuarioActivo) {
        this.navCtrl.navigateRoot('/home');
      }
    } catch (error) {
      //si hay error vamos a login ---CHQUEAR SACAR EL CONSOLE LOG---
      console.log('No hay sesión activa, listo para loguear.');
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
      this.navCtrl.navigateRoot('/home', { replaceUrl: true });
    } catch (error) {
      this.errorMessage = 'No se pudo iniciar sesión';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  // Redirije a la pagina registro.

  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}
