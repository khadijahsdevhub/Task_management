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
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
  QueryConstraint,
} from '@angular/fire/firestore';
import { Task } from '../../models/definations';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tasks: Task[] = [];

  constructor(private firestore: Firestore) {}

  private getUserTasksCollection(uid: string): CollectionReference {
    return collection(
      this.firestore,
      `users/${uid}/tasklists`
    ) as CollectionReference;
  }

  fetchAllTask(uid: string): Observable<Task[]> {
    return new Observable<Task[]>((subscriber) => {
      const taskColRef = this.getUserTasksCollection(uid);
      const taskColRefQuery = query(taskColRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        taskColRefQuery,
        (querySnapshot) => {
          const tasks: Task[] = querySnapshot.docs.map((doc) => ({
            ...(doc.data() as Task),
            id: doc.id,
          }));
          subscriber.next(tasks);
        },
        (error) => {
          subscriber.error(error);
        }
      );

      // 🔌 Cleanup when unsubscribed
      return () => unsubscribe();
    });
  }

  filterTasks(
    uid: string,
    category: string,
    priority: string
  ): Observable<Task[]> {
    return new Observable<Task[]>((subscriber) => {
      const taskColRef = this.getUserTasksCollection(uid);
      const constraints: QueryConstraint[] = [];

      if (category !== 'All') {
        constraints.push(where('category', '==', category));
      }

      if (priority !== 'All') {
        constraints.push(where('priority', '==', priority));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      const filteredQuery = query(taskColRef, ...constraints);

      const unsubscribe = onSnapshot(
        filteredQuery,
        (querySnapshot) => {
          const tasks: Task[] = querySnapshot.docs.map((doc) => ({
            ...(doc.data() as Task),
            id: doc.id,
          }));
          subscriber.next(tasks);
        },
        (error) => {
          subscriber.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  async addTask(
    uid: string,
    task: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'status'>
  ): Promise<void> {
    const taskCol = this.getUserTasksCollection(uid);
    await addDoc(taskCol, {
      ...task,
      createdAt: new Date(),
      status: 'pending',
      completedAt: null,
      viewDetails: false,
    });
  }

  async updateTask(
    uid: string,
    taskId: string,
    updates: Partial<Task>
  ): Promise<void> {
    const taskDoc = doc(this.firestore, `users/${uid}/tasklists/${taskId}`);
    await updateDoc(taskDoc, updates);
  }

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
        id: snapshot.id,
      };
    }

    return null;
  }

  toggleTaskAsComplete(uid: string, taskId: string, newStatus: string) {
    const taskDocRef = doc(this.firestore, `users/${uid}/tasklists/${taskId}`);
    return updateDoc(taskDocRef, {
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date() : null,
    });
  }

  fetchExpiredTasks(uid: string): Observable<Task[]> {
    const taskColRef = this.getUserTasksCollection(uid);
    const now = new Date();

    const expiredQuery = query(
      taskColRef,
      where('status', '!=', 'completed'),
      where('dueDate', '<', now)
    );

    return new Observable<Task[]>((subscriber) => {
      const unsubscribe = onSnapshot(
        expiredQuery,
        (snapshot) => {
          const tasks = snapshot.docs.map((doc) => ({
            ...(doc.data() as Task),
            id: doc.id,
          }));
          subscriber.next(tasks);
        },
        (error) => {
          subscriber.error(error);
        }
      );

      return () => unsubscribe();
    });
  }
}
