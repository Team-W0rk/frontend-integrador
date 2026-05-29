import { ProyectosService } from '@/app/core/services/proyectos.service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Badge } from "@/app/shared/ui/badge/badge";
import { SectionCard } from "@/app/shared/ui/section-card/section-card";
import { PageHeader } from "@/app/shared/layout/page-header/page-header";
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, Badge, SectionCard, PageHeader],
  templateUrl: './proyecto-detail.html',
  styleUrl: './proyecto-detail.css',
})
export class ProyectoDetail implements OnInit {
  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private proyectosService = inject(ProyectosService);

  proyecto = signal<any | null>( null);

  loading = signal(true);

  ngOnInit(): void {
    const id =
      Number(
        this.route.snapshot.paramMap.get(
          'id'
        )
      );
    this.cargarProyecto(id);
  }

  cargarProyecto(id: number) {
    this.loading.set(true);
    this.proyectosService
      .getById(id)
      .subscribe({
        next: (res) => {
          this.proyecto.set(res);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.router.navigate([
            '/proyectos',
          ]);
        },
      });
  }

  badgeColor = computed(() => {
    const estado =
      this.proyecto()?.estado;

    switch (estado) {
      case 'activo':
        return 'green';
      case 'finalizado':
        return 'blue';
      case 'baja':
        return 'red';
      default:
        return 'gray';
    }
  });
}
