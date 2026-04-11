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
  private usedQuestionKeys: string[] = [];

  constructor(private swapiService: SwapiService) {}

  private loreQuestions: TriviaQuestion[] = [
    {
      question: '¿Quién fue el maestro de Obi-Wan Kenobi?',
      options: ['Qui-Gon Jinn', 'Yoda', 'Mace Windu', 'Anakin Skywalker'],
      correctAnswer: 'Qui-Gon Jinn',
      category: 'Lore'
    },
    {
      question: '¿Qué nombre Sith adopta Anakin Skywalker?',
      options: ['Darth Vader', 'Darth Maul', 'Darth Sidious', 'Kylo Ren'],
      correctAnswer: 'Darth Vader',
      category: 'Lore'
    },
    {
      question: '¿Qué planeta destruye la Estrella de la Muerte en el Episodio IV?',
      options: ['Alderaan', 'Tatooine', 'Naboo', 'Hoth'],
      correctAnswer: 'Alderaan',
      category: 'Lore'
    },
    {
      question: '¿Quién entrena a Luke Skywalker en Dagobah?',
      options: ['Yoda', 'Obi-Wan Kenobi', 'Qui-Gon Jinn', 'Mace Windu'],
      correctAnswer: 'Yoda',
      category: 'Lore'
    },
    {
      question: '¿Qué orden ejecuta la eliminación de los Jedi?',
      options: ['Orden 66', 'Orden 99', 'Protocolo Omega', 'Decreto Imperial'],
      correctAnswer: 'Orden 66',
      category: 'Lore'
    },
    {
      question: '¿Quién es el padre de Luke Skywalker?',
      options: ['Anakin Skywalker', 'Han Solo', 'Obi-Wan Kenobi', 'Palpatine'],
      correctAnswer: 'Anakin Skywalker',
      category: 'Lore'
    },
    {
      question: '¿Qué arma usan tradicionalmente los Jedi?',
      options: ['Sable de luz', 'Bláster', 'Lanza', 'Rifle iónico'],
      correctAnswer: 'Sable de luz',
      category: 'Lore'
    },
    {
      question: '¿Qué organización gobierna la galaxia antes del Imperio?',
      options: ['República Galáctica', 'Primera Orden', 'Alianza Rebelde', 'Imperio Galáctico'],
      correctAnswer: 'República Galáctica',
      category: 'Lore'
    },
    {
      question: '¿Quién es el Emperador Sith en la trilogía original?',
      options: ['Palpatine', 'Dooku', 'Maul', 'Snoke'],
      correctAnswer: 'Palpatine',
      category: 'Lore'
    },
    {
      question: '¿Cómo se llama el hijo de Han Solo y Leia?',
      options: ['Ben Solo', 'Luke Solo', 'Jacen Organa', 'Anakin Solo'],
      correctAnswer: 'Ben Solo',
      category: 'Lore'
    },
    {
      question: '¿Qué planeta es el hogar de los Wookiees?',
      options: ['Kashyyyk', 'Endor', 'Naboo', 'Corellia'],
      correctAnswer: 'Kashyyyk',
      category: 'Lore'
    },
    {
      question: '¿Cómo se llama el maestro Sith de Darth Vader?',
      options: ['Darth Sidious', 'Darth Maul', 'Darth Plagueis', 'Darth Bane'],
      correctAnswer: 'Darth Sidious',
      category: 'Lore'
    },
    {
      question: '¿Qué color se asocia tradicionalmente a los sables Sith?',
      options: ['Rojo', 'Azul', 'Verde', 'Violeta'],
      correctAnswer: 'Rojo',
      category: 'Lore'
    },
    {
      question: '¿En qué planeta vive Yoda durante su exilio?',
      options: ['Dagobah', 'Tatooine', 'Hoth', 'Mustafar'],
      correctAnswer: 'Dagobah',
      category: 'Lore'
    },
    {
      question: '¿Quién mata a Qui-Gon Jinn?',
      options: ['Darth Maul', 'Count Dooku', 'Darth Vader', 'General Grievous'],
      correctAnswer: 'Darth Maul',
      category: 'Lore'
    },
    {
      question: '¿Qué cazarrecompensas es el padre clon de los soldados clon?',
      options: ['Jango Fett', 'Boba Fett', 'Cad Bane', 'Bossk'],
      correctAnswer: 'Jango Fett',
      category: 'Lore'
    },
    {
      question: '¿Cómo se llama la hermana de Luke Skywalker?',
      options: ['Leia Organa', 'Padmé Amidala', 'Rey', 'Jyn Erso'],
      correctAnswer: 'Leia Organa',
      category: 'Lore'
    },
    {
      question: '¿Qué villano colecciona sables de luz Jedi?',
      options: ['General Grievous', 'Darth Maul', 'Snoke', 'Tarkin'],
      correctAnswer: 'General Grievous',
      category: 'Lore'
    },
    {
      question: '¿Quién fue el maestro de Anakin Skywalker?',
      options: ['Obi-Wan Kenobi', 'Yoda', 'Mace Windu', 'Qui-Gon Jinn'],
      correctAnswer: 'Obi-Wan Kenobi',
      category: 'Lore'
    }
  ];

  resetUsedQuestions(): void {
    this.usedQuestionKeys = [];
  }

  private markQuestionAsUsed(question: TriviaQuestion): TriviaQuestion {
    this.usedQuestionKeys.push(question.question);
    return question;
  }

  private shuffleArray(array: string[]): string[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  private getRandomItems(array: any[], count: number): any[] {
    return [...array].sort(() => Math.random() - 0.5).slice(0, count);
  }

  private buildUniqueOptions(correctAnswer: string, wrongAnswers: string[], totalOptions: number = 4): string[] {
    const unique = new Set<string>();

    if (correctAnswer && correctAnswer.trim() !== '') {
      unique.add(correctAnswer.trim());
    }

    for (const answer of wrongAnswers) {
      if (
        answer &&
        answer.trim() !== '' &&
        answer.trim().toLowerCase() !== correctAnswer.trim().toLowerCase()
      ) {
        unique.add(answer.trim());
      }

      if (unique.size === totalOptions) {
        break;
      }
    }

    return this.shuffleArray(Array.from(unique)).slice(0, totalOptions);
  }

  private generateLoreQuestion(): TriviaQuestion {
    const availableQuestions = this.loreQuestions.filter(
      q => !this.usedQuestionKeys.includes(q.question)
    );

    if (availableQuestions.length === 0) {
      this.resetUsedQuestions();
      return this.generateLoreQuestion();
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
  }

  async generateQuestion(): Promise<TriviaQuestion> {
  const random = Math.random();

  if (random < 0.6) {
    return this.markQuestionAsUsed(this.generateLoreQuestion());
  }

  const generators = [
    () => this.generatePeopleQuestion(),
    () => this.generatePlanetQuestion(),
    () => this.generateFilmQuestion()
  ];

  for (let i = 0; i < 10; i++) {
    const randomGenerator = generators[Math.floor(Math.random() * generators.length)];
    const question = await randomGenerator();

    if (!this.usedQuestionKeys.includes(question.question)) {
      return this.markQuestionAsUsed(question);
    }
  }

  return this.markQuestionAsUsed(this.generateLoreQuestion());
}

  private async generatePeopleQuestion(): Promise<TriviaQuestion> {
    const response = await this.swapiService.getPeople(1);
    const people = response.results.filter((p: any) => p.homeworld);

    const person = people[Math.floor(Math.random() * people.length)];
    const correctPlanet = await this.swapiService.getByUrl(person.homeworld);

    const wrongPlanets: string[] = [];

    for (const candidate of this.getRandomItems(people, people.length)) {
      if (!candidate.homeworld || candidate.name === person.name) continue;

      const planet = await this.swapiService.getByUrl(candidate.homeworld);
      if (planet?.name) {
        wrongPlanets.push(planet.name);
      }

      if (wrongPlanets.length >= 10) {
        break;
      }
    }

    let options = this.buildUniqueOptions(correctPlanet.name, wrongPlanets, 4);

    while (options.length < 4) {
      options.push(`Opción ${options.length + 1}`);
    }

    options = this.shuffleArray(options);

    return {
      question: `¿De qué planeta es ${person.name}?`,
      options,
      correctAnswer: correctPlanet.name,
      category: 'Personajes'
    };
  }

  private async generatePlanetQuestion(): Promise<TriviaQuestion> {
    const response = await this.swapiService.getPlanets(1);
    const planets = response.results.filter((p: any) => p.climate && p.climate !== 'unknown');

    const planet = planets[Math.floor(Math.random() * planets.length)];

    const wrongAnswers = planets
      .filter((p: any) => p.name !== planet.name)
      .map((p: any) => p.climate);

    let options = this.buildUniqueOptions(planet.climate, wrongAnswers, 4);

    while (options.length < 4) {
      options.push(`Clima ${options.length + 1}`);
    }

    options = this.shuffleArray(options);

    return {
      question: `¿Cuál es el clima de ${planet.name}?`,
      options,
      correctAnswer: planet.climate,
      category: 'Planetas'
    };
  }

  private async generateFilmQuestion(): Promise<TriviaQuestion> {
    const response = await this.swapiService.getFilms();
    const films = response.results.filter((f: any) => f.director && f.director !== 'unknown');

    const film = films[Math.floor(Math.random() * films.length)];

    const wrongAnswers = films
      .filter((f: any) => f.title !== film.title)
      .map((f: any) => f.director);

    let options = this.buildUniqueOptions(film.director, wrongAnswers, 4);

    while (options.length < 4) {
      options.push(`Director ${options.length + 1}`);
    }

    options = this.shuffleArray(options);

    return {
      question: `¿Quién dirigió la película "${film.title}"?`,
      options,
      correctAnswer: film.director,
      category: 'Películas'
    };
  }
}