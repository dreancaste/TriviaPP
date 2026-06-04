import { Injectable } from "@angular/core";
import { SwapiService } from "./swapi.service";
import { TriviaQuestion } from "../models/trivia-question.model";
import { TranslationService } from "./translation.service";

/**
 * Servicio responsable de la generación y gestión de preguntas de trivia relacionadas con el universo de Star Wars.
 * 
 * Genera preguntas de forma aleatoria y equitativa desde tres categorías:
 * - Preguntas de lore predefinidas (60% de probabilidad)
 * - Preguntas sobre personajes obtenidas de la API SWAPI (máximo 40%)
 * - Preguntas sobre planetas obtenidas de la API SWAPI (máximo 40%)
 * - Preguntas sobre películas obtenidas de la API SWAPI (máximo 40%)
 * 
 * Realiza un seguimiento de las preguntas ya utilizadas para evitar repeticiones durante una sesión
 * y reutiliza el conjunto completo de preguntas cuando se agotan.
 * 
 * @injectable
 */
@Injectable({
  providedIn: "root",
})
export class TriviaService {

  /**
   * Registro de preguntas ya formuladas durante la sesión actual.
   * Se utiliza para evitar repetir preguntas hasta que se agoten todas las disponibles.
   * @private
   * @type {string[]}
   */
  private usedQuestionKeys: string[] = [];

  constructor(
    private swapiService: SwapiService,
    private translationService: TranslationService
  ) {}

  /**
   * Conjunto de preguntas predefinidas sobre la trama y personajes de Star Wars.
   * Estas preguntas tienen mayor probabilidad de ser seleccionadas que aquellas
   * obtenidas dinámicamente de la API SWAPI.
   * @private
   * @type {TriviaQuestion[]}
   */
  private loreQuestions: TriviaQuestion[] = [
    {
      question: "¿Quién fue el maestro de Obi-Wan Kenobi?",
      options: ["Qui-Gon Jinn", "Yoda", "Mace Windu", "Anakin Skywalker"],
      correctAnswer: "Qui-Gon Jinn",
      category: "Lore",
    },
    {
      question: "¿Qué nombre Sith adopta Anakin Skywalker?",
      options: ["Darth Vader", "Darth Maul", "Darth Sidious", "Kylo Ren"],
      correctAnswer: "Darth Vader",
      category: "Lore",
    },
    {
      question:
        "¿Qué planeta destruye la Estrella de la Muerte en el Episodio IV?",
      options: ["Alderaan", "Tatooine", "Naboo", "Hoth"],
      correctAnswer: "Alderaan",
      category: "Lore",
    },
    {
      question: "¿Quién entrena a Luke Skywalker en Dagobah?",
      options: ["Yoda", "Obi-Wan Kenobi", "Qui-Gon Jinn", "Mace Windu"],
      correctAnswer: "Yoda",
      category: "Lore",
    },
    {
      question: "¿Qué orden ejecuta la eliminación de los Jedi?",
      options: ["Orden 66", "Orden 99", "Protocolo Omega", "Decreto Imperial"],
      correctAnswer: "Orden 66",
      category: "Lore",
    },
    {
      question: "¿Quién es el padre de Luke Skywalker?",
      options: ["Anakin Skywalker", "Han Solo", "Obi-Wan Kenobi", "Palpatine"],
      correctAnswer: "Anakin Skywalker",
      category: "Lore",
    },
    {
      question: "¿Qué arma usan tradicionalmente los Jedi?",
      options: ["Sable de luz", "Bláster", "Lanza", "Rifle iónico"],
      correctAnswer: "Sable de luz",
      category: "Lore",
    },
    {
      question: "¿Qué organización gobierna la galaxia antes del Imperio?",
      options: [
        "República Galáctica",
        "Primera Orden",
        "Alianza Rebelde",
        "Imperio Galáctico",
      ],
      correctAnswer: "República Galáctica",
      category: "Lore",
    },
    {
      question: "¿Quién es el Emperador Sith en la trilogía original?",
      options: ["Palpatine", "Dooku", "Maul", "Snoke"],
      correctAnswer: "Palpatine",
      category: "Lore",
    },
    {
      question: "¿Cómo se llama el hijo de Han Solo y Leia?",
      options: ["Ben Solo", "Luke Solo", "Jacen Organa", "Anakin Solo"],
      correctAnswer: "Ben Solo",
      category: "Lore",
    },
    {
      question: "¿Qué planeta es el hogar de los Wookiees?",
      options: ["Kashyyyk", "Endor", "Naboo", "Corellia"],
      correctAnswer: "Kashyyyk",
      category: "Lore",
    },
    {
      question: "¿Cómo se llama el maestro Sith de Darth Vader?",
      options: ["Darth Sidious", "Darth Maul", "Darth Plagueis", "Darth Bane"],
      correctAnswer: "Darth Sidious",
      category: "Lore",
    },
    {
      question: "¿Qué color se asocia tradicionalmente a los sables Sith?",
      options: ["Rojo", "Azul", "Verde", "Violeta"],
      correctAnswer: "Rojo",
      category: "Lore",
    },
    {
      question: "¿En qué planeta vive Yoda durante su exilio?",
      options: ["Dagobah", "Tatooine", "Hoth", "Mustafar"],
      correctAnswer: "Dagobah",
      category: "Lore",
    },
    {
      question: "¿Quién mata a Qui-Gon Jinn?",
      options: ["Darth Maul", "Count Dooku", "Darth Vader", "General Grievous"],
      correctAnswer: "Darth Maul",
      category: "Lore",
    },
    {
      question: "¿Qué cazarrecompensas es el padre clon de los soldados clon?",
      options: ["Jango Fett", "Boba Fett", "Cad Bane", "Bossk"],
      correctAnswer: "Jango Fett",
      category: "Lore",
    },
    {
      question: "¿Cómo se llama la hermana de Luke Skywalker?",
      options: ["Leia Organa", "Padmé Amidala", "Rey", "Jyn Erso"],
      correctAnswer: "Leia Organa",
      category: "Lore",
    },
    {
      question: "¿Qué villano colecciona sables de luz Jedi?",
      options: ["General Grievous", "Darth Maul", "Snoke", "Tarkin"],
      correctAnswer: "General Grievous",
      category: "Lore",
    },
    {
      question: "¿Quién fue el maestro de Anakin Skywalker?",
      options: ["Obi-Wan Kenobi", "Yoda", "Mace Windu", "Qui-Gon Jinn"],
      correctAnswer: "Obi-Wan Kenobi",
      category: "Lore",
    },
  ];

