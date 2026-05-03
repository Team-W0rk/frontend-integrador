import { AlertType } from '@/app/core/models/alert.model';
import { AlertService } from '@/app/core/services/alert.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [],
  templateUrl: './alert-modal.html',
  styleUrl: './alert-modal.css',
})
export class AlertModal {
  alertService = inject(AlertService);
 
  icons: Record<AlertType, string> = {
    success: '✅',
    error:   '❌',
    warning: '⚠️',
    info:    'ℹ️',
  };
}
