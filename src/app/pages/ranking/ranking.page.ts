import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RankingService } from '../../services/ranking.service';

/**
 * Página de ranking que muestra las puntuaciones más altas del día actual en Firebase.
 * 
 * Carga y muestra el ranking diario de todos los jugadores, ordenado de mayor a menor puntuación.
 * El ranking se reinicia cada 24 horas automáticamente.
 * Los datos se obtienen en tiempo real desde Firebase Firestore.
 * 
 * **Servicios consumidos:**
 * - RankingService: Para recuperar el ranking diario desde Firebase Firestore.
 * - Router: Para navegación.
 * 
 * **Acciones disponibles para el usuario:**
 * - Ver la tabla de clasificación con nombres y puntajes
 * - Ver la posición del usuario en el ranking
 * - Retornar a la página de inicio
 * 
 * @component
 * @implements {OnInit}
 */
@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss']
})
export class RankingPage implements OnInit {

  /**
   * Arreglo de elementos del ranking diario.
   * Cada elemento contiene: name (nombre del jugador) y score (puntuación).
   * Los elementos están ordenados descendentemente por puntuación (mayor a menor).
   * @type {any[]}
   */
  ranking: any[] = [];

  constructor(
    private rankingService: RankingService,
    private router: Router
  ) {}

  /**
   * Inicializa la página cargando el ranking diario desde Firebase.
   * 
   * Se ejecuta automáticamente al cargar la página y recupera los puntajes
   * registrados en el día actual.
   * @async
   * @returns {Promise<void>}
   */
  async ngOnInit() {
    this.ranking = await this.rankingService.getDailyRanking();
  }

  /**
   * Navega de vuelta a la página de inicio.
   * @returns {void}
   */
  goBack() {
    this.router.navigateByUrl('/home');
  }
}