  /**
   * Reinicia el registro de preguntas utilizadas en la sesión actual.
   * Permite reutilizar todas las preguntas disponibles desde el inicio.
   * @returns {void}
   */
  resetUsedQuestions(): void {
    this.usedQuestionKeys = [];
  }

  /**
   * Registra una pregunta como utilizada agregándola al registro de preguntas formuladas.
   * @private
   * @param {TriviaQuestion} question - Pregunta a marcar como utilizada.
   * @returns {TriviaQuestion} La pregunta marcada como utilizada sin modificaciones.
   */
  private markQuestionAsUsed(question: TriviaQuestion): TriviaQuestion {
    this.usedQuestionKeys.push(question.question);
    return question;
  }

  /**
   * Mezcla aleatoriamente los elementos de un arreglo mediante el algoritmo de ordenamiento aleatorio.
   * No modifica el arreglo original, retorna una nueva copia mezclada.
   * @private
   * @param {string[]} array - Arreglo de cadenas a mezclar.
   * @returns {string[]} Nuevo arreglo con los elementos aleatoriamente ordenados.
   */
  private shuffleArray(array: string[]): string[] {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }

    return shuffled;
  }

  /**
   * Selecciona un número específico de elementos aleatorios desde un arreglo.
   * No modifica el arreglo original, retorna una nueva copia con los elementos seleccionados.
   * @private
   * @param {any[]} array - Arreglo del cual extraer elementos aleatorios.
   * @param {number} count - Cantidad de elementos a seleccionar.
   * @returns {any[]} Nuevo arreglo con los elementos seleccionados aleatoriamente.
   */
  private getRandomItems(array: any[], count: number): any[] {
    return [...array].sort(() => Math.random() - 0.5).slice(0, count);
  }

  /**
   * Construye un conjunto de opciones únicas para una pregunta de trivia combinando
   * la respuesta correcta con respuestas incorrectas aleatorias.
   * 
   * Garantiza que no haya duplicados y que el tamaño sea exactamente igual al solicitado.
   * Si no hay suficientes respuestas incorrectas únicas, rellena con opciones genéricas.
   * @private
   * @param {string} correctAnswer - Respuesta correcta de la pregunta.
   * @param {string[]} wrongAnswers - Arreglo de respuestas incorrectas para elegir.
   * @param {number} [totalOptions=4] - Número total de opciones requeridas (por defecto 4).
   * @returns {string[]} Arreglo de opciones únicas y aleatoriamente ordenadas.
   */
  private buildUniqueOptions(
    correctAnswer: string,
    wrongAnswers: string[],
    totalOptions: number = 4,
  ): string[] {

    const unique = new Set<string>();

    if (correctAnswer && correctAnswer.trim() !== "") {
      unique.add(correctAnswer.trim());
    }

    for (const answer of wrongAnswers) {

      if (
        answer &&
        answer.trim() !== "" &&
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

  /**
   * Convierte el primer carácter de una cadena a mayúscula.
   * Retorna una cadena vacía si la entrada es nula o indefinida.
   * @private
   * @param {string} text - Texto a capitalizar.
   * @returns {string} Texto con el primer carácter en mayúscula.
   */
  private capitalizeFirst(text: string): string {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Genera una pregunta de trivia desde el conjunto de preguntas de lore predefinidas.
   * 
   * Selecciona aleatoriamente una pregunta que no haya sido utilizada en la sesión actual.
   * Si se agotan todas las preguntas, reinicia el registro y comienza nuevamente.
   * @private
   * @returns {TriviaQuestion} Pregunta de lore seleccionada aleatoriamente y no utilizada.
   */
  private generateLoreQuestion(): TriviaQuestion {

    const availableQuestions = this.loreQuestions.filter(
      (q) => !this.usedQuestionKeys.includes(q.question),
    );

    if (availableQuestions.length === 0) {
      this.resetUsedQuestions();
      return this.generateLoreQuestion();
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);

    const selectedQuestion = availableQuestions[randomIndex];

    return {
      ...selectedQuestion,
      options: this.shuffleArray(selectedQuestion.options),
    };
  }

  /**
   * Genera una pregunta de trivia seleccionando aleatoriamente su tipo y origen.
   * 
   * La distribución es:
   * - 60% de probabilidad: pregunta de lore predefinida
   * - 40% de probabilidad: pregunta dinámica (personajes, planetas o películas de SWAPI)
   * 
   * Realiza hasta 10 intentos para obtener una pregunta no utilizada antes.
   * Si no consigue una pregunta nueva, retorna una de lore como fallback.
   * @async
   * @returns {Promise<TriviaQuestion>} Pregunta de trivia generada y registrada como utilizada.
   */
  async generateQuestion(): Promise<TriviaQuestion> {

    const random = Math.random();

    if (random < 0.6) {
      return this.markQuestionAsUsed(this.generateLoreQuestion());
    }

    const generators = [
      () => this.generatePeopleQuestion(),
      () => this.generatePlanetQuestion(),
      () => this.generateFilmQuestion(),
    ];

    for (let i = 0; i < 10; i++) {

      const randomGenerator =
        generators[Math.floor(Math.random() * generators.length)];

      const question = await randomGenerator();

      if (!this.usedQuestionKeys.includes(question.question)) {
        return this.markQuestionAsUsed(question);
      }
    }

    return this.markQuestionAsUsed(this.generateLoreQuestion());
  }

  /**
   * Genera una pregunta de trivia sobre el planeta natal de un personaje obtenido de la API SWAPI.
   * 
   * Obtiene un personaje aleatorio con planeta conocido, consulta su planeta de origen
   * y construye opciones incorrectas a partir de otros planetas natales de personajes.
   * Las opciones se traducen al español si es necesario.
   * @private
   * @async
   * @returns {Promise<TriviaQuestion>} Pregunta sobre el planeta de un personaje.
   */
  private async generatePeopleQuestion(): Promise<TriviaQuestion> {

    const response = await this.swapiService.getPeople(1);

    const people = response.results.filter(
      (p: any) => p.homeworld
    );

    const person = people[Math.floor(Math.random() * people.length)];

    const correctPlanet =
      await this.swapiService.getByUrl(person.homeworld);

    const wrongPlanets: string[] = [];

    for (const candidate of this.getRandomItems(people, people.length)) {

      if (!candidate.homeworld || candidate.name === person.name) {
        continue;
      }

      const planet =
        await this.swapiService.getByUrl(candidate.homeworld);

      if (planet?.name) {
        wrongPlanets.push(planet.name);
      }

      if (wrongPlanets.length >= 10) {
        break;
      }
    }

    let options = this.buildUniqueOptions(
      correctPlanet.name,
      wrongPlanets,
      4
    );

    while (options.length < 4) {
      options.push(`Opción ${options.length + 1}`);
    }

    options = this.shuffleArray(options).map(
      (option) => this.capitalizeFirst(option)
    );

    return {
      question: `¿De qué planeta es ${person.name}?`,
      options,
      correctAnswer: this.capitalizeFirst(correctPlanet.name),
      category: "Personajes",
    };
  }

  /**
   * Genera una pregunta de trivia sobre el clima de un planeta obtenido de la API SWAPI.
   * 
   * Obtiene un planeta aleatorio con clima conocido, consulta su tipo de clima
   * y construye opciones incorrectas a partir de los climas de otros planetas.
   * Los climas se traducen al español para mayor claridad.
   * @private
   * @async
   * @returns {Promise<TriviaQuestion>} Pregunta sobre el clima de un planeta.
   */
  private async generatePlanetQuestion(): Promise<TriviaQuestion> {

    const response = await this.swapiService.getPlanets(1);

    const planets = response.results.filter(
      (p: any) => p.climate && p.climate !== "unknown"
    );

    const planet =
      planets[Math.floor(Math.random() * planets.length)];

    const wrongAnswers = planets
      .filter((p: any) => p.name !== planet.name)
      .map((p: any) => p.climate);

    const translatedCorrectAnswer =
      await this.translationService.translate(planet.climate);

    const translatedWrongAnswers = await Promise.all(
      wrongAnswers.map(answer =>
        this.translationService.translate(answer)
      )
    );

    let options = this.buildUniqueOptions(
      translatedCorrectAnswer,
      translatedWrongAnswers,
      4
    );

    while (options.length < 4) {
      options.push(`Clima ${options.length + 1}`);
    }

    options = this.shuffleArray(options);

    return {
      question: `¿Cuál es el clima de ${planet.name}?`,
      options,
      correctAnswer: translatedCorrectAnswer,
      category: "Planetas",
    };
  }

  /**
   * Genera una pregunta de trivia sobre el director de una película obtenida de la API SWAPI.
   * 
   * Obtiene una película aleatoria con director conocido y construye opciones incorrectas
   * a partir de los directores de otras películas. Todos los directores se capitalizan
   * para garantizar consistencia en la presentación.
   * @private
   * @async
   * @returns {Promise<TriviaQuestion>} Pregunta sobre el director de una película.
   */
  private async generateFilmQuestion(): Promise<TriviaQuestion> {

    const response = await this.swapiService.getFilms();

    const films = response.results.filter(
      (f: any) => f.director && f.director !== "unknown"
    );

    const film =
      films[Math.floor(Math.random() * films.length)];

    const wrongAnswers = films
      .filter((f: any) => f.title !== film.title)
      .map((f: any) => f.director);

    let options = this.buildUniqueOptions(
      this.capitalizeFirst(film.director),
      wrongAnswers.map(
        (answer) => this.capitalizeFirst(answer)
      ),
      4
    );

    while (options.length < 4) {
      options.push(`Director ${options.length + 1}`);
    }

    options = this.shuffleArray(options);

    return {
      question: `¿Quién dirigió la película "${film.title}"?`,
      options,
      correctAnswer: this.capitalizeFirst(film.director),
      category: "Películas",
    };
  }
}
