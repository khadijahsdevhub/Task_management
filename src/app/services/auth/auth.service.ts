import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore,doc, getDoc, setDoc, collection, addDoc  } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FirestoreService } from '../firestore/firestore.service';
import { UserService } from '../user/user.service';
import { User } from '../../models/definations';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, 
    private firestore: Firestore, 
     private router: Router, private userService: UserService) {}

  // async login(email: string, password: string) {
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
  //     this.router.navigate(['/home']); // Redirect to home page on success
  //     return userCredential.user;
  //   } catch (error: any) {
  //     return this.handleAuthError(error);
  //   }
  // }

 // async register(email: string, password: string) {
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
  //     this.router.navigate(['/auth/login']); // Redirect to home page on success
  //     return userCredential.user;
  //   } catch (error: any) {
  //     return this.handleAuthError(error);
  //   }
  // }

  
  async login (email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      // Fetch user data from Firestore
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userSnapshot = await getDoc(userDocRef);

      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as User;
        this.userService.setUser(userData); // 👈 Store in service
        localStorage.setItem('userData', JSON.stringify(userData)); // optional, for persistence
      }
      
      this.router.navigate(['/home']); // Redirect to home page after login
      return true;

    } catch (error) {
     // throw error;
     return this.handleAuthError(error);
    }
  }

 

  async register(email: string, password: string, name: string) {
    try{
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const uid = userCredential.user.uid;
  
    // Save extra user info
    await setDoc(doc(this.firestore, 'users', uid), {
      uid,
      email,
      name,
      createdAt: new Date()
    });
    
    // Create welcome task
    const taskRef = collection(this.firestore, `users/${uid}/tasklists`);
    await addDoc(taskRef, {
      id: uid,
      title: 'Welcome!',
      description: 'This is your first task.',
      category: 'miscellenous',
      priority: 'low',
      dueDate: null,
      dueTime: null,
      isCompleted: false,
      viewDetails: false,
      createdAt: new Date(),
      completedAt: null,
    });
    

    this.router.navigate(['/auth/login']); // Redirect to login page on success
    return userCredential;       
     
  } catch(error: any) {
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
