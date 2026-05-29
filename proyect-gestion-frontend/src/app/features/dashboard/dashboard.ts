import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ResumenEstadisticas } from '@/app/core/models/estadisticas.model';
import {
  ProyectoRetrasado,
  ProyectosPorCliente,
} from '@/app/core/models/proyectos.model';
import { AuthService } from '@/app/core/services/auth.service';
import { EstadisticasService } from '@/app/core/services/estadisticas.service';
import { SpinnerComponent } from '@/app/shared/ui/spinner-component/spinner-component';
import { MetricCard } from '@/app/shared/ui/metric-card/metric-card';
import { ProgressCard } from '@/app/shared/ui/progress-card/progress-card';
import { PageHeader } from '@/app/shared/layout/page-header/page-header';
import { QuickActionCard } from '@/app/shared/ui/quick-action-card/quick-action-card';
import { EmptyState } from '@/app/shared/ui/empty-state/empty-state';
import { Badge } from '@/app/shared/ui/badge/badge';
import { DelayedProjectItem } from '@/app/shared/ui/delayed-project-item/delayed-project-item';
import { SectionCard } from '@/app/shared/ui/section-card/section-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    MetricCard,
    ProgressCard,
    PageHeader,
    QuickActionCard,
    EmptyState,
    Badge,
    DelayedProjectItem,
    SectionCard,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private estadisticasService = inject(EstadisticasService);
  private authService = inject(AuthService);

  readonly username = this.authService.username;
  readonly isAdmin = this.authService.isAdmin;

  resumen = signal<ResumenEstadisticas | null>(null);
  porCliente = signal<ProyectosPorCliente[]>([]);
  retrasados = signal<ProyectoRetrasado[]>([]);

  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    setTimeout(() => this.cargarDatos(), 0);
  }

  cargarDatos(): void {
    this.loading.set(true);
    this.error.set(null);

    this.estadisticasService.getResumen().subscribe({
      next: (data) => this.resumen.set(data),
      error: () => this.error.set('Error al cargar el resumen'),
    });

    this.estadisticasService.getProyectosPorCliente().subscribe({
      next: (data) => this.porCliente.set(data),
    });

    this.estadisticasService.getProyectosRetrasados().subscribe({
      next: (data) => {
        this.retrasados.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getPorcentajeTareas(): number {
    const r = this.resumen();

    if (!r || r.tareas.total === 0) {
      return 0;
    }

    return Math.round(
      (r.tareas.finalizadas / r.tareas.total) * 100,
    );
  }
}
