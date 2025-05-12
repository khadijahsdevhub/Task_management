import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';



@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent  {

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

  @Input() selectedCategory: string | null = null; 
  @Output() filterTasks = new EventEmitter <string>();





}
