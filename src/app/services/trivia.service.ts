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
  private usedQuestionKeys: string[] = [];

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
  },
  {
    question: '¿Qué planeta desértico es hogar de Luke Skywalker?',
    options: ['Tatooine', 'Jakku', 'Geonosis', 'Arrakis'],
    correctAnswer: 'Tatooine',
    category: 'Lore'
  },
  {
    question: '¿Cómo se llama la estación de batalla esférica del Imperio?',
    options: ['Estrella de la Muerte', 'Base Starkiller', 'Ejecutor', 'Ciudad Nube'],
    correctAnswer: 'Estrella de la Muerte',
    category: 'Lore'
  },
  {
    question: '¿Quién dice “Yo soy tu padre”?',
    options: ['Darth Vader', 'Palpatine', 'Obi-Wan Kenobi', 'Yoda'],
    correctAnswer: 'Darth Vader',
    category: 'Lore'
  },
  {
    question: '¿Qué personaje queda congelado en carbonita?',
    options: ['Han Solo', 'Luke Skywalker', 'Chewbacca', 'Lando Calrissian'],
    correctAnswer: 'Han Solo',
    category: 'Lore'
  },
  {
    question: '¿Quién es el mejor amigo Wookiee de Han Solo?',
    options: ['Chewbacca', 'Tarfful', 'Bossk', 'Greedo'],
    correctAnswer: 'Chewbacca',
    category: 'Lore'
  },
  {
    question: '¿Qué planeta helado aparece en El Imperio Contraataca?',
    options: ['Hoth', 'Endor', 'Ilum', 'Kamino'],
    correctAnswer: 'Hoth',
    category: 'Lore'
  },
  {
    question: '¿Qué personaje traiciona a Han y Leia en Ciudad Nube?',
    options: ['Lando Calrissian', 'Wedge Antilles', 'Ackbar', 'Cassian Andor'],
    correctAnswer: 'Lando Calrissian',
    category: 'Lore'
  },
  {
    question: '¿Cómo se llama el maestro Jedi de color púrpura?',
    options: ['Mace Windu', 'Ki-Adi-Mundi', 'Plo Koon', 'Kit Fisto'],
    correctAnswer: 'Mace Windu',
    category: 'Lore'
  },
  {
    question: '¿Qué título recibe Palpatine antes de ser Emperador?',
    options: ['Canciller Supremo', 'Gran Moff', 'Senador Mayor', 'Virrey'],
    correctAnswer: 'Canciller Supremo',
    category: 'Lore'
  },
  {
    question: '¿Quién lidera el ataque a la Estrella de la Muerte en Episodio IV?',
    options: ['Luke Skywalker', 'Han Solo', 'Leia Organa', 'Wedge Antilles'],
    correctAnswer: 'Luke Skywalker',
    category: 'Lore'
  },
  {
    question: '¿Qué raza es Jar Jar Binks?',
    options: ['Gungan', 'Twi’lek', 'Mon Calamari', 'Rodian'],
    correctAnswer: 'Gungan',
    category: 'Lore'
  },
  {
    question: '¿Qué planeta acuático es hogar de los clones?',
    options: ['Kamino', 'Naboo', 'Mon Cala', 'Mandalore'],
    correctAnswer: 'Kamino',
    category: 'Lore'
  },
  {
    question: '¿Qué Jedi sobrevive escondiéndose en Tatooine para vigilar a Luke?',
    options: ['Obi-Wan Kenobi', 'Yoda', 'Ahsoka Tano', 'Mace Windu'],
    correctAnswer: 'Obi-Wan Kenobi',
    category: 'Lore'
  },
  {
    question: '¿Qué nombre recibe la aprendiz de Anakin en The Clone Wars?',
    options: ['Ahsoka Tano', 'Asajj Ventress', 'Bo-Katan', 'Shaak Ti'],
    correctAnswer: 'Ahsoka Tano',
    category: 'Lore'
  },
  {
    question: '¿Qué Sith usa un sable de luz doble?',
    options: ['Darth Maul', 'Darth Tyranus', 'Darth Vader', 'Kylo Ren'],
    correctAnswer: 'Darth Maul',
    category: 'Lore'
  },
  {
    question: '¿Cómo se llama el líder separatista Sith?',
    options: ['Count Dooku', 'General Grievous', 'Nute Gunray', 'Tarkin'],
    correctAnswer: 'Count Dooku',
    category: 'Lore'
  },
  {
    question: '¿Qué planeta volcánico se asocia con Darth Vader?',
    options: ['Mustafar', 'Geonosis', 'Korriban', 'Malachor'],
    correctAnswer: 'Mustafar',
    category: 'Lore'
  },
  {
    question: '¿Qué princesa lidera la Rebelión?',
    options: ['Leia Organa', 'Padmé Amidala', 'Mon Mothma', 'Satine Kryze'],
    correctAnswer: 'Leia Organa',
    category: 'Lore'
  },
  {
    question: '¿Qué personaje dice “Es una trampa”?',
    options: ['Almirante Ackbar', 'Tarkin', 'Lando', 'Wedge'],
    correctAnswer: 'Almirante Ackbar',
    category: 'Lore'
  },
  {
    question: '¿Qué criatura pequeña y sabia pertenece al Consejo Jedi?',
    options: ['Yoda', 'Wicket', 'Salacious Crumb', 'Maz Kanata'],
    correctAnswer: 'Yoda',
    category: 'Lore'
  },
  {
    question: '¿Cómo se llama el palacio donde vive Jabba?',
    options: ['Palacio de Jabba', 'Fortaleza de Vader', 'Templo Jedi', 'Base Echo'],
    correctAnswer: 'Palacio de Jabba',
    category: 'Lore'
  },
  {
    question: '¿Quién mata al Emperador Palpatine en El Retorno del Jedi?',
    options: ['Darth Vader', 'Luke Skywalker', 'Leia Organa', 'Han Solo'],
    correctAnswer: 'Darth Vader',
    category: 'Lore'
  },
  {
    question: '¿Qué ewok ayuda a la Rebelión en Endor?',
    options: ['Wicket', 'Teebo', 'Paploo', 'Logray'],
    correctAnswer: 'Wicket',
    category: 'Lore'
  },
  {
    question: '¿Qué nombre recibe la alianza contra el Imperio?',
    options: ['Alianza Rebelde', 'Nueva República', 'Primera Orden', 'Senado Libre'],
    correctAnswer: 'Alianza Rebelde',
    category: 'Lore'
  },
  {
    question: '¿Quién roba los planos de la Estrella de la Muerte en Rogue One?',
    options: ['Jyn Erso', 'Leia Organa', 'Rey', 'Padmé Amidala'],
    correctAnswer: 'Jyn Erso',
    category: 'Lore'
  },
  {
    question: '¿Cómo se llama el padre de Boba Fett?',
    options: ['Jango Fett', 'Rex Fett', 'Cobb Vanth', 'Din Djarin'],
    correctAnswer: 'Jango Fett',
    category: 'Lore'
  },
  {
    question: '¿Qué mandaloriano protagoniza The Mandalorian?',
    options: ['Din Djarin', 'Boba Fett', 'Bo-Katan', 'Pre Vizsla'],
    correctAnswer: 'Din Djarin',
    category: 'Lore'
  },
  {
    question: '¿Cómo llama mucha gente a Grogu?',
    options: ['Baby Yoda', 'Young Yoda', 'Mini Jedi', 'Little Master'],
    correctAnswer: 'Baby Yoda',
    category: 'Lore'
  },
  {
    question: '¿Qué villano usa una máscara y una respiración mecánica característica?',
    options: ['Darth Vader', 'Kylo Ren', 'General Grievous', 'Phasma'],
    correctAnswer: 'Darth Vader',
    category: 'Lore'
  },
  {
    question: '¿Qué arma usa Han Solo normalmente?',
    options: ['Bláster', 'Sable de luz', 'Lanza eléctrica', 'Arco láser'],
    correctAnswer: 'Bláster',
    category: 'Lore'
  },
  {
    question: '¿Qué personaje pilota el Halcón Milenario junto a Han Solo?',
    options: ['Chewbacca', 'Lando Calrissian', 'Luke Skywalker', 'Poe Dameron'],
    correctAnswer: 'Chewbacca',
    category: 'Lore'
  },
  {
    question: '¿Qué color de sable usa comúnmente Luke Skywalker en El Retorno del Jedi?',
    options: ['Verde', 'Azul', 'Rojo', 'Violeta'],
    correctAnswer: 'Verde',
    category: 'Lore'
  }
];

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

  async generateQuestion(): Promise<TriviaQuestion> {
  const generators = [
    () => this.generateLoreQuestion(),
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

  this.resetUsedQuestions();
  const fallbackGenerator = generators[Math.floor(Math.random() * generators.length)];
  const fallbackQuestion = await fallbackGenerator();
  return this.markQuestionAsUsed(fallbackQuestion);
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
  return this.markQuestionAsUsed(availableQuestions[randomIndex]);
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

  resetUsedQuestions(): void {
  this.usedQuestionKeys = [];
}

private markQuestionAsUsed(question: TriviaQuestion): TriviaQuestion {
  this.usedQuestionKeys.push(question.question);
  return question;
}
}