import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RankingService } from '../../services/ranking.service';
import { RankingItem } from '../../models/ranking-item.model';

/**
 * Página de ranking que muestra las puntuaciones más altas del día actual.
 * 
 * Carga el ranking diario global desde Firebase, ordenado de mayor a menor puntuación.
 * El ranking cambia al comenzar un nuevo día en Argentina.
 * 
 * **Servicios consumidos:**
 * - RankingService: Para recuperar el ranking diario global desde Firebase.
 * - Router: Para navegación.
 * 
 * **Acciones disponibles para el usuario:**
 * - Ver la tabla de clasificación con nombres y puntajes
 * - Ver la posición del usuario en el ranking
 * - Retornar a la página de inicio
 * 
 * @component
 */
@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss']
})
export class RankingPage {

  /**
   * Arreglo de elementos del ranking diario.
   * Cada elemento contiene: name (nombre del jugador) y score (puntuación).
   * Los elementos están ordenados descendentemente por puntuación (mayor a menor).
   * @type {any[]}
   */
  ranking: RankingItem[] = [];
  loading = true;
  error = '';

  constructor(
    private rankingService: RankingService,
    private router: Router
  ) {}

  /**
   * Inicializa la página cargando el ranking diario global.
   * 
   * Se ejecuta automáticamente al cargar la página y recupera los puntajes
   * registrados en el día actual.
   * @async
   * @returns {Promise<void>}
   */
  async ionViewWillEnter() {
    await this.loadRanking();
  }

  async loadRanking() {
    this.loading = true;
    this.error = '';
    try {
      this.ranking = await this.rankingService.getDailyRanking();
    } catch {
      this.error = 'No pudimos cargar el ranking diario.';
    } finally {
      this.loading = false;
    }
  }

  formatBestScoreTime(updatedAt: any): string {
    if (!updatedAt) {
      return 'Hora no disponible';
    }

    const date = typeof updatedAt.toDate === 'function'
      ? updatedAt.toDate()
      : new Date(updatedAt);

    if (Number.isNaN(date.getTime())) {
      return 'Hora no disponible';
    }

    return new Intl.DateTimeFormat('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  /**
   * Navega de vuelta a la página de inicio.
   * @returns {void}
   */
  goBack() {
    this.router.navigateByUrl('/home');
  }
}
