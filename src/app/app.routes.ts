import { Routes } from '@angular/router';
import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { TodolistsComponent } from './components/todolists/todolists.component';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path: '', component:LandingComponent},
    {path:'todolist', component:HomeComponent},
];
