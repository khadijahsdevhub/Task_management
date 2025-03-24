import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AddTodoComponent } from "../components/add-todo/add-todo.component";
import { TasksService } from '../services/task/tasks.service';
import { Task } from '../models/definations';
import { CategoriesComponent } from "../components/categories/categories.component";
import { TodolistsComponent } from '../components/todolists/todolists.component';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AddTodoComponent, CategoriesComponent, TodolistsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  
  progress: number = 100; // Set progress value here
  isModalOpen: boolean = false;
  editMode: boolean = false;
  taskList: Task[]=[];
  todayTaskList: Task[]=[];
  completedList: Task[]=[];
  selectedTask: Task | null = null;
  filteredTasks: Task[] = [];
  selectedCategory: string | null = "All";

constructor(private tasksService: TasksService, private router:Router, private authService:AuthService){}

ngOnInit(): void {
 this.tasksService.tasks$.subscribe(updatedTasks => {
    this.taskList = updatedTasks;
  });
  this.todayTaskList = this.getTodaysTasks().active;
  this.completedList = this.getTodaysTasks().completed;
}

getTodaysTasks(): { completed: Task[]; active: Task[] } {
  const todaysTasks = this.taskList
  // const today = new Date();
  // const todaysTasks = this.taskList.filter(task => {
  //   const taskDate = task.dueDate;
  //   return taskDate?.getTime() === today.getTime(); // Check if task is for today
  // });

  return {
    completed: this.tasksService.getCompletedTasks(todaysTasks),
    active: this.tasksService.getActiveTasks(todaysTasks),
  };
}




goToTasks(){
  this.router.navigate(['./tasklists'])

}

filterTasks(category: string) {
  this.filteredTasks = this.tasksService.filterTasksByCategory(category);
  this.todayTaskList = this.filteredTasks;
  this.selectedCategory = category;
  console.log(this.filteredTasks);
  console.log(this.selectedCategory);
}

  getRotationValue(): number {
    return (this.progress / 100) * 360; // Convert percentage to degree
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

  async logout() {
    await this.authService.logout();
    alert('Logged out');
  }

}
