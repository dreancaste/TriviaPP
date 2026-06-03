import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';

/**
 * Página de perfil del usuario que permite personalizar información y ver estadísticas.
 * 
 * Permite al usuario editar su nombre de perfil, seleccionar una foto de avatar,
 * y habilitar/deshabilitar retroalimentación háptica en respuestas incorrectas.
 * Muestra estadísticas de juego compiladas (partidas jugadas, aciertos totales, puntuación máxima).
 * 
 * **Servicios consumidos:**
 * - StorageService: Para obtener y guardar perfil y estadísticas en localStorage.
 * - AuthService: Para obtener el correo del usuario autenticado.
 * - Camera: Para capturar o seleccionar foto de avatar.
 * - Router: Para navegación.
 * 
 * **Acciones disponibles para el usuario:**
 * - Editar nombre de perfil (displayName)
 * - Seleccionar/cambiar foto de avatar
 * - Habilitar/deshabilitar vibración en errores
 * - Guardar cambios de perfil
 * - Ver estadísticas de juego
 * - Retornar a la página de inicio
 * 
 * @component
 * @implements {OnInit}
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  /**
   * Objeto que contiene la información del perfil del usuario.
   * 
   * Estructura:
   * - displayName: Nombre mostrado en ranking e historial
   * - avatar: URL en formato DataUrl de la foto de perfil
   * - vibrateOnError: Bandera para habilitar vibración en respuestas incorrectas
   * @type {object}
   */
  profile = {
    displayName: '',
    avatar: '',
    vibrateOnError: true
  };

  /**
   * Correo electrónico del usuario autenticado actualmente.
   * Obtenido del servicio de autenticación.
   * @type {string}
   */
  email = '';

  /**
   * Estadísticas generales del usuario en la aplicación.
   * 
   * Estructura:
   * - gamesPlayed: Total de partidas completadas
   * - correctAnswers: Total acumulado de respuestas correctas
   * - maxScore: Puntuación máxima obtenida en una partida
   * @type {object}
   */
  stats = {
    gamesPlayed: 0,
    correctAnswers: 0,
    maxScore: 0
  };

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Inicializa la página cargando el perfil, estadísticas y correo del usuario.
   * @returns {void}
   */
  ngOnInit(): void {
    this.profile = this.storageService.getProfile();
    this.stats = this.storageService.getStats();
    this.email = this.authService.userEmail;
  }

  /**
   * Abre la cámara o galería del dispositivo para seleccionar una foto de perfil.
   * 
   * Permite edición de la imagen, comprime al 70% de calidad y retorna el resultado
   * en formato DataUrl (base64) para almacenamiento local.
   * Si se selecciona correctamente, actualiza el avatar del perfil.
   * @async
   * @returns {Promise<void>}
   */
  async selectPhoto() {
    const image = await Camera.getPhoto({
      quality: 70,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    if (image.dataUrl) {
      this.profile.avatar = image.dataUrl;
    }
  }

  /**
   * Guarda los cambios del perfil en el almacenamiento local.
   * 
   * Persiste los cambios realizados en nombre de usuario, avatar y preferencias de vibración.
   * Muestra una alerta de confirmación al usuario.
   * @returns {void}
   */
  saveProfile() {
    this.storageService.saveProfile(this.profile);
    alert('Perfil guardado');
  }

  /**
   * Navega de vuelta a la página de inicio.
   * @returns {void}
   */
  goBack() {
    this.router.navigateByUrl('/home');
  }
}
