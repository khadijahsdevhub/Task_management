import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private router: Router) {}

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/home']); // Redirect to home page on success
      return userCredential.user;
    } catch (error: any) {
      return this.handleAuthError(error);
    }
  }

  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/auth/login']); // Redirect to home page on success
      return userCredential.user;
    } catch (error: any) {
      return this.handleAuthError(error);
    }
  }

  private handleAuthError(error: any) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'User not found. Please sign up first.';
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'Email is already registered. Please log in.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      default:
        return 'An error occurred. Please try again.';
    }

  }

  async logout() {
    return await signOut(this.auth);
  }


}
