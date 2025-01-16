import { Component, Input } from '@angular/core';
import { Task } from '../../models/definations';

@Component({
  selector: 'app-todolists',
  standalone: true,
  imports: [],
  templateUrl: './todolists.component.html',
  styleUrl: './todolists.component.css'
})
export class TodolistsComponent {

// @Input() tasklists:Task[] = [] ;
@Input() tasklists: string[] = [] ;

}
