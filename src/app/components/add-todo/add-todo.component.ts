import { Component } from '@angular/core';
import { TodolistsComponent } from '../todolists/todolists.component';
import { Task } from '../../models/definations';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [TodolistsComponent, FormsModule],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.css'
})
export class AddTodoComponent {
  task ='';

//   tasks: Task[] = [
//     { id: 1, title: 'Buy groceries', category: 'Personal', priority: 'High', completed: false },
//     { id: 2, title: 'Team meeting', category: 'Work', priority: 'Medium', completed: true },
// ];

tasks:string[] = ["sleep", "eat"];

addTask(task:any){
this.tasks.push(task);
this.task ='';
console.log(this.tasks);
}

}
