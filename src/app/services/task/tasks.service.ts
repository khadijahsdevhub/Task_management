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

  fetchTodayTasks(uid: string): Observable<Task[]> {
    return new Observable<Task[]>((subscriber) => {
      const taskColRef = this.getUserTasksCollection(uid);

      // Define today's range
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const endOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      const todayQuery = query(
        taskColRef,
        where('dueDate', '>=', startOfToday),
        where('dueDate', '<', endOfToday),
        orderBy('dueDate', 'asc')
      );

      const unsubscribe = onSnapshot(
        todayQuery,
        (snapshot) => {
          const tasks: Task[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as Task),
            id: doc.id,
          }));
          subscriber.next(tasks);
        },
        (error) => {
          subscriber.error(error);
        }
      );

      return () => unsubscribe(); // Cleanup
    });
  }

  filterTodaysTasks(
    uid: string,
    category: string,
    priority: string
  ): Observable<Task[]> {
    return new Observable<Task[]>((subscriber) => {
      const taskColRef = this.getUserTasksCollection(uid);

      // Define today's range
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const endOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      const constraints: QueryConstraint[] = [];

      if (category !== 'All') {
        constraints.push(where('category', '==', category));
      }

      if (priority !== 'All') {
        constraints.push(where('priority', '==', priority));
      }

      constraints.push(where('dueDate', '>=', startOfToday));
      constraints.push(where('dueDate', '<', endOfToday));
      constraints.push(orderBy('dueDate'));

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
    const taskDocRef = doc(this.firestore, `users/${uid}/tasklists/${taskId}`);

    // Combine existing task with updates to evaluate the new status
    const existingSnap = await getDoc(taskDocRef);
    if (!existingSnap.exists()) return;

    const existingData = existingSnap.data() as Task;
    const updatedTask: Task = { ...existingData, ...updates };

    // Check if it should no longer be expired
    const isNowExpired = this.isTaskExpired(updatedTask);
    const newStatus =
      updatedTask.status === 'completed'
        ? 'completed'
        : isNowExpired
        ? 'expired'
        : 'pending';

    await updateDoc(taskDocRef, {
      ...updates,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date() : null,
    });
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

  toggleViewDetails(uid: string, taskId: string, currentViewState: boolean) {
    const taskDocRef = doc(this.firestore, `users/${uid}/tasklists/${taskId}`);
    return updateDoc(taskDocRef, {
      viewDetails: !currentViewState,
    });
  }

  updateTaskStatus(
    uid: string,
    taskId: string,
    status: 'completed' | 'pending' | 'expired'
  ) {
    const taskDocRef = doc(this.firestore, `users/${uid}/tasklists/${taskId}`);
    return updateDoc(taskDocRef, {
      status,
      completedAt: status === 'completed' ? new Date() : null,
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
        async (snapshot) => {
          const tasks: Task[] = [];

          for (const docSnap of snapshot.docs) {
            const task = { ...(docSnap.data() as Task), id: docSnap.id };

            const isExpired = this.isTaskExpired(task);

            if (isExpired) {
              if (task.status !== 'expired') {
                await this.updateTaskStatus(uid, task.id, 'expired');
                task.status = 'expired'; // update local copy too
              }
              tasks.push(task);
            }
          }

          subscriber.next(tasks); // ✅ emit result
        },
        (error) => {
          subscriber.error(error);
        }
      );

      return () => unsubscribe(); // cleanup
    });
  }

  private isTaskExpired(task: Task): boolean {
    if (!task.dueDate) return false;

    const now = new Date();

    let due = task.dueDate;
    if ((due as any)?.toDate) {
      due = (due as any).toDate(); // Convert Firestore Timestamp
    } else {
      due = new Date(due); // Convert string/number to Date
    }

    // If no time set, expire at start of next day
    if (!task.dueTime) {
      due.setHours(23, 59, 59, 999); // End of due date
    } else {
      const [hours, minutes] = task.dueTime.split(':').map(Number);
      due.setHours(hours);
      due.setMinutes(minutes);
      due.setSeconds(0);
      due.setMilliseconds(0);
    }

    return now > due;
  }
}
