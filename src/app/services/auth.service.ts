import { Injectable } from '@angular/core';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { firebaseConfig } from '../../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  private auth = getAuth(this.app);

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        resolve(user);
        unsubscribe();
      });
    });
  }

  get userEmail(): string {
    return this.auth.currentUser?.email || '';
  }
}
