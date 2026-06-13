import { ProyectoRetrasado } from '@/app/core/models/proyectos.model';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-delayed-project-item',
  standalone: true,
  imports: [],
  templateUrl: './delayed-project-item.html',
  styleUrl: './delayed-project-item.css',
})
export class DelayedProjectItem {
  project = input.required<ProyectoRetrasado>();
}
