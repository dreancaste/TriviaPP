import { Injectable } from '@angular/core';

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';

import {
  initializeApp,
  getApps,
  getApp
} from 'firebase/app';

import { firebaseConfig } from '../../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class RankingService {

  private app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

  private db = getFirestore(this.app);

  async addScore(name: string, score: number) {

    const today = new Date().toISOString().split('T')[0];

    await addDoc(collection(this.db, 'ranking'), {
      name,
      score,
      date: today
    });
  }

  async getDailyRanking() {

    const today = new Date().toISOString().split('T')[0];

    const q = query(
      collection(this.db, 'ranking'),
      orderBy('score', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs
      .map(doc => doc.data())
      .filter(item => item['date'] === today);
  }
}