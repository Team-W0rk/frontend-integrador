import { Injectable, signal } from '@angular/core';
import { AlertConfig } from '../models/alert.model';


@Injectable({ providedIn: 'root' })
export class AlertService {
  readonly visible = signal(false);
  readonly config = signal<AlertConfig>({
    type: 'info',
    title: '',
    message: '',
    buttonText: 'Aceptar',
  });

  show(cfg: AlertConfig): void {
    this.config.set({ buttonText: 'Aceptar', ...cfg });
    this.visible.set(true);
  }

  success(title: string, message: string): void {
    this.show({ type: 'success', title, message });
  }

  error(title: string, message: string): void {
    this.show({ type: 'error', title, message });
  }

  warning(title: string, message: string): void {
    this.show({ type: 'warning', title, message });
  }

  close(): void {
    this.visible.set(false);
  }
}