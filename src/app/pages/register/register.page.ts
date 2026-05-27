import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage {
  email = "";
  password = "";
  errorMessage = "";
  loading = false;

  // Propiedades nuevas para el flujo de verificación síncrona de Cognito
  codigo = "";
  pasoConfirmacion = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  // PASO 1: Lanza la solicitud de registro inicial en Cognito
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
      
      // Si la promesa se resuelve con éxito, Cognito envió el código. 
      // Cambiamos el estado para mutar la vista del HTML.
      this.pasoConfirmacion = true;
    } catch (error: any) {
      // Captura mensajes detallados de AWS (ej: usuario ya existe, contraseña débil)
      this.errorMessage = error.message || "No se pudo registrar";
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  // PASO 2: Envía el código de 6 dígitos introducido por el usuario
  async confirmarCodigo() {
    this.errorMessage = "";

    if (!this.codigo) {
      this.errorMessage = "Por favor ingresá el código de verificación";
      return;
    }

    try {
      this.loading = true;
      await this.authService.confirmarRegistro(this.email, this.codigo);
      
      // Una vez confirmado el correo de forma exitosa por AWS, 
      // redirigimos de manera segura a la pantalla de login.
      this.router.navigateByUrl("/login", { replaceUrl: true });
    } catch (error: any) {
      this.errorMessage = error.message || "Código incorrecto o vencido";
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  // Control inteligente del botón "Volver"
  goBack() {
    if (this.pasoConfirmacion) {
      // Si se equivoca de mail o quiere cancelar, le permitimos volver al formulario inicial
      this.pasoConfirmacion = false;
      this.codigo = "";
      this.errorMessage = "";
    } else {
      // Si está en el formulario inicial, regresa al login de la app
      this.router.navigateByUrl("/login");
    }
  }
}