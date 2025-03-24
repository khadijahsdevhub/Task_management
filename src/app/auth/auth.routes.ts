import { Routes } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { LoginComponent } from "../components/auth/login/login.component";
import { RegisterComponent } from "../components/auth/register/register.component";

export const AuthRoutes: Routes =[
    { path: '', 
      component: AuthComponent, 
      children: [
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent },
      ] 
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
   
]