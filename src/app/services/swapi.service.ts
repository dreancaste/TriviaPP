import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  private baseUrl = 'https://swapi.py4e.com/api';

  constructor(private http: HttpClient) {}

  getPeople(page: number = 1): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/people/?page=${page}`));
  }

  getPlanets(page: number = 1): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/planets/?page=${page}`));
  }

  getFilms(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/films/`));
  }

  getByUrl(url: string): Promise<any> {
    return firstValueFrom(this.http.get(url));
  }
}
