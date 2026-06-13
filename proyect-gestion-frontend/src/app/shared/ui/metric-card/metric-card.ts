import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

interface MetricBadge {
  label: string;
  color?: 'green' | 'red' | 'yellow' | 'blue' | 'gray';
}

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.css',
})
export class MetricCard {
  title = input.required<string>();
  value = input.required<number>();
  icon = input.required<string>();

  color = input<'blue' | 'green' | 'purple' | 'red' | 'gray'>('blue');
  badges = input<MetricBadge[]>([]);
  link = input<string | null>(null);
  linkLabel = input<string>('');

  get borderColor(): string {
    const colors = {
      blue: 'border-blue-500',
      green: 'border-green-500',
      purple: 'border-purple-500',
      red: 'border-red-500',
      gray: 'border-slate-300',
    };
    return colors[this.color()];
  }

  getBadgeClass(color?: MetricBadge['color']): string {
    switch (color) {
      case 'green': return 'bg-green-50 text-green-700';
      case 'red': return 'bg-red-50 text-red-700';
      case 'yellow': return 'bg-yellow-50 text-yellow-700';
      case 'blue': return 'bg-blue-50 text-blue-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
}
