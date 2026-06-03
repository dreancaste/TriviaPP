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

/**
 * Servicio que gestiona la persistencia y recuperación del ranking de jugadores en Firebase Firestore.
 * 
 * Almacena puntuaciones con información de fecha para proporcionar un ranking diario.
 * Recupera únicamente las puntuaciones registradas el día actual.
 * 
 * @injectable
 */
@Injectable({
  providedIn: 'root'
})
export class RankingService {

  /**
   * Instancia de la aplicación Firebase.
   * Se inicializa si no existe una aplicación previa, o se obtiene la existente.
   * @private
   * @type {any}
   */
  private app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

  /**
   * Instancia de Firestore para acceder a la base de datos en tiempo real.
   * @private
   * @type {any}
   */
  private db = getFirestore(this.app);

  /**
   * Agrega una nueva puntuación al ranking en la colección de Firestore.
   * 
   * La puntuación se registra con la fecha actual en formato ISO (YYYY-MM-DD).
   * @async
   * @param {string} name - Nombre del jugador.
   * @param {number} score - Puntuación obtenida.
   * @returns {Promise<void>} Promesa que se resuelve cuando la puntuación se agrega exitosamente.
   */
  async addScore(name: string, score: number) {

    const today = new Date().toISOString().split('T')[0];

    await addDoc(collection(this.db, 'ranking'), {
      name,
      score,
      date: today
    });
  }

  /**
   * Recupera el ranking de jugadores correspondiente al día actual.
   * 
   * Consulta Firestore para obtener todos los documentos del ranking ordenados
   * descendentemente por puntuación, luego filtra solo los registros de hoy.
   * @async
   * @returns {Promise<any[]>} Arreglo de elementos del ranking del día actual, ordenados de mayor a menor puntuación.
   */
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