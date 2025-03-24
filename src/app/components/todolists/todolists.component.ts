import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Categories, Task } from '../../models/definations';
import { CommonModule } from '@angular/common';
import { categories } from '../../models/data';
import { TasksService } from '../../services/task/tasks.service';


@Component({
  selector: 'app-todolists',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todolists.component.html',
  styleUrl: './todolists.component.scss'
})
export class TodolistsComponent {
  showTaskDetails = false;
  categories: Categories[]= categories;

 @Input() taskLists:Task[] = [] ;
 @Output() editTask = new EventEmitter <Task> ();
 @Output() deleteTask = new EventEmitter <string> ();
 //@Output() completeTask = new EventEmitter();

constructor(private tasksService:TasksService){}

toggleTaskDetails(taskId:string){
  this.taskLists.forEach((t)=>{
     if(t.id == taskId){
       t.viewDetails = !t.viewDetails
     }
  })
 }

 checkCategory(category: string|undefined): string {
   const foundCategory = this.categories.find((c) => c.name === category);
   return foundCategory ? foundCategory.icon : 'fa-circle'; // Default icon if not found
 }

 getPriorityIcon(priority: string|undefined): string {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'fa-solid fa-triangle-exclamation text-danger'; // Red warning icon for High
    case 'medium':
      return 'fa-solid fa-exclamation-circle text-warning'; // Yellow icon for Medium
    case 'low':
      return 'fa-solid fa-check-circle text-success'; // Green check for Low
    case 'normal':
      return 'fa-solid fa-check-circle text-success';
    default:
      return ''; 
  }
}


  taskEdit(task:Task){
  this.editTask.emit(task);
  }

  taskDelete(taskId:string){
    this.deleteTask.emit(taskId);
  }

  toggleTaskCompletion(taskId: string): void {
    console.log(taskId)
      this.tasksService.toggleTaskAsComplete(taskId);
  }
  


}
