import { Injectable } from "@angular/core";

import { signUp, signIn, signOut, confirmSignUp, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  
  private currentEmail: string = "";

  constructor() {}

  async register(email: string, password: string) {
    return signUp({ username: email, password });
  }

  async confirmarRegistro(email: string, codigo: string) {
    return confirmSignUp({ username: email, confirmationCode: codigo });
  }

  // Mantenemos el nombre. Guardamos el mail temporalmente en memoria al loguear.
  async login(email: string, password: string) {
    const response = await signIn({ username: email, password });
    if (response.isSignedIn) {
      this.currentEmail = email; 
    }
    return response;
  }

  async logout() {
    this.currentEmail = "";
    return signOut();
  }

  async getCurrentUser(): Promise<any | null> {
    try {
      const user = await getCurrentUser();
      this.currentEmail = user.signInDetails?.loginId || ""; 
      return user;
    } catch (error) {
      this.currentEmail = "";
      return null; 
    }
  }

  get userEmail(): string {
    return this.currentEmail;
  }

  async obtenerTokenJWT() {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString() || null;
    } catch (error) {
      return null;
    }
  }
}