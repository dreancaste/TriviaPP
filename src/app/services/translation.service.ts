import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(private http: HttpClient) {}

  async translate(text: string): Promise<string> {

    try {

      const response: any = await firstValueFrom(
        this.http.get(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es`
        )
      );

      const translated =
        response.responseData.translatedText;

      return this.capitalize(
        translated.replace(/\bde\b/gi, 'de')
      );

    } catch (error) {

      return this.capitalize(text);
    }
  }

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
}