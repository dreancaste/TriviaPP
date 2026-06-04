import { Injectable } from '@angular/core';
import { RankingItem } from '../models/ranking-item.model';
import { StorageService } from './storage.service';

/**
 * Manages the daily ranking locally so unverified client scores are never
 * published to a shared remote database.
 */
@Injectable({
  providedIn: 'root'
})
export class RankingService {
  constructor(private storageService: StorageService) {}

  async addScore(name: string, score: number): Promise<void> {
    this.storageService.addRankingItem({ name, score });
  }

  async getDailyRanking(): Promise<RankingItem[]> {
    return this.storageService.getRanking();
  }
}
