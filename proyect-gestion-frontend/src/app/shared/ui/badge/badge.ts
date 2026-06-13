import {
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.css',
})
export class Badge {

  label = input.required<string>();

  color = input<
    'green' |
    'red' |
    'yellow' |
    'blue' |
    'gray' |
    'purple'
  >('gray');

  outlined = input(false);

  icon = input<string | null>(null);

  paddingClass = input('badge-padding-sm');

  classes = computed(() => {

    const colors = {

      green: this.outlined()
        ? 'border border-green-200 text-green-700 bg-white'
        : 'bg-green-50 text-green-700',

      red: this.outlined()
        ? 'border border-red-200 text-red-700 bg-white'
        : 'bg-red-50 text-red-700',

      yellow: this.outlined()
        ? 'border border-yellow-200 text-yellow-700 bg-white'
        : 'bg-yellow-50 text-yellow-700',

      blue: this.outlined()
        ? 'border border-blue-200 text-blue-700 bg-white'
        : 'bg-blue-50 text-blue-700',

      purple: this.outlined()
        ? 'border border-purple-200 text-purple-700 bg-white'
        : 'bg-purple-50 text-purple-700',

      gray: this.outlined()
        ? 'border border-gray-200 text-gray-700 bg-white'
        : 'bg-gray-100 text-gray-600',

    };

    return `
      inline-flex
      items-center
      gap-1
      rounded-full
      font-semibold
      whitespace-nowrap
      ${colors[this.color()]}
      ${this.paddingClass()}
    `;
  });
}
