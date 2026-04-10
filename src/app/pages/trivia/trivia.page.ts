import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { TriviaService, TriviaQuestion } from '../../services/trivia.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.page.html',
  styleUrls: ['./trivia.page.scss']
})
export class TriviaPage implements OnInit {
  currentQuestion!: TriviaQuestion;
  score = 0;
  questionNumber = 1;
  totalQuestions = 15;
  correctCount = 0;
  answered = false;
  selectedAnswer = '';
  feedback = '';
  loading = true;
  gameFinished = false;

  constructor(
    private triviaService: TriviaService,
    private storageService: StorageService,
    private router: Router
  ) {}

  async ngOnInit() {
  this.triviaService.resetUsedQuestions();
  await this.loadQuestion();
}

  async loadQuestion() {
    this.loading = true;
    this.answered = false;
    this.selectedAnswer = '';
    this.feedback = '';
    this.currentQuestion = await this.triviaService.generateQuestion();
    this.loading = false;
  }

  async answer(option: string) {
    if (this.answered) return;

    this.answered = true;
    this.selectedAnswer = option;

    if (option === this.currentQuestion.correctAnswer) {
      this.score += 100;
      this.correctCount += 1;
      this.feedback = '¡Correcto, joven padawan!';
    } else {
      this.feedback = `Incorrecto. La respuesta era: ${this.currentQuestion.correctAnswer}`;

      const profile = this.storageService.getProfile();
      if (profile.vibrateOnError) {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      }
    }
  }

  async nextQuestion() {
    if (this.questionNumber >= this.totalQuestions) {
      this.finishGame();
      return;
    }

    this.questionNumber++;
    await this.loadQuestion();
  }

  finishGame() {
    this.gameFinished = true;

    const profile = this.storageService.getProfile();
    const displayName = profile.displayName || 'Jugador';

    this.storageService.addHistory({
      date: new Date().toLocaleString(),
      score: this.score,
      correctAnswers: this.correctCount,
      totalQuestions: this.totalQuestions
    });

    this.storageService.addRankingItem({
      name: displayName,
      score: this.score
    });

    this.storageService.updateStats(this.score, this.correctCount);
  }

  goHome() {
    this.router.navigateByUrl('/home');
  }

  async playAgain() {
  this.score = 0;
  this.questionNumber = 1;
  this.correctCount = 0;
  this.gameFinished = false;
  this.triviaService.resetUsedQuestions();
  await this.loadQuestion();
}

  get progressValue(): number {
    return this.questionNumber / this.totalQuestions;
  }
}
