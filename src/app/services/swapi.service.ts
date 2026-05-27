import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SwapiService {
  private baseUrl = "https://swapi.py4e.com/api";

  constructor(private http: HttpClient) {}

  getPeople(page: number = 1): Promise<any> {
    return firstValueFrom(
      this.http.get(`${this.baseUrl}/people/?page=${page}`),
    );
  }

  getPerson(id: string): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/people/${id}/`));
  }

  getPlanets(page: number = 1): Promise<any> {
    return firstValueFrom(
      this.http.get(`${this.baseUrl}/planets/?page=${page}`),
    );
  }

  getPlanet(id: string): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/planets/${id}/`));
  }

  getFilms(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/films/`));
  }

  getFilm(id: string): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/films/${id}/`));
  }

  getByUrl(url: string): Promise<any> {
    return firstValueFrom(this.http.get(url));
  }
}
