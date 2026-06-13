import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner-component',
  standalone: true,
  imports: [],
  templateUrl: './spinner-component.html',
  styleUrl: './spinner-component.css',
})
export class SpinnerComponent {
  size          = input<'sm' | 'md' | 'lg'>('md');
  label         = input<string>('');
  fullPage      = input(false);
 
  get sizeClass(): () => string {
    return () => {
      const sizes = {
        sm: 'w-5 h-5 border-2',
        md: 'w-9 h-9 border-3',
        lg: 'w-14 h-14 border-4',
      };
      return sizes[this.size()];
    };
  }
 
  get containerClass(): () => string {
    return () => this.fullPage()
      ? 'min-h-screen w-full'
      : 'py-16 w-full';
  }
}
