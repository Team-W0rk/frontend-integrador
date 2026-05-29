import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-card',
  standalone: true,
  imports: [],
  templateUrl: './progress-card.html',
  styleUrl: './progress-card.css',
})
export class ProgressCard {
  title = input.required<string>();

  value = input.required<number>();

  leftLabel = input<string>('');
  rightLabel = input<string>('');

  color = input<'green' | 'blue'>('green');

  progressColor = computed(() => {
    return this.color() === 'blue'
      ? 'from-blue-400 to-blue-600'
      : 'from-green-400 to-green-600';
  });
}
