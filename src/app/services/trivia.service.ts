import { Injectable } from '@angular/core';
import { SwapiService } from './swapi.service';

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class TriviaService {
  constructor(private swapiService: SwapiService) {}

  private shuffleArray(array: string[]): string[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  private getRandomItems(array: any[], count: number): any[] {
    return [...array].sort(() => Math.random() - 0.5).slice(0, count);
  }

  async generateQuestion(): Promise<TriviaQuestion> {
    const categories = ['people', 'planets', 'films'];
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];

    if (selectedCategory === 'people') {
      return this.generatePeopleQuestion();
    }

    if (selectedCategory === 'planets') {
      return this.generatePlanetQuestion();
    }

    return this.generateFilmQuestion();
  }

  private async generatePeopleQuestion(): Promise<TriviaQuestion> {
    const response = await this.swapiService.getPeople(1);
    const people = response.results.filter((p: any) => p.homeworld);

    const person = people[Math.floor(Math.random() * people.length)];
    const correctPlanet = await this.swapiService.getByUrl(person.homeworld);

    const randomPeople = this.getRandomItems(
      people.filter((p: any) => p.name !== person.name),
      6
    );

    const wrongPlanets: string[] = [];

    for (const p of randomPeople) {
      if (p.homeworld) {
        const planet = await this.swapiService.getByUrl(p.homeworld);
        if (planet.name !== correctPlanet.name && !wrongPlanets.includes(planet.name)) {
          wrongPlanets.push(planet.name);
        }
      }
      if (wrongPlanets.length === 3) {
        break;
      }
    }

    while (wrongPlanets.length < 3) {
      wrongPlanets.push(`Planeta ${wrongPlanets.length + 1}`);
    }

    const options = this.shuffleArray([
      correctPlanet.name,
      ...wrongPlanets
    ]);

    return {
      question: `¿De qué planeta es ${person.name}?`,
      options,
      correctAnswer: correctPlanet.name,
      category: 'Personajes'
    };
  }

  private async generatePlanetQuestion(): Promise<TriviaQuestion> {
    const response = await this.swapiService.getPlanets(1);
    const planets = response.results.filter((p: any) => p.climate);

    const planet = planets[Math.floor(Math.random() * planets.length)];
    const wrongPlanets = this.getRandomItems(
      planets.filter((p: any) => p.name !== planet.name),
      3
    );

    const options = this.shuffleArray([
      planet.climate,
      ...wrongPlanets.map((p: any) => p.climate)
    ]);

    return {
      question: `¿Cuál es el clima de ${planet.name}?`,
      options,
      correctAnswer: planet.climate,
      category: 'Planetas'
    };
  }

  private async generateFilmQuestion(): Promise<TriviaQuestion> {
    const response = await this.swapiService.getFilms();
    const films = response.results;

    const film = films[Math.floor(Math.random() * films.length)];
    const wrongFilms = this.getRandomItems(
      films.filter((f: any) => f.title !== film.title),
      3
    );

    const options = this.shuffleArray([
      film.director,
      ...wrongFilms.map((f: any) => f.director)
    ]);

    return {
      question: `¿Quién dirigió la película "${film.title}"?`,
      options,
      correctAnswer: film.director,
      category: 'Películas'
    };
  }
}
