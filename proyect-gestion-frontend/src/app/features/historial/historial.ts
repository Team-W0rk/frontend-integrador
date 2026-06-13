import { Historial } from '@/app/core/models/historial.model';
import { HistorialService } from '@/app/core/services/historial.service';
import { PageHeader } from '@/app/shared/layout/page-header/page-header';
import { Badge } from '@/app/shared/ui/badge/badge';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, PageHeader, Badge],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class HistorialComponent implements OnInit {
  private historialService = inject(HistorialService);

  historial = signal<Historial[]>([]);

  loading = signal(true);

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.loading.set(true);
    this.historialService
      .getAll()
      .subscribe({
        next: (res) => {
          this.historial.set(res);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  getBadgeColor(
    accion: string
  ):
    | 'green'
    | 'blue'
    | 'red'
    | 'yellow' {

    switch (accion) {

      case 'crear':
        return 'green';

      case 'modificar':
        return 'blue';

      case 'baja':
        return 'yellow';

      case 'eliminar':
        return 'red';

      default:
        return 'blue';
    }
  }
}
