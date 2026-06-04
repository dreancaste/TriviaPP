import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where
} from 'firebase/firestore';
import {
  getApp,
  getApps,
  initializeApp
} from 'firebase/app';
import { RankingItem } from '../models/ranking-item.model';
import { firebaseConfig } from '../../firebase.config';

/**
 * Manages the shared daily ranking in Firebase Firestore.
 */
@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

  private db = getFirestore(this.app);

  async addScore(name: string, score: number): Promise<void> {
    await addDoc(collection(this.db, 'ranking'), {
      name,
      score,
      date: this.getRankingDate()
    });
  }

  async getDailyRanking(): Promise<RankingItem[]> {
    const dailyRankingQuery = query(
      collection(this.db, 'ranking'),
      where('date', '==', this.getRankingDate())
    );

    const snapshot = await getDocs(dailyRankingQuery);

    return snapshot.docs
      .map((document) => document.data() as RankingItem)
      .sort((a, b) => b.score - a.score);
  }

  private getRankingDate(): string {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(new Date());

    const values = Object.fromEntries(
      parts.map((part) => [part.type, part.value])
    );

    return `${values['year']}-${values['month']}-${values['day']}`;
  }
}
