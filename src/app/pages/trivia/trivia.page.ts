import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Haptics } from "@capacitor/haptics";
import { TriviaService } from "../../services/trivia.service";
import { StorageService } from "../../services/storage.service";
import { TriviaQuestion } from "../../models/trivia-question.model";
import { HistoryItem } from "../../models/history-item.model";
import { RankingService } from '../../services/ranking.service';

/**
 * Página de juego de trivia donde el usuario responde preguntas de Star Wars.
 * 
 * Gestiona una sesión de 10 preguntas, realiza seguimiento de la puntuación,
 * y persiste los resultados en almacenamiento local aislado por usuario.
 * Proporciona retroalimentación inmediata y genera vibración háptica en respuestas incorrectas.
 * 
 * **Servicios consumidos:**
 * - TriviaService: Para generar y gestionar preguntas.
 * - StorageService: Para guardar historial, ranking local y estadísticas.
 * - RankingService: Para guardar puntuaciones en el ranking diario local.
 * - Router: Para navegación.
 * - Haptics: Para retroalimentación háptica (vibración).
 * 
 * **Acciones disponibles para el usuario:**
 * - Responder preguntas de trivia seleccionando una opción
 * - Ver retroalimentación inmediata sobre acierto o error
 * - Avanzar a la siguiente pregunta
 * - Ver puntuación acumulada y progreso
 * - Finalizar la partida y guardar resultados
 * - Jugar nuevamente desde el menú de fin de juego
 * - Retornar a la página de inicio
 * 
 * @component
 * @implements {OnInit}
 */
@Component({
  selector: "app-trivia",
  templateUrl: "./trivia.page.html",
  styleUrls: ["./trivia.page.scss"],
})
export class TriviaPage implements OnInit {
  /**
   * Pregunta actual que se está presentando al usuario.
   * @type {TriviaQuestion}
   */
  currentQuestion!: TriviaQuestion;

  /**
   * Puntuación acumulada en la sesión actual.
   * Se incrementa en 100 puntos por cada respuesta correcta.
   * @type {number}
   */
  score = 0;

  /**
   * Número de la pregunta actual (de 1 a totalQuestions).
   * @type {number}
   */
  questionNumber = 1;

  /**
   * Total de preguntas en una sesión de juego.
   * @type {number}
   */
  totalQuestions = 10;

  /**
   * Contador de respuestas correctas en la sesión actual.
   * @type {number}
   */
  correctCount = 0;

  /**
   * Indica si el usuario ya ha respondido a la pregunta actual.
   * Evita múltiples respuestas a la misma pregunta.
   * @type {boolean}
   */
  answered = false;

  /**
   * Opción seleccionada por el usuario en la respuesta actual.
   * @type {string}
   */
  selectedAnswer = "";

  /**
   * Mensaje de retroalimentación mostrado después de responder (correcto/incorrecto).
   * @type {string}
   */
  feedback = "";

  /**
   * Indica si se está cargando la pregunta actual (estado de carga).
   * @type {boolean}
   */
  loading = true;
  error = "";

  /**
   * Indica si se ha completado la sesión de trivia (10 preguntas respondidas).
   * @type {boolean}
   */
  gameFinished = false;

  constructor(
    private triviaService: TriviaService,
    private storageService: StorageService,
    private rankingService: RankingService,
    private router: Router,
  ) {}

  /**
   * Inicializa la página reseteando preguntas usadas y cargando la primera pregunta.
   * @async
   * @returns {Promise<void>}
   */
  async ngOnInit() {
    this.triviaService.resetUsedQuestions();
    await this.loadQuestion();
  }

