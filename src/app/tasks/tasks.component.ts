import { Component, OnInit } from '@angular/core';
import { CategoriesComponent } from '../components/categories/categories.component';
import { TaskService } from '../services/task/tasks.service';
import { Task } from '../models/definations';
import { TodolistsComponent } from '../components/todolists/todolists.component';
import { AddTodoComponent } from '../components/add-todo/add-todo.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CategoriesComponent,
    TodolistsComponent,
    AddTodoComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  currentUser: any;
  username = '';
  isModalOpen: boolean = false;
  editMode: boolean = false;
  selectedCategory: string = 'All';
  selectedTask: Task | null = null;
  tasks!: Subscription;
  filteredTasks!: Subscription;
  expiredTaskSub!: Subscription;
  taskList: Task[] = [];
  filteredTaskList: Task[] = [];
  expiredTasks: Task[] = [];
  selectedPriority: string = 'All';
  priorities = [{ name: 'Normal' }, { name: 'High' }, { name: 'Low' }];

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private router: Router
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
            this.getExpiredTasks();
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
    if (this.expiredTaskSub) {
      this.expiredTaskSub.unsubscribe();
    }
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

  filterTasksByCategory(category: string) {
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
      })
      .catch((err) => console.error('Error:', err));
  }

  getExpiredTasks() {
    this.expiredTaskSub = this.taskService
      .fetchExpiredTasks(this.currentUser.uid)
      .subscribe({
        next: (tasks) => {
          this.expiredTasks = tasks;
          console.log('Expired tasks:', this.expiredTasks);
        },
        error: (err) => console.error('Error fetching expired tasks:', err),
      });
  }

  toggleTaskDetails(task: Task) {
    this.taskService.toggleViewDetails(
      this.currentUser.uid,
      task.id,
      task.viewDetails
    );
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

  goToHome() {
    this.router.navigate(['./home']);
  }
}
