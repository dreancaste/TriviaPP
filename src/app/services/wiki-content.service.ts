import { Injectable } from "@angular/core";
import {
  WIKI_ASSETS,
  WIKI_CURIOSITIES,
  WIKI_SECTIONS,
  WIKI_STAT_ICONS,
  WikiEntityType,
} from "../data/wiki-content";
import { TranslationService } from "./translation.service";

/**
 * Servicio que proporciona contenido, imágenes y datos estadísticos para la sección wiki de la aplicación.
 * 
 * Gestiona la obtención de información sobre personajes, películas y planetas de Star Wars.
 * Implementa caché de traducciones para optimizar el rendimiento y evitar solicitudes repetidas.
 * Genera automáticamente curiosidades basadas en datos de entidades cuando no hay contenido predefinido.
 * 
 * @injectable
 */
@Injectable({
  providedIn: "root",
})
export class WikiContentService {
  /**
   * Colección de secciones disponibles en la wiki.
   * Define los tipos de entidades que se pueden consultar (personajes, películas, planetas).
   * @readonly
   * @type {any}
   */
  readonly sections = WIKI_SECTIONS;

  /**
   * Imagen de placeholder utilizada cuando no se encuentran imágenes asociadas a una entidad.
   * @private
   * @type {string}
   */
  private readonly placeholderImage = "assets/icons/image.png";

  /**
   * Caché de traducciones anteriores para evitar hacer solicitudes repetidas a la API de traducción.
   * Las claves son combinaciones de "raw:" o "value:" seguidas del texto.
   * @private
   * @type {Map<string, Promise<string>>}
   */
  private translationCache = new Map<string, Promise<string>>();

  constructor(private translationService: TranslationService) {}

  /**
   * Obtiene la definición de una sección wiki por su tipo de entidad.
   * @param {WikiEntityType} type - Tipo de entidad (characters, films, planets).
   * @returns {any} Objeto de configuración de la sección o undefined si no existe.
   */
  getSection(type: WikiEntityType) {
    return this.sections.find((section) => section.type === type);
  }

  /**
   * Obtiene la imagen principal de una entidad para mostrar en la guía visual.
   * 
   * Busca primero una imagen manual asociada, luego una imagen múltiple disponible.
   * Si no encuentra ninguna, retorna la imagen de placeholder.
   * @param {WikiEntityType} type - Tipo de entidad.
   * @param {string|number} id - Identificador de la entidad.
   * @returns {string} URL de la imagen principal o ruta del placeholder.
   */
  getVisualGuideImage(type: WikiEntityType, id: string | number): string {
    const assets = WIKI_ASSETS[type]?.[String(id)];
    const manualImage = assets?.image || assets?.images?.find(Boolean);

    return manualImage || this.placeholderImage;
  }

  /**
   * Obtiene un arreglo de imágenes asociadas a una entidad.
   * 
   * Intenta obtener múltiples imágenes, luego una sola, y finalmente la imagen de fallback.
   * Siempre retorna al menos una imagen (fallback si es necesario).
   * @param {WikiEntityType} type - Tipo de entidad.
   * @param {string} id - Identificador de la entidad.
   * @param {string} fallbackImage - Imagen alternativa si no se encuentran imágenes asociadas.
   * @returns {string[]} Arreglo de URLs de imágenes.
   */
  getImages(type: WikiEntityType, id: string, fallbackImage: string): string[] {
    const assets = WIKI_ASSETS[type]?.[id];
    const manualImages = assets?.images?.filter(Boolean);

    if (manualImages?.length) {
      return manualImages;
    }

    if (assets?.image) {
      return [assets.image];
    }

    return [fallbackImage || this.placeholderImage];
  }

  /**
   * Obtiene los mapas (versiones normal y móvil) asociados a una entidad.
   * 
   * Típicamente utilizado para mostrar mapas de planetas.
   * @param {WikiEntityType} type - Tipo de entidad.
   * @param {string} id - Identificador de la entidad.
   * @returns {object} Objeto con propiedades map y mobileMap, ambas pueden ser undefined.
   */
  getMap(type: WikiEntityType, id: string) {
    const assets = WIKI_ASSETS[type]?.[id];

    return {
      map: assets?.map,
      mobileMap: assets?.mobileMap,
    };
  }

