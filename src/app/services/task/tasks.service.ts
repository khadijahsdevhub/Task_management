import { Injectable } from '@angular/core';
import { Task } from '../../models/definations';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TasksService {

  private tasks: Task[] = this.getTasks(); 
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);
  tasks$ = this.tasksSubject.asObservable(); // Observable for UI updates
  private storageKey = 'tasks'; // Local storage key

  constructor() {
    this.loadTasksFromLocalStorage(); // Load tasks on service initialization
   }

 // Generate unique ID
 private generateUniqueId(): string {
  return crypto.randomUUID(); // Generates a unique ID
}

private loadTasksFromLocalStorage(): void {
  if (typeof localStorage !== 'undefined') {
  const storedTasks = localStorage.getItem(this.storageKey);
  this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
  this.tasksSubject.next(this.tasks); // Emit loaded tasks
}
}

  // Get tasks from localStorage
  getTasks(): any[] {
    if (typeof localStorage !== 'undefined') {
      const storedTasks = localStorage.getItem(this.storageKey);
      return storedTasks ? JSON.parse(storedTasks) : [];
    }
    return []; // Return an empty array if localStorage is unavailable
  }

 // Get only completed tasks
 getCompletedTasks(tasklist:Task[]): Task[] {
  return tasklist?.filter(task => task.isCompleted);
}

// Get only active (incomplete) tasks
getActiveTasks(tasklist:Task[]): Task[] {
  return tasklist.filter(task => !task.isCompleted);
}

  // Save tasks to localStorage
  saveTasksToLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      this.tasksSubject.next(this.tasks); // Emit new state
    }
  }

  // Add a new task
  addTask(taskInput: Task): void {
    const newTask: Task = {
      id: this.generateUniqueId(),
      title: taskInput.title || '',
      description: taskInput.description || '',
      category: taskInput.category || 'Personal',
      priority: taskInput.priority || 'Normal',
      dueDate: taskInput.dueDate ?? new Date(),
      dueTime: taskInput.dueTime ?? null,
      isCompleted: false,
      viewDetails: false,
      createdAt: new Date(),
      completedAt: null
    };
    this.tasks.push(newTask);
    this.saveTasksToLocalStorage();
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
      this.saveTasksToLocalStorage();
      this.loadTasksFromLocalStorage(); 
    }
  }
  
   // Edit a task
  updateTask(taskId: string, updatedFields: Partial<Task>): void {
    const index = this.tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      this.tasks[index] = { ...this.tasks[index], ...updatedFields };
      this.saveTasksToLocalStorage();
    }
  }

  filterTasksByCategory(category: string): Task[] {
    if (!category || category === 'All') {
      return this.tasks; // Return all tasks if no filter is applied
    }
    return this.tasks.filter(task => task.category === category);
  }


  // Delete a task
  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasksToLocalStorage();
  }
    
}
