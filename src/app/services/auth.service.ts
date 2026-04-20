import { Injectable } from '@angular/core';
import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  confirmSignUp,
  resendSignUpCode
} from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  async register(email: string, password: string) {
    return await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email
        }
      }
    });
  }

  async confirmRegister(email: string, code: string) {
    return await confirmSignUp({
      username: email,
      confirmationCode: code
    });
  }

  async resendCode(email: string) {
    return await resendSignUpCode({
      username: email
    });
  }

  async login(email: string, password: string) {
    return await signIn({
      username: email,
      password
    });
  }

  async logout() {
    return await signOut();
  }

  async getCurrentUser() {
    try {
      return await getCurrentUser();
    } catch {
      return null;
    }
  }

  async getUserEmail(): Promise<string> {
    const user = await this.getCurrentUser();
    return user?.signInDetails?.loginId || '';
  }
}