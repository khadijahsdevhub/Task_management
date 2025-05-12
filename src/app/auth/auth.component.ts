import { Component } from '@angular/core';
import { LoginComponent } from "../components/auth/login/login.component";
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ CommonModule, RouterModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  isRegisterPage: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isRegisterPage = this.router.url.includes('register');
    });
  }
}
