import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { TasksComponent } from './tasks/tasks.component';


export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(r => r.AuthRoutes) 
      },
    {path: '', component:LandingComponent},
    {path:'home', component:HomeComponent},
    {path:'tasklists', component:TasksComponent},
   
];
