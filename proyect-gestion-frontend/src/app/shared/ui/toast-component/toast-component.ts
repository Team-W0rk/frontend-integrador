import { ToastType } from '@/app/core/models/toast.model';
import { ToastService } from '@/app/core/services/toast.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-toast-component',
  standalone: true,
  imports: [],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.css',
})
export class ToastComponent {
 toastService = inject(ToastService);
 
  icons: Record<ToastType, string> = {
    success: '✅',
    error:   '❌',
    warning: '⚠️',
    info:    'ℹ️',
  };
}
