import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  query,
  where,
  getDoc
} from '@angular/fire/firestore';
import { Task } from '../../models/definations'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks:Task[] = []

  constructor(private firestore: Firestore) {}

  private getUserTasksCollection(uid: string): CollectionReference {
    return collection(this.firestore, `users/${uid}/tasklists`) as CollectionReference;
  }


  async getTasks(uid: string): Promise<Task[]> {
    const taskCol = this.getUserTasksCollection(uid);
    const snapshot = await getDocs(taskCol);
    return snapshot.docs.map(doc => ({
      ...(doc.data() as Task),
      id: doc.id,
    }));
  }

  // getTasks(uid: string): Observable<Task[]> {
  //   const taskCol = this.getUserTasksCollection(uid);
  //   return collectionData(taskCol, { idField: 'id' }) as Observable<Task[]>;
  // }

  // getTasks(uid: string): Observable<Task[]> {
  //   const taskColRef = this.getUserTasksCollection(uid);
  //   const taskQuery = query(taskColRef, where('uid', '==', uid));
  //   return collectionData(taskQuery, { idField: 'id' }) as Observable<Task[]>;
  // }
  


  async addTask(uid: string, task: Omit<Task, 'id' | 'createdAt' | 'completedAt'>): Promise<void> {
    const taskCol = this.getUserTasksCollection(uid);
    await addDoc(taskCol, {
      ...task,
      createdAt: new Date(),
      isCompleted: false,
      completedAt: null,
      viewDetails: false
    });
  }
  

     // Edit a task
     updateTask(taskId: string, updatedFields: Partial<Task>): void {
      const index = this.tasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updatedFields };
        //this.saveTasksToLocalStorage();
      }
    }

  // async updateTask(uid: string, taskId: string, updates: Partial<Task>): Promise<void> {
  //   const taskDoc = doc(this.firestore, `users/${uid}/tasklists/${taskId}`);
  //   await updateDoc(taskDoc, updates);
  // }

  async deleteTask(uid: string, taskId: string): Promise<void> {
    const taskDoc = doc(this.firestore, `users/${uid}/tasklists/${taskId}`);
    await deleteDoc(taskDoc);
  }

  async getTaskById(uid: string, taskId: string): Promise<Task | null> {
    const taskDoc = doc(this.firestore, `users/${uid}/tasklists/${taskId}`);
    const snapshot = await getDoc(taskDoc);
    if (snapshot.exists()) {
      return {
        ...(snapshot.data() as Task),
        id: snapshot.id
      };
    }
    return null;
  }


  filterTasksByCategory(category: string): Task[] {
    if (!category || category === 'All') {
      return this.tasks; // Return all tasks if no filter is applied
    }
    return this.tasks.filter(task => task.category === category);
  }

  toggleTaskAsComplete(taskId: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      if(task.isCompleted){
        task.isCompleted = false;
        task.completedAt = null
      }else{
        task.isCompleted = true;  
      task.completedAt = new Date();
      }
      console.log("Completed:" + task.isCompleted)
     // this.saveTasksToLocalStorage();
      //this.loadTasksFromLocalStorage(); 
    }
  }

}
