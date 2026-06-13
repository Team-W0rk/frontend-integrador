import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quick-action-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quick-action-card.html',
  styleUrl: './quick-action-card.css',
})
export class QuickActionCard {
  icon = input.required<string>();

  label = input.required<string>();

  route = input.required<string>();
}
