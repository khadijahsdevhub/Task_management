import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
heroImg =''

ngOnInit(): void {
  this.heroImg= '../../../assets/images/main-avatar.png';
}

constructor(private router:Router){}

start(){
this.router.navigate(['/auth/login']);
}

@HostListener('document:keyup.enter', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    this.start();
  }
}
