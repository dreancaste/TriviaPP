import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TranslationService {
  private readonly maxQueryLength = 450;

  constructor(private http: HttpClient) {}

  async translate(text: string): Promise<string> {
    try {
      const translated = await this.translateRaw(text);

      return this.capitalize(translated.replace(/\bde\b/gi, "de"));
    } catch (error) {
      return this.capitalize(text);
    }
  }

  async translateRaw(text: string): Promise<string> {
    if (!text) return "";

    try {
      if (text.length > this.maxQueryLength) {
        const chunks = this.splitForApi(text);
        const translatedChunks = await Promise.all(
          chunks.map((chunk) => this.requestTranslation(chunk)),
        );

        return translatedChunks.join(" ");
      }

      return this.requestTranslation(text);
    } catch (error) {
      return text;
    }
  }

  private async requestTranslation(text: string): Promise<string> {
    try {
      const response: any = await firstValueFrom(
        this.http.get(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es`,
        ),
      );

      const translated = response.responseData.translatedText;

      if (!translated || translated.includes("QUERY LENGTH LIMIT EXCEEDED")) {
        return text;
      }

      return translated;
    } catch (error) {
      return text;
    }
  }

  private capitalize(text: string): string {
    if (!text) return "";

    return text
      .split(",")
      .map((part) => {
        const trimmed = part.trim();

        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
      })
      .join(", ");
  }

  private splitForApi(text: string): string[] {
    const normalized = text.replace(/\s+/g, " ").trim();
    const sentences = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [
      normalized,
    ];
    const chunks: string[] = [];
    let current = "";

    for (const sentence of sentences) {
      const trimmed = sentence.trim();

      if (!trimmed) continue;

      if (trimmed.length > this.maxQueryLength) {
        if (current) {
          chunks.push(current);
          current = "";
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

  private splitLongText(text: string): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let current = "";

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
