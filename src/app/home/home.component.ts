import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AddTodoComponent } from "../components/add-todo/add-todo.component";
import { TaskService } from '../services/task/tasks.service';
import { Task } from '../models/definations';
import { CategoriesComponent } from "../components/categories/categories.component";
import { TodolistsComponent } from '../components/todolists/todolists.component';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { log } from 'console';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AddTodoComponent, CategoriesComponent, TodolistsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {
  username ='';
  progress: number = 100; // Set progress value here
  isModalOpen: boolean = false;
  editMode: boolean = false;
  tasks$: Observable<Task[]> = of([]);
  taskList: Task[]=[];
  todayTaskList: Task[]=[];
  completedList: Task[]=[];
  selectedTask: Task | null = null;
  filteredTasks: Task[] = [];
  selectedCategory: string | null = "All";

constructor(private taskService: TaskService, private router:Router, private userService: UserService, private authService:AuthService ) {}

async ngOnInit() {
  this.userService.initUserFromLocalStorage();
  const currentUser = this.userService.getUser();

  if (currentUser) {
    this.username = currentUser.name;
    if (currentUser.uid){
      this.taskList = await this.taskService.getTasks(currentUser.uid);
    }
    // setTimeout(() => {
    //   this.taskService.getTasks(currentUser.uid).subscribe(res => {
    //     this.taskList = res;
    //   });
    // }, 5000); 
    console.log('Welcome,', currentUser.name); 
    console.log( currentUser);
    console.log(this.tasks$)

  }
}



goToTasks(){
  this.router.navigate(['./tasklists'])
}

filterTasks(category: string) {
  this.filteredTasks = this.taskService.filterTasksByCategory(category);
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

  deleteTask(taskId:string, uniqueId:string){
    this.taskService.deleteTask(taskId, uniqueId ) ; 
  }

  async logout() {
    await this.authService.logout();
    alert('Logged out');
  }

}
