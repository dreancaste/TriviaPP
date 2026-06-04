import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwapiService } from 'src/app/services/swapi.service';
import { WikiContentService } from 'src/app/services/wiki-content.service';

/**
 * Página de listado de planetas que obtiene datos de la API SWAPI.
 * 
 * Carga y muestra una lista de planetas con sus características traducidas al español.
 * Cada planeta muestra su clima y tipo de terreno traducidos.
 * Permite acceder a la página de detalle de cada planeta.
 * 
 * **Servicios consumidos:**
 * - SwapiService: Para obtener lista de planetas de la API SWAPI.
 * - WikiContentService: Para traducir datos y obtener imágenes.
 * - Router: Para navegación a detalles de planeta.
 * 
 * **Acciones disponibles para el usuario:**
 * - Ver lista de planetas disponibles
 * - Ver imagen de cada planeta
 * - Ver clima y terreno (traducido al español)
 * - Acceder al detalle de un planeta
 * - Retornar a la página anterior
 * 
 * @component
 * @implements {OnInit}
 */
@Component({
  selector: 'app-planets',
  templateUrl: './planets.page.html',
  styleUrls: ['./planets.page.scss']
})
export class PlanetsPage implements OnInit {
  /**
   * Arreglo de planetas cargados desde SWAPI.
   * Cada elemento incluye propiedades originales más propiedades traducidas (climateEs, terrainEs).
   * @type {any[]}
   */
  planets: any[] = [];

  /**
   * Indica si se están cargando los datos de planetas desde la API.
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
   * Obtiene la sección de configuración de planetas de la wiki.
   * @returns {any} Objeto de configuración de la sección de planetas.
   */
  get section() {
    return this.wikiContent.getSection("planets");
  }

  /**
   * Carga la lista de planetas desde SWAPI y traduce sus datos.
   * 
   * Obtiene la primera página de planetas y traduce los campos de clima y terreno
   * al español. Los datos traducidos se almacenan en propiedades separadas.
   * @async
   * @returns {Promise<void>}
   */
  async ngOnInit() {
    await this.loadPlanets();
  }

  async loadPlanets() {
    this.loading = true;
    this.error = '';
    try {
      const response = await this.swapiService.getPlanets(1);
      this.planets = await Promise.all(
        response.results.map(async (planet: any) => {
          const [climate, terrain] = await this.wikiContent.translateValues([
            planet.climate,
            planet.terrain,
          ]);

          return {
            ...planet,
            climateEs: climate,
            terrainEs: terrain,
          };
        })
      );
    } catch {
      this.error = 'No pudimos cargar los planetas.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Obtiene la imagen de un planeta para mostrar en la lista.
   * @param {string} uid - Identificador del planeta en la wiki.
   * @returns {string} URL de la imagen del planeta.
   */
  getImage(uid: string): string {
    return this.wikiContent.getVisualGuideImage("planets", uid);
  }

  /**
   * Extrae el ID de un planeta desde su URL de SWAPI.
   * @param {string} url - URL completa del planeta en SWAPI.
   * @returns {string} Identificador numérico del planeta.
   */
  getId(url: string): string {
    return url.split('/').filter(Boolean).pop() || '';
  }

  /**
   * Navega a la página de detalle de un planeta.
   * @param {any} planet - Objeto del planeta seleccionado.
   * @returns {void}
   */
  openPlanet(planet: any) {
    this.router.navigate(['/wiki/detail/planets', this.getId(planet.url)]);
  }
}
