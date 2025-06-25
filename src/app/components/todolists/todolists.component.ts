import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Categories, Task } from '../../models/definations';
import { CommonModule } from '@angular/common';
import { categories } from '../../models/data';
import { TaskService } from '../../services/task/tasks.service';
import { TimestampToDatePipe } from '../../pipes/timestamp-to-date.pipe';
import { UserService } from '../../services/user/user.service';
import { SentenceCasePipe } from '../../pipes/sentence/sentence-case.pipe';

@Component({
  selector: 'app-todolists',
  standalone: true,
  imports: [CommonModule, TimestampToDatePipe, SentenceCasePipe],
  templateUrl: './todolists.component.html',
  styleUrl: './todolists.component.scss',
})
export class TodolistsComponent {
  showTaskDetails = false;
  categories: Categories[] = categories;
  currentUser: any;

  @Input() taskLists: Task[] = [];
  @Input() hasCompletedTask: boolean = false;
  @Output() editTask = new EventEmitter<Task>();
  @Output() toggleComplete = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.userService.initUserFromLocalStorage();
    this.currentUser = this.userService.getUser();
  }

  toggleTaskDetails(taskId: string) {
    this.taskLists.forEach((t) => {
      if (t.id == taskId) {
        t.viewDetails = !t.viewDetails;
      }
    });
  }

  checkCategory(category: string | undefined): string {
    const foundCategory = this.categories.find(
      (c) => c.name.toLowerCase() === category?.toLowerCase()
    );
    return foundCategory ? foundCategory.icon : 'fa-circle'; // Default icon if not found
  }

  getPriorityIcon(priority: string | undefined): string {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'fa-solid fa-triangle-exclamation text-danger'; // Red warning icon for High
      case 'low':
        return 'fa-solid fa-exclamation-circle text-warning'; // Yellow icon for Medium
      case 'normal':
        return 'fa-solid fa-check-circle text-success';
      default:
        return '';
    }
  }

  taskEdit(task: Task) {
    this.editTask.emit(task);
  }

  taskDelete(taskId: string) {
    this.deleteTask.emit(taskId);
  }

  onToggleComplete(task: Task) {
    this.toggleComplete.emit(task);
  }
}
