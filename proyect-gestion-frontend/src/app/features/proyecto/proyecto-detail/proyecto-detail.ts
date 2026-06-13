import { ProyectosService } from '@/app/core/services/proyectos.service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Badge } from "@/app/shared/ui/badge/badge";
import { SectionCard } from "@/app/shared/ui/section-card/section-card";
import { PageHeader } from "@/app/shared/layout/page-header/page-header";
import { CommonModule, DatePipe } from '@angular/common';
import { TareasService } from '@/app/core/services/tareas.service';
import { Tarea } from '@/app/core/models/tareas.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EstadoTarea } from '@/app/core/models/enums.model';

@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    Badge,
    SectionCard,
    PageHeader,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './proyecto-detail.html',
  styleUrl: './proyecto-detail.css',
})
export class ProyectoDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private proyectosService = inject(ProyectosService);
  private tareasService = inject(TareasService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  proyecto = signal<any | null>(null);
  tareas = signal<Tarea[]>([]);
  loading = signal(true);

  tareaDialog = signal(false);
  editandoTarea = signal(false);
  tareaId = signal<number | null>(null);

  form = this.fb.nonNullable.group({
    descripcion: ['', Validators.required],
    estado: [EstadoTarea.PENDIENTE]
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarProyecto(id);
  }

  cargarProyecto(id: number) {
    this.loading.set(true);
    this.proyectosService.getById(id).subscribe({
      next: (res) => {
        this.proyecto.set(res);
        this.cargarTareas(id);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/proyectos']);
      }
    });
  }

  cargarTareas(proyectoId: number) {
    this.tareasService.getAll(proyectoId).subscribe({
      next: (t) => this.tareas.set(t),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las tareas'
        });
      }
    });
  }

  abrirNuevaTarea() {
    this.editandoTarea.set(false);
    this.tareaId.set(null);
    this.form.reset({ descripcion: '', estado: EstadoTarea.PENDIENTE });
    this.tareaDialog.set(true);
  }

  editarTarea(tarea: Tarea) {
    this.editandoTarea.set(true);
    this.tareaId.set(tarea.id);
    this.form.setValue({
      descripcion: tarea.descripcion,
      estado: tarea.estado as EstadoTarea
    });
    this.tareaDialog.set(true);
  }

  guardarTarea() {
    if (this.form.invalid) return;
    const proyectoId = this.proyecto()!.id;
    const raw = this.form.getRawValue();

    const request = this.editandoTarea()
      ? this.tareasService.update(proyectoId, this.tareaId()!, {
          descripcion: raw.descripcion,
          estado: raw.estado,
        })
      : this.tareasService.create(proyectoId, {
          descripcion: raw.descripcion,
        });

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.editandoTarea() ? 'Tarea actualizada' : 'Tarea creada',
          detail: 'Operación exitosa',
        });
        this.tareaDialog.set(false);
        this.cargarTareas(proyectoId);
      },
      error: (err) => {
        console.log('ERROR BACKEND:', err.error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar la tarea',
        });
      },
    });
  }

  eliminarTarea(tarea: Tarea) {
    this.confirmationService.confirm({
      header: 'Eliminar tarea',
      message: `¿Eliminar "${tarea.descripcion}"?`,
      accept: () => {
        const proyectoId = this.proyecto().id;
        this.tareasService.delete(proyectoId, tarea.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminada',
              detail: 'Tarea eliminada correctamente'
            });
            this.cargarTareas(proyectoId);
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar'
            });
          }
        });
      }
    });
  }

  badgeColor = computed(() => {
    switch (this.proyecto()?.estado) {
      case 'activo': return 'green';
      case 'finalizado': return 'blue';
      case 'baja': return 'red';
      default: return 'gray';
    }
  });
}