import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwapiService } from 'src/app/services/swapi.service';
import { WikiContentService } from 'src/app/services/wiki-content.service';

/**
 * Página de listado de películas que obtiene datos de la API SWAPI.
 * 
 * Carga y muestra una lista de todas las películas del universo Star Wars.
 * Cada película muestra su imagen de póster basada en su número de episodio.
 * Permite acceder a la página de detalle de cada película.
 * 
 * **Servicios consumidos:**
 * - SwapiService: Para obtener lista de películas de la API SWAPI.
 * - WikiContentService: Para obtener imágenes de películas.
 * - Router: Para navegación a detalles de película.
 * 
 * **Acciones disponibles para el usuario:**
 * - Ver lista de películas disponibles
 * - Ver póster de cada película
 * - Acceder al detalle de una película
 * - Retornar a la página anterior
 * 
 * @component
 * @implements {OnInit}
 */
@Component({
  selector: 'app-films',
  templateUrl: './films.page.html',
  styleUrls: ['./films.page.scss'],
})
export class FilmsPage implements OnInit {
  /**
   * Arreglo de películas cargadas desde SWAPI.
   * Cada elemento contiene datos como title, episode_id, release_date, etc.
   * @type {any[]}
   */
  films: any[] = [];

  /**
   * Indica si se están cargando los datos de películas desde la API.
   * @type {boolean}
   */
  loading = true;
  error = '';

  constructor(
    private router: Router,
    private swapiService: SwapiService,
    private wikiContent: WikiContentService
  ) {}

  /**
   * Obtiene la sección de configuración de películas de la wiki.
   * @returns {any} Objeto de configuración de la sección de películas.
   */
  get section() {
    return this.wikiContent.getSection("films");
  }

  /**
   * Carga la lista completa de películas desde SWAPI.
   * 
   * Obtiene todas las películas disponibles en la API SWAPI (no paginado).
   * @async
   * @returns {Promise<void>}
   */
  async ngOnInit() {
    await this.loadFilms();
  }

  async loadFilms() {
    this.loading = true;
    this.error = '';
    try {
      const response = await this.swapiService.getFilms();
      this.films = response.results;
    } catch {
      this.error = 'No pudimos cargar las películas.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Obtiene la imagen de póster de una película basada en su número de episodio.
   * @param {any} film - Objeto de la película.
   * @returns {string} URL de la imagen de póster de la película.
   */
  getImage(film: any): string {
    return this.wikiContent.getVisualGuideImage("films", film.episode_id);
  }

  /**
   * Extrae el ID de una película desde su URL de SWAPI.
   * @param {string} url - URL completa de la película en SWAPI.
   * @returns {string} Identificador numérico de la película.
   */
  getId(url: string): string {
    return url.split('/').filter(Boolean).pop() || '';
  }

  /**
   * Navega a la página de detalle de una película.
   * @param {any} film - Objeto de la película seleccionada.
   * @returns {void}
   */
  openFilm(film: any) {
    this.router.navigate(['/wiki/detail/films', this.getId(film.url)]);
  }
}
