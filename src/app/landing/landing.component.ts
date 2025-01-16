import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
heroImg =''

ngOnInit(): void {
  this.heroImg= '../../../assets/images/main-avatar.png';
}

constructor(private router:Router){}

start(){
this.router.navigate(['/todolist']);
}

}
