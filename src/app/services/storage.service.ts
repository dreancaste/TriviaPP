import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private PROFILE_KEY = 'sw_profile';
  private HISTORY_KEY = 'sw_history';
  private RANKING_KEY = 'sw_ranking';
  private STATS_KEY = 'sw_stats';

  saveProfile(profile: any): void {
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
  }

  getProfile(): any {
    const data = localStorage.getItem(this.PROFILE_KEY);
    return data ? JSON.parse(data) : {
      displayName: '',
      avatar: '',
      vibrateOnError: true
    };
  }

  getHistory(): any[] {
    const data = localStorage.getItem(this.HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  }

  addHistory(item: any): void {
    const history = this.getHistory();
    history.unshift(item);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
  }

  getRanking(): any[] {
    const data = localStorage.getItem(this.RANKING_KEY);
    return data ? JSON.parse(data) : [];
  }

  addRankingItem(item: any): void {
    const ranking = this.getRanking();
    ranking.push(item);
    ranking.sort((a, b) => b.score - a.score);
    localStorage.setItem(this.RANKING_KEY, JSON.stringify(ranking.slice(0, 20)));
  }

  getStats(): any {
    const data = localStorage.getItem(this.STATS_KEY);
    return data ? JSON.parse(data) : {
      gamesPlayed: 0,
      correctAnswers: 0,
      maxScore: 0
    };
  }

  updateStats(score: number, correctCount: number): void {
    const stats = this.getStats();
    stats.gamesPlayed += 1;
    stats.correctAnswers += correctCount;

    if (score > stats.maxScore) {
      stats.maxScore = score;
    }

    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  }
}
