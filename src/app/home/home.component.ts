import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AddTodoComponent } from '../components/add-todo/add-todo.component';
import { TaskService } from '../services/task/tasks.service';
import { Task } from '../models/definations';
import { CategoriesComponent } from '../components/categories/categories.component';
import { TodolistsComponent } from '../components/todolists/todolists.component';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { Observable, of, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AddTodoComponent,
    CategoriesComponent,
    TodolistsComponent,
    FormsModule,
    NgCircleProgressModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  currentUser: any;
  username = '';
  progress: number = 0; // Set progress value here
  isModalOpen: boolean = false;
  editMode: boolean = false;
  tasks!: Subscription;
  filteredTasks!: Subscription;
  taskList: Task[] = [];
  filteredTaskList: Task[] = [];
  todayTaskList: Task[] = [];
  completedList: Task[] = [];
  selectedTask: Task | null = null;
  selectedCategory: string = 'All';
  selectedPriority: string = 'All';
  searchTerm: string = '';
  priorities = [{ name: 'Normal' }, { name: 'High' }, { name: 'Low' }];

  constructor(
    private taskService: TaskService,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.userService.initUserFromLocalStorage();
    this.currentUser = this.userService.getUser();

    if (this.currentUser) {
      this.username = this.currentUser.name;

      this.tasks = this.taskService
        .fetchAllTask(this.currentUser.uid)
        .subscribe({
          next: (res) => {
            this.taskList = res;
            this.filteredTaskList = [...res];
            this.hasCompletedTasks();
            this.getCompletedPercentage();
          },
          error: (err) => console.error('Error getting real-time tasks:', err),
        });

      console.log('Welcome,', this.currentUser.name);
      console.log(this.currentUser);
    }
  }

  ngOnDestroy(): void {
    if (this.tasks) {
      this.tasks.unsubscribe(); // 🔌 Prevent memory leaks
    }
    if (this.filteredTasks) {
      this.filteredTasks.unsubscribe();
    }
  }

  goToTasks() {
    this.router.navigate(['./tasklists']);
  }

  filterTasksByPriority(priority: string) {
    this.filteredTasks = this.taskService
      .filterTasks(this.currentUser.uid, this.selectedCategory, priority)
      .subscribe({
        next: (res) => {
          this.taskList = res;
          this.filteredTaskList = [...res];
        },
        error: (err) => console.error('Error getting category tasks:', err),
      });

    this.selectedPriority = priority;
    console.log('selectedPriority', this.selectedPriority);
  }

  filterTasksCategory(category: string) {
    this.filteredTasks = this.taskService
      .filterTasks(this.currentUser.uid, category, this.selectedPriority)
      .subscribe({
        next: (res) => {
          this.taskList = res;
          this.filteredTaskList = [...res];
        },
        error: (err) => console.error('Error getting category tasks:', err),
      });

    this.selectedCategory = category;
  }

  searchTasks(searchterm: string) {
    if (searchterm.trim().length > 0) {
      const lowerTerm = searchterm.toLowerCase();
      this.filteredTaskList = this.taskList.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerTerm) ||
          task.description?.toLowerCase().includes(lowerTerm)
      );
    } else {
      this.filteredTaskList = [...this.taskList];
    }
  }

  hasCompletedTasks(): boolean {
    return this.filteredTaskList?.some((task) => task.status === 'completed');
  }

  onToggleComplete(task: Task) {
    let newStatus = '';

    if (task) {
      if (task.status === 'completed') {
        newStatus = 'pending';
      } else {
        newStatus = 'completed';
      }
    }

    this.taskService
      .toggleTaskAsComplete(this.currentUser.uid, task.id, newStatus)
      .then(() => {
        this.hasCompletedTasks();
        this.getCompletedPercentage();
      })
      .catch((err) => console.error('Error:', err));
  }

  getCompletedPercentage(): number {
    const total = this.taskList.length;
    if (total === 0) {
      this.progress = 0;
    }

    const completed = this.taskList.filter(
      (task) => task.status === 'completed'
    ).length;
    this.progress = Math.round((completed / total) * 100);
    return this.progress;
  }

  getRotationValue(): number {
    return (this.progress / 100) * 360; // Convert percentage to degree
  }

  getRightRotation(): number {
    return (this.progress / 100) * 180; // up to 180°
  }

  getLeftRotation(): number {
    return ((this.progress - 50) / 100) * 180; // additional 0°–90°
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    if (this.editMode == true) {
      this.editMode = false;
    }
    this.isModalOpen = false;
    this.selectedTask = null;
  }

  openEditTask(task: Task): void {
    this.isModalOpen = true;
    this.editMode = true;
    this.selectedTask = { ...task };
  }

  deleteTask(taskId: string) {
    this.taskService.deleteTask(this.currentUser.uid, taskId);
  }

  async logout() {
    await this.authService.logout();
    alert('Logged out');
  }
}
