import { Injectable } from "@angular/core";
import {
  WIKI_ASSETS,
  WIKI_CURIOSITIES,
  WIKI_SECTIONS,
  WIKI_STAT_ICONS,
  WikiEntityType,
} from "../data/wiki-content";
import { TranslationService } from "./translation.service";

@Injectable({
  providedIn: "root",
})
export class WikiContentService {
  readonly sections = WIKI_SECTIONS;
  private translationCache = new Map<string, Promise<string>>();

  constructor(private translationService: TranslationService) {}

  getSection(type: WikiEntityType) {
    return this.sections.find((section) => section.type === type);
  }

  getVisualGuideImage(type: WikiEntityType, id: string | number): string {
    return `https://starwars-visualguide.com/assets/img/${type}/${id}.jpg`;
  }

  getImages(type: WikiEntityType, id: string, fallbackImage: string): string[] {
    return WIKI_ASSETS[type]?.[id]?.images || [fallbackImage];
  }

  getMap(type: WikiEntityType, id: string) {
    const assets = WIKI_ASSETS[type]?.[id];

    return {
      map: assets?.map,
      mobileMap: assets?.mobileMap,
    };
  }

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

  getStatIcon(icon: keyof typeof WIKI_STAT_ICONS): string {
    return WIKI_STAT_ICONS[icon];
  }

  async translateValues(values: any[]): Promise<string[]> {
    return Promise.all(values.map((value) => this.translateValue(value)));
  }

  async translateValue(value: any): Promise<string> {
    const normalized = this.valueOrUnknown(value);

    if (normalized === "desconocido" || this.isLikelyNonTranslatable(normalized)) {
      return normalized;
    }

    return this.translateCached(normalized, false);
  }

  async translateParagraph(text: string): Promise<string> {
    if (!text || this.isLikelyNonTranslatable(text)) {
      return text || "";
    }

    return this.translateCached(text, true);
  }

  valueOrUnknown(value: any): string {
    return value && value !== "unknown" ? String(value) : "desconocido";
  }

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

  private isLikelyNonTranslatable(value: string): boolean {
    return /^\d+([.,]\d+)?$/.test(value) || /^\d{4}-\d{2}-\d{2}$/.test(value);
  }
}