  /**
   * Carga una nueva pregunta desde el servicio de trivia.
   * 
   * Reinicia los estados de respuesta y retroalimentación para la nueva pregunta.
   * @async
   * @returns {Promise<void>}
   * @private
   */
  async loadQuestion() {
    this.loading = true;
    this.error = "";
    this.answered = false;
    this.selectedAnswer = "";
    this.feedback = "";
    try {
      this.currentQuestion = await this.triviaService.generateQuestion();
    } catch {
      this.error = "No pudimos cargar una pregunta. Revisá tu conexión e intentá nuevamente.";
    } finally {
      this.loading = false;
    }
  }

  /**
   * Procesa la respuesta seleccionada por el usuario.
   * 
   * Valida si la respuesta es correcta, actualiza la puntuación,
   * muestra retroalimentación y activa vibración si es incorrecta y está habilitada.
   * Previene múltiples respuestas a la misma pregunta.
   * @async
   * @param {string} option - Opción seleccionada por el usuario.
   * @returns {Promise<void>}
   */
  async answer(option: string) {
    if (this.answered) return;

    this.answered = true;
    this.selectedAnswer = option;

    if (option === this.currentQuestion.correctAnswer) {
      this.score += 100;
      this.correctCount += 1;
      this.feedback = "¡Correcto, joven padawan!";
    } else {
      this.feedback = `Incorrecto. La respuesta era: ${this.currentQuestion.correctAnswer}`;

      const profile = this.storageService.getProfile();
      if (profile.vibrateOnError) {
        await Haptics.vibrate({ duration: 300 });
      }
    }
  }

  /**
   * Avanza a la siguiente pregunta o finaliza el juego si se alcanzó el total.
   * 
   * Si se ha respondido todas las preguntas (totalQuestions), invoca finishGame().
   * En caso contrario, incrementa el contador de pregunta y carga la siguiente.
   * @async
   * @returns {Promise<void>}
   */
  async nextQuestion() {
    if (this.questionNumber >= this.totalQuestions) {
      this.finishGame();
      return;
    }

    this.questionNumber++;
    await this.loadQuestion();
  }

  /**
   * Marca el juego como finalizado y guarda los resultados en almacenamiento local.
   * 
   * Persiste:
   * - Historial de la partida (fecha, puntuación, aciertos)
   * - Elemento del ranking local
   * - Estadísticas generales (juegos, aciertos, puntuación máxima)
   * - Puntuación en el ranking diario local
   * 
   * Utiliza el nombre de perfil del usuario o "Jugador" por defecto.
   * @async
   * @returns {Promise<void>}
   * @private
   */
  async finishGame() {
    this.gameFinished = true;

    const profile = this.storageService.getProfile();
    const displayName = profile.displayName || "Jugador";

    const historyItem: HistoryItem = {
      date: new Date().toLocaleString(),
      score: this.score,
      correctAnswers: this.correctCount,
      totalQuestions: this.totalQuestions,
    };

    // Guardar en localStorage
    this.storageService.addHistory(historyItem);
    this.storageService.updateStats(this.score, this.correctCount);

    // Guardar en el ranking diario local
    await this.rankingService.addScore(
      displayName,
      this.score
    );
  }

  /**
   * Navega a la página de inicio.
   * @returns {void}
   */
  goHome() {
    this.router.navigateByUrl("/home");
  }

  /**
   * Reinicia la sesión de trivia para jugar nuevamente.
   * 
   * Reseta todos los contadores, la puntuación, el estado del juego
   * y carga la primera pregunta de una nueva sesión.
   * @async
   * @returns {Promise<void>}
   */
  async playAgain() {
    this.score = 0;
    this.questionNumber = 1;
    this.correctCount = 0;
    this.gameFinished = false;
    this.triviaService.resetUsedQuestions();
    await this.loadQuestion();
  }

  /**
   * Calcula el progreso de la sesión actual como fracción (0 a 1).
   * 
   * Utilizado para mostrar una barra de progreso en la interfaz.
   * @returns {number} Progreso normalizado (questionNumber / totalQuestions).
   */
  get progressValue(): number {
    return this.questionNumber / this.totalQuestions;
  }
}
