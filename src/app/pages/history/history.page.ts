import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

/**
 * Página de historial que muestra el registro de partidas completadas por el usuario.
 * 
 * Carga y muestra el historial de todas las partidas jugadas, incluyendo fecha, puntuación,
 * respuestas correctas y total de preguntas respondidas.
 * Los registros más recientes aparecen primero.
 * 
 * **Servicios consumidos:**
 * - StorageService: Para recuperar el historial de partidas desde localStorage.
 * - Router: Para navegación.
 * 
 * **Acciones disponibles para el usuario:**
 * - Ver lista de todas las partidas completadas
 * - Ver detalles de cada partida (fecha, puntaje, aciertos)
 * - Retornar a la página de inicio
 * 
 * @component
 * @implements {OnInit}
 */
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss']
})
export class HistoryPage implements OnInit {
  /**
   * Arreglo de registros de partidas del usuario.
   * Cada elemento contiene: date, score, correctAnswers, totalQuestions.
   * Los elementos más recientes están al inicio del arreglo.
   * @type {any[]}
   */
  history: any[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  /**
   * Inicializa la página cargando el historial de partidas desde localStorage.
   * @returns {void}
   */
  ngOnInit(): void {
    this.loadHistory();
  }

  ionViewWillEnter(): void {
    this.loadHistory();
  }

  private loadHistory(): void {
    this.history = this.storageService.getHistory();
  }

  /**
   * Navega de vuelta a la página de inicio.
   * @returns {void}
   */
  goBack() {
    this.router.navigateByUrl('/home');
  }
}
