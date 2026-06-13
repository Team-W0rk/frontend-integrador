import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-section-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './section-card.html',
  styleUrl: './section-card.css',
})
export class SectionCard {
  title = input.required<string>();

  icon = input<string>('');

  link = input<string | null>(null);

  linkLabel = input<string>('');
}
