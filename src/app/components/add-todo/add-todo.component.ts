import { Component, EventEmitter, Input, Output, SimpleChanges  } from '@angular/core';
import { Task } from '../../models/definations';
import {FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../services/task/tasks.service';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss'
})
export class AddTodoComponent {
  @Input() taskToEdit: Task | null = null; // Receive task when editing
  @Output() closemodal = new EventEmitter<void>();
  @Input() isEditMode:boolean = false;

  priorities =[
    {
      name: 'Normal'
    },
    {
      name:'High',
    },
    {
      name:'Medium',
    },
    {
      name: 'Low'
    },
];
  categories = [
    { name: "Work", icon: "fas fa-briefcase" },
    { name: "Personal", icon: "fas fa-user" },
    { name: "Health", icon: "fas fa-heartbeat" },
    { name: "Study", icon: "fas fa-book" },
    { name: "Shopping", icon: "fas fa-shopping-cart" },
    { name: "Events", icon: "fas fa-calendar-alt" },
    { name: "Finance", icon: "fas fa-dollar-sign" },
    { name: "Travel", icon: "fas fa-plane" },
    { name: "Entertainment", icon: "fas fa-film" },
    { name: "Miscellaneous", icon: "fas fa-ellipsis-h" },
  ];

addTaskForm: FormGroup;

constructor(private fb: FormBuilder, private tasksService: TasksService) {
    this.addTaskForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3)
      ]
    ], 
      description: [''],
      priority: ["Normal"], 
      category: ["Personal"],
      dueDate: [new Date()],
      dueTime: [null]
    });


  }


closeModal() {
  this.closemodal.emit();
}


ngOnChanges(changes: SimpleChanges): void {
  if (changes['taskToEdit'] && this.taskToEdit) {
    this.addTaskForm.patchValue(this.taskToEdit);  // Fill form with task data
  }
}

onSubmit() {
  if (this.addTaskForm.valid) {
    if(this.isEditMode){
      const editingTask = {...this.taskToEdit, ...this.addTaskForm.value,  updated_at: new Date().toISOString() } as Task
      this.tasksService.updateTask(editingTask.id, editingTask);
      this.addTaskForm.reset(); 
      this.closeModal();
  console.log("Edit");
    }else{
      const task = this.addTaskForm.value as Task;
      this.tasksService.addTask(task);   // Save task via service 
      this.addTaskForm.reset(); 
      this.closeModal();
    }
  } else {
    console.log('Form is invalid!');
  }
}

}
