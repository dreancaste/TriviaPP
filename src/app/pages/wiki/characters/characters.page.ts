import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwapiService } from 'src/app/services/swapi.service';
import { WikiContentService } from 'src/app/services/wiki-content.service';

/**
 * Página de listado de personajes que obtiene datos de la API SWAPI.
 * 
 * Carga y muestra una lista de personajes del universo Star Wars.
 * Cada personaje muestra su imagen asociada (si está disponible).
 * Permite acceder a la página de detalle de cada personaje.
 * 
 * **Servicios consumidos:**
 * - SwapiService: Para obtener lista de personajes de la API SWAPI.
 * - WikiContentService: Para obtener imágenes de personajes.
 * - Router: Para navegación a detalles de personaje.
 * 
 * **Acciones disponibles para el usuario:**
 * - Ver lista de personajes disponibles
 * - Ver imagen de cada personaje
 * - Acceder al detalle de un personaje
 * - Retornar a la página anterior
 * 
 * @component
 * @implements {OnInit}
 */
@Component({
  selector: 'app-characters',
  templateUrl: './characters.page.html',
  styleUrls: ['./characters.page.scss']
})
export class CharactersPage implements OnInit {
  /**
   * Arreglo de personajes cargados desde SWAPI.
   * Cada elemento contiene datos del personaje como name, height, mass, etc.
   * @type {any[]}
   */
  characters: any[] = [];

  /**
   * Indica si se están cargando los datos de personajes desde la API.
   * @type {boolean}
   */
  loading = true;

  constructor(
    private router: Router,
    private swapiService: SwapiService,
    private wikiContent: WikiContentService
  ) {}

  /**
   * Obtiene la sección de configuración de personajes de la wiki.
   * @returns {any} Objeto de configuración de la sección de personajes.
   */
  get section() {
    return this.wikiContent.getSection("characters");
  }

  /**
   * Carga la lista de personajes desde SWAPI.
   * 
   * Obtiene la primera página de personajes de la API SWAPI.
   * @async
   * @returns {Promise<void>}
   */
  async ngOnInit() {
    const response = await this.swapiService.getPeople(1);
    this.characters = response.results;
    this.loading = false;
  }

  /**
   * Obtiene la imagen de un personaje para mostrar en la lista.
   * @param {string} uid - Identificador del personaje en la wiki.
   * @returns {string} URL de la imagen del personaje.
   */
  getImage(uid: string): string {
    return this.wikiContent.getVisualGuideImage("characters", uid);
  }

  /**
   * Extrae el ID de un personaje desde su URL de SWAPI.
   * @param {string} url - URL completa del personaje en SWAPI.
   * @returns {string} Identificador numérico del personaje.
   */
  getId(url: string): string {
    return url.split('/').filter(Boolean).pop() || '';
  }

  /**
   * Navega a la página de detalle de un personaje.
   * @param {any} character - Objeto del personaje seleccionado.
   * @returns {void}
   */
  openCharacter(character: any) {
    this.router.navigate(['/wiki/detail/characters', this.getId(character.url)]);
  }
}
