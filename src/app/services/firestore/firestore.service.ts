import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { Task } from '../../models/definations';
import { v4 as uuidv4 } from 'uuid'; 

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  async createUserWithTasklist(uid: string, email: string) {
    const userRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userRef, {
      email,
      createdAt: new Date()
    });

    const defaultTask: Task = {
      id: uuidv4(),
      title: 'Welcome to Task Manager!',
      isCompleted: false,
      viewDetails: false,
      createdAt: new Date(),
      completedAt: null
    };

    const taskListRef = collection(this.firestore, 'tasklists');
    await addDoc(taskListRef, {
      userId: uid,
      title: 'My First Task List',
      tasks: [defaultTask],
      createdAt: new Date()
    });
  }

}
