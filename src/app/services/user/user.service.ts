import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { User } from '../../models/definations';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private firestore: Firestore) {}

  // Call this in your app.component.ts or home.component.ts ngOnInit
  initUserFromLocalStorage(): void {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const user = JSON.parse(storedData) as User;
        this.userSubject.next(user);
      }
    }
  }

  setUser(user: User) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userData', JSON.stringify(user));
    }
    this.userSubject.next(user);
  }

  getUser(): User | null {
    return this.userSubject.getValue();
  }

  async fetchUserData(uid: string): Promise<User | null> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data() as User;
      this.setUser(userData);
      return userData;
    }
    return null;
  }
}
