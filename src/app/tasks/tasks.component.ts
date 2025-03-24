import { Component, OnInit } from '@angular/core';
import { CategoriesComponent } from "../components/categories/categories.component";
import { TasksService } from '../services/task/tasks.service';
import { Task } from '../models/definations';
import { TodolistsComponent } from "../components/todolists/todolists.component";
import { AddTodoComponent } from "../components/add-todo/add-todo.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CategoriesComponent, TodolistsComponent, AddTodoComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  isModalOpen: boolean = false;
  editMode: boolean = false;
  selectedCategory:string = "All"
  selectedTask: Task | null = null;
  filteredTasks: Task[] = [];

  constructor(private tasksService: TasksService, private router:Router){}

  ngOnInit(): void {
    this.tasksService.tasks$.subscribe(updatedTasks => {
      this.filteredTasks = updatedTasks;
    });
    
  }
  filterTasks(category: string) {
    this.filteredTasks = this.tasksService.filterTasksByCategory(category);
    this.selectedCategory = category;
    console.log(this.filteredTasks);
    console.log(this.selectedCategory);
  }

  openModal(){
    this.isModalOpen = true;
  }

  closeModal(){
    if(this.editMode == true){
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

  deleteTask(taskId:string){
    this.tasksService.deleteTask(taskId); 
  }

  goToHome(){
    this.router.navigate(['./home']);
  }
}
