import { Cliente } from '@/app/core/models/clientes.model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ClientesService } from '@/app/core/services/clientes.service';
import { ProyectosService } from '@/app/core/services/proyectos.service';
import { PageHeader } from '@/app/shared/layout/page-header/page-header';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-proyecto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeader, ToastModule],
  templateUrl: './proyecto-form.html',
  styleUrl: './proyecto-form.css',
})
export class ProyectoForm {
  private fb = inject(FormBuilder);
  private proyectosService = inject(ProyectosService);
  private clientesService = inject(ClientesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  loading = signal(false);
  saving = signal(false);
  clientes = signal<Cliente[]>([]);
  editando = signal(false);
  proyectoId = signal<number | null>(null);

  form = this.fb.group({
    nombre: ['', [
      Validators.required,
      Validators.minLength(3),
    ]],

    clienteId: [null as number | null],
    fechaFin: [''],
  });

  ngOnInit(): void {
    this.cargarClientes();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando.set(true);
      this.proyectoId.set(Number(id));
      this.cargarProyecto(Number(id));
    }
  }

  cargarClientes() {
    this.clientesService
      .getActivos()
      .subscribe({
        next: (clientes) => {
          this.clientes.set(clientes);
        },
      });
  }

  cargarProyecto(id: number) {
    this.loading.set(true);
    this.proyectosService.getById(id).subscribe({
      next: (proyecto) => {
        this.form.patchValue({
          nombre: proyecto.nombre,
          clienteId: proyecto.clienteId,
          fechaFin: proyecto.fechaFin
            ? proyecto.fechaFin.split('T')[0]
            : '',
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Completá los campos requeridos',
      });
      return;
    }

    this.saving.set(true);
    const formValue = this.form.getRawValue();
    const payload = {
      nombre: formValue.nombre ?? '',
      clienteId:
        formValue.clienteId || null,
      fechaFin:
        formValue.fechaFin || null,
    };

    if (this.editando()) {
      this.proyectosService
        .update(
          this.proyectoId()!,
          payload,
        )
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.messageService.add({
              severity: 'success',
              summary: 'Proyecto actualizado',
              detail: 'Los cambios se guardaron correctamente',
            });

            setTimeout(() => {
              this.router.navigate([
                '/proyectos',
              ]);
            }, 1200);
          },

          error: (err) => {
            this.saving.set(false);
            this.messageService.add({
              severity: 'error',
              summary: 'Error al actualizar',
              detail: err?.error?.message || 'No se pudo actualizar el proyecto',
            });
          },
        });
      return;
    }

    this.proyectosService
      .create(payload)
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Proyecto creado',
            detail: 'El proyecto se creó correctamente',
          });

          setTimeout(() => {
            this.router.navigate([
              '/proyectos',
            ]);
          }, 1200);
        },

        error: (err) => {
          this.saving.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al crear',
            detail: err?.error?.message || 'No se pudo crear el proyecto',
          });
        },
      });
  }

  cancelar() {
    this.router.navigate(['/proyectos']);
  }
}
