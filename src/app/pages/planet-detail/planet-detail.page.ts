import { Component, HostListener, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { SwapiService } from "src/app/services/swapi.service";
import { WikiContentService } from "src/app/services/wiki-content.service";
import { WikiEntityType } from "src/app/data/wiki-content";

/**
 * Interfaz que define una estadística mostrada en la ficha de detalle.
 * @interface WikiStat
 */
interface WikiStat {
  /**
   * URL del ícono de la estadística.
   * @type {string}
   */
  icon: string;

  /**
   * Etiqueta de la estadística (ej: "Clima", "Altura").
   * @type {string}
   */
  label: string;

  /**
   * Valor de la estadística (traducido si es necesario).
   * @type {string}
   */
  value: string;
}

/**
 * Interfaz para entidades relacionadas (asociados).
 * @interface WikiAssociated
 */
interface WikiAssociated {
  /**
   * Tipo de entidad asociada (PERSONAJE, PLANETA, PELICULA).
   * @type {string}
   */
  tipo: string;

  /**
   * Nombre de la entidad asociada.
   * @type {string}
   */
  nombre: string;

  /**
   * Imagen de la entidad asociada.
   * @type {string}
   */
  imagen: string;
}

/**
 * Interfaz que define la estructura completa de una ficha de detalle en la wiki.
 * @interface WikiDetail
 */
interface WikiDetail {
  /**
   * Nombre de la entidad (personaje, película o planeta).
   * @type {string}
   */
  nombre: string;

  /**
   * Categoría de la entidad (Personaje, Película, Planeta).
   * @type {string}
   */
  categoria: string;

  /**
   * Descripción o narrativa de la entidad.
   * @type {string}
   */
  descripcion: string;

  /**
   * Imagen principal (hero image) de la entidad.
   * @type {string}
   */
  imagen: string;

  /**
   * Arreglo de imágenes adicionales de la entidad.
   * @type {string[]}
   */
  imagenes: string[];

  /**
   * Arreglo de estadísticas a mostrar (clima, altura, etc).
   * @type {WikiStat[]}
   */
  stats: WikiStat[];

  /**
   * Arreglo de curiosidades o datos interesantes.
   * @type {string[]}
   */
  datosCuriosos: string[];

  /**
   * Arreglo de entidades asociadas (residentes de un planeta, actores en una película).
   * @type {WikiAssociated[]}
   */
  asociados: WikiAssociated[];

  /**
   * URL del mapa de escritorio (opcional, para planetas).
   * @type {string}
   * @optional
   */
  mapa?: string;

  /**
   * URL del mapa móvil (opcional, para planetas).
   * @type {string}
   * @optional
   */
  mapaMovil?: string;
}


/**
 * Página de detalle que muestra información completa de una entidad wiki.
 * 
 * Soporta tres tipos de entidades: personajes, películas y planetas.
 * Muestra estadísticas, curiosidades, imágenes y entidades asociadas.
 * Responde adaptándose a cambios de tamaño de ventana (responsive).
 * 
 * **Servicios consumidos:**
 * - SwapiService: Para obtener datos detallados de personajes, películas y planetas.
 * - WikiContentService: Para traducciones, imágenes y curiosidades.
 * - ActivatedRoute: Para obtener parámetros de ruta (tipo e ID).
 * - Location: Para navegación hacia atrás.
 * 
 * **Acciones disponibles para el usuario:**
 * - Ver detalles completos de un personaje, película o planeta
 * - Navegar entre imágenes múltiples
 * - Ver estadísticas principales
 * - Leer curiosidades interesantes
 * - Ver entidades relacionadas (residentes, películas, personajes)
 * - Cambiar de ubicación seleccionada en asociados
 * - Retornar a la página anterior
 * 
 * @component
 * @implements {OnInit}
 */
@Component({
  selector: "app-planet-detail",
  templateUrl: "./planet-detail.page.html",
  styleUrls: ["./planet-detail.page.scss"],
})
export class PlanetDetailPage implements OnInit {
  /**
   * Objeto de detalle de la entidad actual (null mientras se carga).
   * @type {WikiDetail|null}
   */
  detalle: WikiDetail | null = null;

  /**
   * Indica si se está cargando el detalle desde la API.
   * @type {boolean}
   */
  loading = true;

  /**
   * Mensaje de error si falla la carga del detalle.
   * @type {string}
   */
  error = "";

  /**
   * Índice del asociado seleccionado actualmente (-1 si ninguno).
   * Usado para destacar un asociado en la interfaz.
   * @type {number}
   */
  selectedAsociado = -1;

  /**
   * URL de la imagen principal (hero image) responsive.
   * Se actualiza según el tamaño de pantalla.
   * @type {string}
   */
  heroImage = "";

  /**
   * URL del mapa responsive (escritorio o móvil según ventana).
   * @type {string}
   */
  mapaImage = "";

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private swapiService: SwapiService,
    private wikiContent: WikiContentService,
  ) {}

  /**
   * Inicializa la página cargando el detalle de la entidad.
   * @async
   * @returns {Promise<void>}
   */
  async ngOnInit() {
    await this.loadDetail();
  }

  /**
   * Escucha cambios en el tamaño de la ventana del navegador.
   * Actualiza los assets responsive cuando cambia el tamaño.
   * @returns {void}
   */
  @HostListener("window:resize")
  onResize() {
    this.updateResponsiveAssets();
  }

  /**
   * Carga el detalle de la entidad según su tipo e ID desde la ruta.
   * 
   * Obtiene los parámetros de ruta, consulta la API SWAPI y construye
   * el objeto de detalle según el tipo (character, film, planet).
   * @private
   * @async
   * @returns {Promise<void>}
   */
  private async loadDetail() {
    const type = (this.route.snapshot.paramMap.get("type") ||
      "planets") as WikiEntityType;
    const id = this.route.snapshot.paramMap.get("id") || "1";

    try {
      this.loading = true;
      this.error = "";

      if (type === "characters") {
        const character = await this.swapiService.getPerson(id);
        this.detalle = await this.buildCharacterDetail(character, id);
      } else if (type === "films") {
        const film = await this.swapiService.getFilm(id);
        this.detalle = await this.buildFilmDetail(film);
      } else {
        const planet = await this.swapiService.getPlanet(id);
        this.detalle = await this.buildPlanetDetail(planet, id);
      }

      this.selectedAsociado = -1;
      this.updateResponsiveAssets();
    } catch {
      this.error = "No pudimos cargar esta ficha de la wiki.";
    } finally {
      this.loading = false;
    }
  }

  /**
   * Construye el objeto de detalle para un planeta.
   * 
   * Traduce campos como clima, terreno, población, gravedad y órbita.
   * Obtiene estadísticas, curiosidades, imágenes y residentes asociados.
   * @private
   * @async
   * @param {any} planet - Datos del planeta desde SWAPI.
   * @param {string} id - Identificador del planeta.
   * @returns {Promise<WikiDetail>} Objeto de detalle del planeta formateado.
   */
  private async buildPlanetDetail(
    planet: any,
    id: string,
  ): Promise<WikiDetail> {
    const image = this.wikiContent.getVisualGuideImage("planets", id);
    const map = this.wikiContent.getMap("planets", id);
    const [climate, terrain, population, gravity, orbit] =
      await this.wikiContent.translateValues([
        planet.climate,
        planet.terrain,
        planet.population,
        planet.gravity,
        planet.orbital_period,
      ]);

    return {
      nombre: planet.name,
      categoria: "Planeta",
      descripcion: `${planet.name} es un planeta de clima ${climate} y terreno ${terrain}. Su poblacion registrada es ${population}.`,
      imagen: image,
      imagenes: this.wikiContent.getImages("planets", id, image),
      stats: [
        {
          icon: this.wikiContent.getStatIcon("terrain"),
          label: "Terreno",
          value: terrain,
        },
        {
          icon: this.wikiContent.getStatIcon("climate"),
          label: "Clima",
          value: climate,
        },
        {
          icon: this.wikiContent.getStatIcon("population"),
          label: "Poblacion",
          value: population,
        },
        {
          icon: this.wikiContent.getStatIcon("gravity"),
          label: "Gravedad",
          value: gravity,
        },
        {
          icon: this.wikiContent.getStatIcon("orbit"),
          label: "Orbita",
          value: `${orbit} dias`,
        },
      ],
      datosCuriosos: await this.wikiContent.getCuriosities(
        "planets",
        id,
        planet,
      ),
      asociados: await this.getAssociated(planet.residents, "PERSONAJE"),
      mapa: map.map,
      mapaMovil: map.mobileMap,
    };
  }

  /**
   * Construye el objeto de detalle para un personaje.
   * 
   * Traduce campos como altura, peso, año de nacimiento, género y color de ojos.
   * Obtiene estadísticas, curiosidades e imágenes del personaje.
   * @private
   * @async
   * @param {any} character - Datos del personaje desde SWAPI.
   * @param {string} id - Identificador del personaje.
   * @returns {Promise<WikiDetail>} Objeto de detalle del personaje formateado.
   */
  private async buildCharacterDetail(
    character: any,
    id: string,
  ): Promise<WikiDetail> {
    const image = this.wikiContent.getVisualGuideImage("characters", id);
    const [height, mass, birthYear, gender, eyeColor] =
      await this.wikiContent.translateValues([
        character.height,
        character.mass,
        character.birth_year,
        character.gender,
        character.eye_color,
      ]);

    return {
      nombre: character.name,
      categoria: "Personaje",
      descripcion: `${character.name} forma parte del universo Star Wars. Su ficha registra datos fisicos, origen y apariciones conectadas con otros elementos de la saga.`,
      imagen: image,
      imagenes: this.wikiContent.getImages("characters", id, image),
      stats: [
        {
          icon: this.wikiContent.getStatIcon("height"),
          label: "Altura",
          value: `${height} cm`,
        },
        {
          icon: this.wikiContent.getStatIcon("mass"),
          label: "Peso",
          value: `${mass} kg`,
        },
        {
          icon: this.wikiContent.getStatIcon("birth"),
          label: "Nacimiento",
          value: birthYear,
        },
        {
          icon: this.getGenderIcon(gender), 
          label: "Genero",  
          value: gender === "N/a" ? "Robot" : gender },
        {
          icon: this.wikiContent.getStatIcon("eyes"),
          label: "Ojos",
          value: eyeColor,
        },
      ],
      datosCuriosos: await this.wikiContent.getCuriosities(
        "characters",
        id,
        character,
      ),
      asociados: [],
    };
  }

  /**
   * Determina el ícono correcto para el género, con casos especiales para robots.
   * @private
   * @param {string} gender - Género del personaje (male, female, n/a, droid).
   * @returns {string} URL del ícono correspondiente.
   */
  private getGenderIcon(gender: string): string {
    if (!gender) {
      return this.wikiContent.getStatIcon("gender");
    }

    const normalized = gender.toLowerCase();
    switch (normalized) {
      case "male":
      case "hombre":
        return "assets/icons/male.png";
      case "female":
      case "femenino":
        return "assets/icons/female.png";
      case "n/a":
      case "droid":
        return "assets/icons/robot.png";
      default:
        return this.wikiContent.getStatIcon("gender");
    }
  }

  /**
   * Construye el objeto de detalle para una película.
   * 
   * Traduce la descripción de apertura (opening crawl).
   * Obtiene estadísticas (episodio, director, productor, fecha de estreno) e imágenes.
   * @private
   * @async
   * @param {any} film - Datos de la película desde SWAPI.
   * @returns {Promise<WikiDetail>} Objeto de detalle de la película formateado.
   */
  private async buildFilmDetail(film: any): Promise<WikiDetail> {
    const id = this.getIdFromUrl(film.url);
    const episodeId = String(film.episode_id);
    const image = this.wikiContent.getVisualGuideImage("films", episodeId);
    const description = await this.wikiContent.translateParagraph(
      film.opening_crawl,
    );

    return {
      nombre: film.title,
      categoria: "Pelicula",
      descripcion: description,
      imagen: image,
      imagenes: this.wikiContent.getImages("films", episodeId, image),
      stats: [
        {
          icon: this.wikiContent.getStatIcon("episode"),
          label: "Episodio",
          value: String(film.episode_id),
        },
        {
          icon: this.wikiContent.getStatIcon("director"),
          label: "Director",
          value: this.wikiContent.valueOrUnknown(film.director),
        },
        {
          icon: this.wikiContent.getStatIcon("producer"),
          label: "Productor",
          value: this.wikiContent.valueOrUnknown(film.producer),
        },
        {
          icon: this.wikiContent.getStatIcon("date"),
          label: "Estreno",
          value: this.wikiContent.valueOrUnknown(film.release_date),
        },
      ],
      datosCuriosos: await this.wikiContent.getCuriosities("films", id, film),
      asociados: [],
    };
  }

  /**
   * Determina si debe mostrar la descripción en la interfaz.
   * La descripción se muestra para películas y personajes, pero no para planetas.
   * @returns {boolean} true si se debe mostrar la descripción.
   */
  mostrarDescripcion(): boolean {
    return (
      this.detalle?.categoria !== "Planeta" &&
      Boolean(this.detalle?.descripcion)
    );
  }

  /**
   * Determina si debe mostrar la sección de asociados.
   * Solo se muestra para planetas que tienen residentes (asociados).
   * @returns {boolean} true si se debe mostrar la sección de asociados.
   */
  mostrarAsociados(): boolean {
    return (
      this.detalle?.categoria === "Planeta" &&
      Boolean(this.detalle?.asociados.length)
    );
  }

  /**
   * Obtiene entidades asociadas a partir de sus URLs.
   * 
   * Consulta cada URL para obtener datos de la entidad asociada.
   * Limita el resultado a 4 elementos máximo.
   * Determina automáticamente el tipo de entidad (personaje, planeta, película).
   * @private
   * @async
   * @param {string[]} urls - Arreglo de URLs de entidades asociadas.
   * @param {string} fallbackType - Tipo por defecto si no se puede determinar.
   * @returns {Promise<WikiAssociated[]>} Arreglo de entidades asociadas formateadas.
   */
  private async getAssociated(
    urls: string[] = [],
    fallbackType: string,
  ): Promise<WikiAssociated[]> {
    const selectedUrls = urls.filter(Boolean).slice(0, 4);
    const items = await Promise.all(
      selectedUrls.map(async (url) => {
        const data = await this.swapiService.getByUrl(url);
        const id = this.getIdFromUrl(url);

        return {
          tipo: this.getAssociatedType(url, fallbackType),
          nombre: data.name || data.title || "Referencia",
          imagen: this.wikiContent.getVisualGuideImage(
            this.getVisualGuideType(url),
            id,
          ),
        };
      }),
    );

    return items;
  }

  /**
   * Determina el tipo de entidad asociada a partir de su URL.
   * @private
   * @param {string} url - URL de la entidad en SWAPI.
   * @param {string} fallbackType - Tipo por defecto si no se puede determinar.
   * @returns {string} Tipo de entidad (PERSONAJE, PLANETA, PELICULA).
   */
  private getAssociatedType(url: string, fallbackType: string): string {
    if (url.includes("/planets/")) {
      return "PLANETA";
    }

    if (url.includes("/films/")) {
      return "PELICULA";
    }

    if (url.includes("/people/")) {
      return "PERSONAJE";
    }

    return fallbackType;
  }

  /**
   * Determina el tipo de entidad de wiki a partir de su URL de SWAPI.
   * @private
   * @param {string} url - URL de la entidad en SWAPI.
   * @returns {WikiEntityType} Tipo de entidad para WikiContentService.
   */
  private getVisualGuideType(url: string): WikiEntityType {
    if (url.includes("/people/")) {
      return "characters";
    }

    if (url.includes("/films/")) {
      return "films";
    }

    return "planets";
  }

  /**
   * Extrae el ID numérico desde una URL de SWAPI.
   * @private
   * @param {string} url - URL completa de la entidad.
   * @returns {string} Identificador numérico o "1" por defecto.
   */
  private getIdFromUrl(url: string): string {
    return url.split("/").filter(Boolean).pop() || "1";
  }

  /**
   * Determina si la pantalla es móvil (ancho menor a 768px).
   * @private
   * @returns {boolean} true si es móvil, false si es escritorio.
   */
  private isMobile(): boolean {
    return window.innerWidth < 768;
  }

  /**
   * Actualiza los assets responsive (imágenes y mapas) según el tamaño de pantalla actual.
   * @private
   * @returns {void}
   */
  private updateResponsiveAssets() {
    if (!this.detalle) {
      return;
    }

    this.heroImage = this.getResponsiveHeroImage(this.detalle.imagen);
    this.mapaImage = this.getResponsiveMapaImage();
  }

  /**
   * Obtiene la versión responsive de la imagen hero según tamaño de pantalla.
   * Para pantallas móviles, intenta cargar versión optimizada (Movil.jpg).
   * @param {string} imagePath - Ruta original de la imagen.
   * @returns {string} Ruta de la imagen responsive.
   */
  getResponsiveHeroImage(imagePath: string): string {
    if (
      !this.isMobile() ||
      !imagePath.startsWith("assets/") ||
      !imagePath.endsWith(".jpg")
    ) {
      return imagePath;
    }

    return imagePath.replace(".jpg", "Movil.jpg");
  }

  /**
   * Obtiene la versión responsive del mapa según tamaño de pantalla.
   * Retorna el mapa móvil si está disponible y la pantalla es móvil.
   * @returns {string} URL del mapa responsive o cadena vacía si no existe.
   */
  getResponsiveMapaImage(): string {
    if (!this.detalle?.mapa) {
      return "";
    }

    return this.isMobile() && this.detalle.mapaMovil
      ? this.detalle.mapaMovil
      : this.detalle.mapa;
  }

  /**
   * Navega hacia atrás en el historial del navegador.
   * @returns {void}
   */
  volverAtras() {
    this.location.back();
  }

  /**
   * Selecciona un asociado para destacarlo en la interfaz.
   * @param {number} index - Índice del asociado a seleccionar.
   * @returns {void}
   */
  seleccionarAsociado(index: number) {
    this.selectedAsociado = index;
  }
}