  /**
   * Obtiene curiosidades sobre una entidad (datos interesantes adicionales).
   * 
   * Intenta obtener curiosidades predefinidas primero. Si no existen, genera automáticamente
   * curiosidades basadas en los datos reales de la entidad desde SWAPI.
   * Genera curiosidades específicas para personajes (color de cabello, piel, apariciones),
   * películas (episodio, director, año, personajes conectados) o planetas (rotación, diámetro, agua).
   * @async
   * @param {WikiEntityType} type - Tipo de entidad.
   * @param {string} id - Identificador de la entidad.
   * @param {any} entity - Objeto de la entidad con datos de SWAPI.
   * @returns {Promise<string[]>} Arreglo de curiosidades formateadas como texto descriptivo.
   */
  async getCuriosities(type: WikiEntityType, id: string, entity: any): Promise<string[]> {
    const appCuriosities = WIKI_CURIOSITIES[type]?.[id];

    if (appCuriosities?.length) {
      return appCuriosities;
    }

    if (type === "characters") {
      const [hairColor, skinColor] = await this.translateValues([
        entity.hair_color,
        entity.skin_color,
      ]);

      return [
        `Color de cabello: ${hairColor}.`,
        `Color de piel: ${skinColor}.`,
        `Aparece en ${entity.films?.length || 0} pelicula(s).`,
        `Registra ${entity.vehicles?.length || 0} vehiculo(s) y ${entity.starships?.length || 0} nave(s) en SWAPI.`,
      ];
    }

    if (type === "films") {
      const releaseYear = String(entity.release_date || "").slice(0, 4) || "desconocido";

      return [
        `${entity.title} corresponde al Episodio ${entity.episode_id} de la saga.`,
        `Fue dirigida por ${this.valueOrUnknown(entity.director)} y estrenada en ${releaseYear}.`,
        `Su historia conecta a ${entity.characters?.length || 0} personaje(s) principales dentro de SWAPI.`,
        `La pelicula registra ${entity.planets?.length || 0} planeta(s), ${entity.starships?.length || 0} nave(s) y ${entity.vehicles?.length || 0} vehiculo(s).`,
        `Su conflicto ayuda a entender el equilibrio entre Jedi, Sith, Republica, Imperio o Rebelion segun la epoca narrada.`,
      ];
    }

    return [
      `Periodo de rotacion: ${this.valueOrUnknown(entity.rotation_period)} horas.`,
      `Diametro: ${this.valueOrUnknown(entity.diameter)} kilometros.`,
      `Superficie de agua: ${this.valueOrUnknown(entity.surface_water)}%.`,
    ];
  }

  /**
   * Obtiene la URL del icono de estadística para un tipo específico.
   * @param {keyof typeof WIKI_STAT_ICONS} icon - Identificador del icono.
   * @returns {string} URL del icono SVG o imagen.
   */
  getStatIcon(icon: keyof typeof WIKI_STAT_ICONS): string {
    return WIKI_STAT_ICONS[icon];
  }

  /**
   * Traduce múltiples valores simultáneamente.
   * 
   * Realiza traducciones en paralelo usando Promise.all para mayor eficiencia.
   * @async
   * @param {any[]} values - Arreglo de valores a traducir.
   * @returns {Promise<string[]>} Arreglo de valores traducidos en el mismo orden.
   */
  async translateValues(values: any[]): Promise<string[]> {
    return Promise.all(values.map((value) => this.translateValue(value)));
  }

  /**
   * Traduce un valor individual (generalmente una palabra o atributo corto).
   * 
   * Si el valor es desconocido o no es traducible (números, fechas), retorna el valor sin traducir.
   * Utiliza caché de traducciones previas.
   * @async
   * @param {any} value - Valor a traducir.
   * @returns {Promise<string>} Valor traducido o "desconocido" si no es válido.
   */
  async translateValue(value: any): Promise<string> {
    const normalized = this.valueOrUnknown(value);

    if (normalized === "desconocido" || this.isLikelyNonTranslatable(normalized)) {
      return normalized;
    }

    return this.translateCached(normalized, false);
  }

  /**
   * Traduce un párrafo de texto (texto más largo).
   * 
   * Si el texto es vacío o no es traducible, lo retorna sin cambios.
   * Utiliza caché de traducciones previas.
   * @async
   * @param {string} text - Párrafo o texto a traducir.
   * @returns {Promise<string>} Texto traducido o el original si no es traducible.
   */
  async translateParagraph(text: string): Promise<string> {
    if (!text || this.isLikelyNonTranslatable(text)) {
      return text || "";
    }

    return this.translateCached(text, true);
  }

  /**
   * Retorna un valor de string o "desconocido" si el valor es null, undefined o la cadena "unknown".
   * @param {any} value - Valor a verificar.
   * @returns {string} El valor convertido a string o "desconocido".
   */
  valueOrUnknown(value: any): string {
    return value && value !== "unknown" ? String(value) : "desconocido";
  }

  /**
   * Obtiene la traducción cacheada de un texto o la solicita si no está en caché.
   * 
   * Implementa un sistema de caché que diferencia entre traducciones raw (sin capitalización)
   * y traducciones normales (con capitalización) para evitar confusiones.
   * @private
   * @async
   * @param {string} text - Texto a traducir.
   * @param {boolean} raw - Si true, usa translateRaw sin capitalización; si false, usa translate con capitalización.
   * @returns {Promise<string>} Promesa de traducción, ya sea cacheada o nueva.
   */
  private translateCached(text: string, raw: boolean): Promise<string> {
    const key = `${raw ? "raw" : "value"}:${text}`;

    if (!this.translationCache.has(key)) {
      this.translationCache.set(
        key,
        raw ? this.translationService.translateRaw(text) : this.translationService.translate(text)
      );
    }

    return this.translationCache.get(key)!;
  }

  /**
   * Determina si un valor no es traducible (números, decimales, fechas ISO).
   * 
   * Valores no traducibles se retornan sin procesar por la API de traducción.
   * @private
   * @param {string} value - Valor a verificar.
   * @returns {boolean} true si el valor parece ser un número o fecha; false en caso contrario.
   */
  private isLikelyNonTranslatable(value: string): boolean {
    return /^\d+([.,]\d+)?$/.test(value) || /^\d{4}-\d{2}-\d{2}$/.test(value);
  }
}
