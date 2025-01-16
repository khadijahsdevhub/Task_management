import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  progress: number = 100; // Set progress value here

  getRotationValue(): number {
    return (this.progress / 100) * 360; // Convert percentage to degree
  }

  categories = [
    { name: "All", icon:"fas fa-list" },
    { name: "Work", icon: "fas fa-briefcase" },
    { name: "Personal", icon: "fas fa-user" },
    { name: "Health", icon: "fas fa-heartbeat" },
    { name: "Study", icon: "fas fa-book" },
    { name: "Shopping", icon: "fas fa-shopping-cart" },
    { name: "Events", icon: "fas fa-calendar-alt" },
    { name: "Finance", icon: "fas fa-dollar-sign" },
    { name: "Travel", icon: "fas fa-plane" },
    { name: "Entertainment", icon: "fas fa-film" },
    { name: "Miscellaneous", icon: "fas fa-ellipsis-h" },
  ];

}
