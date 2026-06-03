import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

/**
 * Servicio que proporciona acceso a la API SWAPI (Star Wars API).
 * 
 * Consume la API pública de SWAPI para obtener datos sobre personajes, planetas y películas del universo Star Wars.
 * Convierte observables RxJS a promesas para un manejo más sencillo del código asincrónico.
 * 
 * @injectable
 */
@Injectable({
  providedIn: "root",
})
export class SwapiService {
  /**
   * URL base de la API SWAPI.
   * @private
   * @type {string}
   */
  private baseUrl = "https://swapi.py4e.com/api";

  constructor(private http: HttpClient) {}

  /**
   * Obtiene una página de personajes de Star Wars desde la API SWAPI.
   * 
   * La API retorna resultados paginados con 10 elementos por página.
   * @async
   * @param {number} [page=1] - Número de página a obtener (por defecto 1).
   * @returns {Promise<any>} Objeto de respuesta que contiene un arreglo de personajes y metadatos de paginación.
   */
  getPeople(page: number = 1): Promise<any> {
    return firstValueFrom(
      this.http.get(`${this.baseUrl}/people/?page=${page}`),
    );
  }

  /**
   * Obtiene los detalles de un personaje específico por su ID.
   * @async
   * @param {string} id - Identificador del personaje en la API SWAPI.
   * @returns {Promise<any>} Objeto con los detalles completos del personaje.
   */
  getPerson(id: string): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/people/${id}/`));
  }

  /**
   * Obtiene una página de planetas de Star Wars desde la API SWAPI.
   * 
   * La API retorna resultados paginados con 10 elementos por página.
   * @async
   * @param {number} [page=1] - Número de página a obtener (por defecto 1).
   * @returns {Promise<any>} Objeto de respuesta que contiene un arreglo de planetas y metadatos de paginación.
   */
  getPlanets(page: number = 1): Promise<any> {
    return firstValueFrom(
      this.http.get(`${this.baseUrl}/planets/?page=${page}`),
    );
  }

  /**
   * Obtiene los detalles de un planeta específico por su ID.
   * @async
   * @param {string} id - Identificador del planeta en la API SWAPI.
   * @returns {Promise<any>} Objeto con los detalles completos del planeta.
   */
  getPlanet(id: string): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/planets/${id}/`));
  }

  /**
   * Obtiene la lista completa de películas de Star Wars desde la API SWAPI.
   * 
   * A diferencia de personajes y planetas, las películas no están paginadas
   * y se retornan todas en una única solicitud.
   * @async
   * @returns {Promise<any>} Objeto de respuesta que contiene un arreglo con todas las películas.
   */
  getFilms(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/films/`));
  }

  /**
   * Obtiene los detalles de una película específica por su ID.
   * @async
   * @param {string} id - Identificador de la película en la API SWAPI.
   * @returns {Promise<any>} Objeto con los detalles completos de la película.
   */
  getFilm(id: string): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/films/${id}/`));
  }

  /**
   * Obtiene un recurso desde SWAPI utilizando su URL completa.
   * 
   * Útil para seguir referencias cruzadas en respuestas de SWAPI,
   * como obtener el planeta natal desde una URL incluida en los datos de un personaje.
   * @async
   * @param {string} url - URL completa del recurso en la API SWAPI.
   * @returns {Promise<any>} Objeto con los detalles del recurso solicitado.
   */
  getByUrl(url: string): Promise<any> {
    return firstValueFrom(this.http.get(url));
  }
}
