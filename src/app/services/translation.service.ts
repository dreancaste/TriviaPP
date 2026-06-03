import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
 * Servicio de traducción que convierte texto del inglés al español.
 * 
 * Utiliza la API MyMemory Translation API para realizar traducciones.
 * Maneja textos largos dividiéndolos en fragmentos para respetar los límites
 * de la API y aplica capitalización a los resultados.
 * 
 * @injectable
 */
@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  /**
   * Límite máximo de caracteres permitidos por consulta a la API MyMemory.
   * Los textos más largos se dividen en fragmentos.
   * @private
   * @type {number}
   */
  private readonly maxQueryLength = 450;

  constructor(private http: HttpClient) {}

  /**
   * Traduce un texto del inglés al español y capitaliza el resultado.
   * 
   * Si la traducción falla, retorna el texto original capitalizado.
   * Preserva preposiciones como "de" sin transformarlas.
   * @async
   * @param {string} text - Texto en inglés a traducir.
   * @returns {Promise<string>} Texto traducido y capitalizado.
   */
  async translate(text: string): Promise<string> {

    try {
      const translated = await this.translateRaw(text);

      return this.capitalize(
        translated.replace(/\bde\b/gi, 'de')
      );

    } catch (error) {

      return this.capitalize(text);
    }
  }

  /**
   * Realiza la traducción sin capitalizar el resultado.
   * 
   * Maneja textos largos dividiéndolos en fragmentos respetando el límite de la API.
   * Si el texto está vacío, retorna una cadena vacía.
   * @private
   * @async
   * @param {string} text - Texto en inglés a traducir.
   * @returns {Promise<string>} Texto traducido sin capitalización.
   */
  async translateRaw(text: string): Promise<string> {
    if (!text) return '';

    try {
      if (text.length > this.maxQueryLength) {
        const chunks = this.splitForApi(text);
        const translatedChunks = await Promise.all(
          chunks.map((chunk) => this.requestTranslation(chunk))
        );

        return translatedChunks.join(' ');
      }

      return this.requestTranslation(text);

    } catch (error) {

      return text;
    }
  }

  /**
   * Realiza una solicitud HTTP a la API MyMemory para traducir un fragmento de texto.
   * 
   * Si la traducción excede los límites de consulta o falla, retorna el texto original.
   * @private
   * @async
   * @param {string} text - Fragmento de texto a traducir (debe ser menor a maxQueryLength).
   * @returns {Promise<string>} Texto traducido o el original si ocurre un error.
   */
  private async requestTranslation(text: string): Promise<string> {
    try {

      const response: any = await firstValueFrom(
        this.http.get(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es`
        )
      );

      const translated =
        response.responseData.translatedText;

      if (!translated || translated.includes('QUERY LENGTH LIMIT EXCEEDED')) {
        return text;
      }

      return translated;

    } catch (error) {

      return text;
    }
  }

  /**
   * Capitaliza un texto dividido por comas, procesando cada parte por separado.
   * 
   * Convierte la primera letra de cada segmento a mayúscula
   * y el resto a minúsculas, luego reúne los segmentos con comas y espacios.
   * @private
   * @param {string} text - Texto a capitalizar, posiblemente con múltiples segmentos.
   * @returns {string} Texto capitalizado o cadena vacía si la entrada es vacía.
   */
  private capitalize(text: string): string {

    if (!text) return '';

    return text
      .split(',')
      .map(part => {
        const trimmed = part.trim();

        return trimmed.charAt(0).toUpperCase() +
          trimmed.slice(1).toLowerCase();
      })
      .join(', ');
  }

  /**
   * Divide un texto largo en fragmentos respetando los límites de la API y límites de oración.
   * 
   * Intenta mantener oraciones completas juntas, pero si una oración es más larga que el límite,
   * la divide en palabras. Todos los fragmentos respetan el maxQueryLength.
   * @private
   * @param {string} text - Texto a dividir en fragmentos.
   * @returns {string[]} Arreglo de fragmentos, cada uno dentro del límite permitido.
   */
  private splitForApi(text: string): string[] {
    const normalized = text.replace(/\s+/g, ' ').trim();
    const sentences = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [normalized];
    const chunks: string[] = [];
    let current = '';

    for (const sentence of sentences) {
      const trimmed = sentence.trim();

      if (!trimmed) continue;

      if (trimmed.length > this.maxQueryLength) {
        if (current) {
          chunks.push(current);
          current = '';
        }

        chunks.push(...this.splitLongText(trimmed));
        continue;
      }

      const next = current ? `${current} ${trimmed}` : trimmed;

      if (next.length > this.maxQueryLength) {
        chunks.push(current);
        current = trimmed;
      } else {
        current = next;
      }
    }

    if (current) {
      chunks.push(current);
    }

    return chunks;
  }

  /**
   * Divide un texto muy largo en fragmentos basados en palabras individuales.
   * 
   * Se utiliza como fallback cuando una oración individual es más larga que maxQueryLength.
   * Cada fragmento contiene el máximo de palabras posible sin exceder el límite.
   * @private
   * @param {string} text - Texto muy largo a dividir palabra por palabra.
   * @returns {string[]} Arreglo de fragmentos de palabras, cada uno dentro del límite permitido.
   */
  private splitLongText(text: string): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let current = '';

    for (const word of words) {
      const next = current ? `${current} ${word}` : word;

      if (next.length > this.maxQueryLength) {
        if (current) chunks.push(current);
        current = word;
      } else {
        current = next;
      }
    }

    if (current) chunks.push(current);

    return chunks;
  }
}
