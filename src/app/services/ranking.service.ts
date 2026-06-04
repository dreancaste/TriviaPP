import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  runTransaction,
  serverTimestamp,
  where
} from 'firebase/firestore';
import {
  getApp,
  getApps,
  initializeApp
} from 'firebase/app';
import { RankingItem } from '../models/ranking-item.model';
import { firebaseConfig } from '../../firebase.config';
import { AuthService } from './auth.service';

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

  constructor(private authService: AuthService) {}

  async addScore(name: string, score: number): Promise<void> {
    const accountId = this.authService.userStorageScope;
    const date = this.getRankingDate();
    const rankingDocument = doc(
      this.db,
      'ranking',
      `${date}_${encodeURIComponent(accountId)}`
    );

    await runTransaction(this.db, async (transaction) => {
      const current = await transaction.get(rankingDocument);
      const currentScore = current.exists()
        ? Number(current.data()['score'] || 0)
        : -1;

      if (score <= currentScore) {
        return;
      }

      transaction.set(rankingDocument, {
        accountId,
        name,
        score,
        date,
        updatedAt: serverTimestamp()
      });
    });
  }

  async getDailyRanking(): Promise<RankingItem[]> {
    const dailyRankingQuery = query(
      collection(this.db, 'ranking'),
      where('date', '==', this.getRankingDate())
    );

    const snapshot = await getDocs(dailyRankingQuery);

    const bestByAccount = new Map<string, RankingItem>();
    const legacyBestByName = new Map<string, RankingItem>();

    for (const document of snapshot.docs) {
      const item = document.data() as RankingItem;
      if (item.accountId) {
        const current = bestByAccount.get(item.accountId);

        if (!current || item.score > current.score) {
          bestByAccount.set(item.accountId, item);
        }
        continue;
      }

      const legacyName = item.name?.trim().toLowerCase() || document.id;
      const legacyCurrent = legacyBestByName.get(legacyName);

      if (!legacyCurrent || item.score > legacyCurrent.score) {
        legacyBestByName.set(legacyName, item);
      }
    }

    const accountNames = new Set(
      Array.from(bestByAccount.values())
        .map((item) => item.name?.trim().toLowerCase())
        .filter(Boolean)
    );

    const legacyItems = Array.from(legacyBestByName.entries())
      .filter(([name]) => !accountNames.has(name))
      .map(([, item]) => item);

    return [...bestByAccount.values(), ...legacyItems]
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
