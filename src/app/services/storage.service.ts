import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';
import { RankingItem } from '../models/ranking-item.model';
import { HistoryItem } from '../models/history-item.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private PROFILE_KEY = 'sw_profile';
  private HISTORY_KEY = 'sw_history';
  private RANKING_KEY = 'sw_ranking';
  private STATS_KEY = 'sw_stats';
  private RANKING_RESET_KEY = 'sw_ranking_reset_time';

  saveProfile(profile: Profile): void {
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
  }

  getProfile(): Profile {
    const data = localStorage.getItem(this.PROFILE_KEY);
    return data ? JSON.parse(data) : {
      displayName: '',
      avatar: '',
      vibrateOnError: true
    };
  }

  saveHistory(history: HistoryItem[]): void {
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
  }

  getHistory(): HistoryItem[] {
    const data = localStorage.getItem(this.HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  }

  addHistory(item: HistoryItem): void {
    const history = this.getHistory();
    history.unshift(item);
    this.saveHistory(history);
  }

  saveRanking(ranking: RankingItem[]): void {
    localStorage.setItem(this.RANKING_KEY, JSON.stringify(ranking));
  }

  private checkAndResetRanking(): void {
    const lastReset = localStorage.getItem(this.RANKING_RESET_KEY);
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (!lastReset) {
      localStorage.setItem(this.RANKING_RESET_KEY, now.toString());
      return;
    }

    const lastResetTime = Number(lastReset);

    if (now - lastResetTime >= twentyFourHours) {
      localStorage.removeItem(this.RANKING_KEY);
      localStorage.setItem(this.RANKING_RESET_KEY, now.toString());
    }
  }

  getRanking(): RankingItem[] {
    this.checkAndResetRanking();
    const data = localStorage.getItem(this.RANKING_KEY);
    return data ? JSON.parse(data) : [];
  }

  addRankingItem(item: RankingItem): void {
    this.checkAndResetRanking();

    const ranking = this.getRanking();

    const existingIndex = ranking.findIndex(
      (r: RankingItem) => r.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
    );

    if (existingIndex !== -1) {
      if (item.score > ranking[existingIndex].score) {
        ranking[existingIndex] = item;
      }
    } else {
      ranking.push(item);
    }

    ranking.sort((a: RankingItem, b: RankingItem) => b.score - a.score);
    localStorage.setItem(this.RANKING_KEY, JSON.stringify(ranking.slice(0, 20)));
  }

  clearRanking(): void {
    localStorage.removeItem(this.RANKING_KEY);
  }

  saveStats(stats: any): void {
    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
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

    this.saveStats(stats);
  }
}