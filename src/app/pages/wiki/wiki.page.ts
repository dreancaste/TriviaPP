import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { WikiContentService } from "src/app/services/wiki-content.service";

/**
 * Página principal de la wiki que actúa como hub para explorar contenido de Star Wars.
 * 
 * Muestra las tres secciones principales de la wiki:
 * - Personajes: Actores principales del universo Star Wars
 * - Películas: Todas las películas de la saga
 * - Planetas: Mundos del universo galáctico
 * 
 * Permite navegación a subcategorías donde el usuario puede explorar
 * listados completos y acceder a detalles específicos de cada entidad.
 * 
 * **Servicios consumidos:**
 * - WikiContentService: Para obtener las secciones disponibles en la wiki.
 * - Router: Para navegación entre secciones.
 * 
 * **Acciones disponibles para el usuario:**
 * - Ver las tres categorías principales (personajes, películas, planetas)
 * - Navegar a cada sección para explorar listados completos
 * - Acceder a detalles específicos desde cada sección
 * 
 * @component
 */
@Component({
  selector: "app-wiki",
  templateUrl: "./wiki.page.html",
  styleUrls: ["./wiki.page.scss"],
})
export class WikiPage {
  /**
   * Título de la página wiki.
   * @readonly
   * @type {string}
   */
  readonly title = "Wiki Star Wars";

  /**
   * Descripción breve de la wiki.
   * @readonly
   * @type {string}
   */
  readonly description = "Explora personajes, peliculas y planetas del universo galactico";

  constructor(
    private router: Router,
    private wikiContent: WikiContentService
  ) {}

  /**
   * Obtiene las secciones disponibles en la wiki.
   * 
   * Retorna un getter que accede al servicio WikiContentService
   * para obtener la lista de categorías principales.
   * @returns {any} Arreglo de secciones con su configuración.
   */
  get sections() {
    return this.wikiContent.sections;
  }

  /**
   * Navega a una sección específica de la wiki.
   * @param {string} route - Ruta de la sección a navegar (ej: '/wiki/planets').
   * @returns {void}
   */
  goToSection(route: string) {
    this.router.navigateByUrl(route);
  }
}
