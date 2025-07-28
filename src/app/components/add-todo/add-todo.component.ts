import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Task } from '../../models/definations';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task/tasks.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss',
})
export class AddTodoComponent {
  @Input() taskToEdit: Task | null = null;
  @Input() isEditMode: boolean = false;
  @Output() closemodal = new EventEmitter<void>();

  addTaskForm: FormGroup;

  priorities = [{ name: 'Normal' }, { name: 'High' }, { name: 'Low' }];

  categories = [
    { name: 'Work', icon: 'fas fa-briefcase' },
    { name: 'Personal', icon: 'fas fa-user' },
    { name: 'Health', icon: 'fas fa-heartbeat' },
    { name: 'Study', icon: 'fas fa-book' },
    { name: 'Shopping', icon: 'fas fa-shopping-cart' },
    { name: 'Events', icon: 'fas fa-calendar-alt' },
    { name: 'Finance', icon: 'fas fa-dollar-sign' },
    { name: 'Travel', icon: 'fas fa-plane' },
    { name: 'Entertainment', icon: 'fas fa-film' },
    { name: 'Miscellaneous', icon: 'fas fa-ellipsis-h' },
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService
  ) {
    this.addTaskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: ['Normal'],
      category: ['Personal'],
      dueDate: [new Date()],
      dueTime: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.addTaskForm.patchValue(this.taskToEdit);
    }
  }

  async onSubmit() {
    // Combine date and time into one Date object
    const dueDate = new Date(this.addTaskForm.value.dueDate); // Date only
    const dueTime = this.addTaskForm.value.dueTime; // Time string (e.g. "14:30")

    if (dueTime) {
      const [hours, minutes] = dueTime.split(':').map(Number);
      dueDate.setHours(hours);
      dueDate.setMinutes(minutes);
      dueDate.setSeconds(0);
      dueDate.setMilliseconds(0);
    }

    const taskToSave = {
      ...this.addTaskForm.value,
      dueDate, // Now a full datetime object
    };

    if (this.addTaskForm.invalid) {
      console.log('Form is invalid!');
      return;
    }

    const user = this.userService.getUser();
    if (!user?.uid) {
      console.error('User not found or not logged in');
      return;
    }

    if (this.isEditMode && this.taskToEdit) {
      const updatedTask: Task = {
        ...this.taskToEdit,
        ...taskToSave,
        updated_at: new Date().toISOString(),
      };
      await this.taskService.updateTask(user.uid, updatedTask.id, updatedTask);
      console.log('Task updated');
    } else {
      const newTaskData = taskToSave;
      await this.taskService.addTask(user.uid, newTaskData);
    }

    this.addTaskForm.reset();
    this.closemodal.emit();
  }
}
