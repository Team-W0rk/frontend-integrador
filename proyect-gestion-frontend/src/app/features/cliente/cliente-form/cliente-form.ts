import { ClientesService } from '@/app/core/services/clientes.service';
import { PageHeader } from '@/app/shared/layout/page-header/page-header';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ToastModule, ReactiveFormsModule, PageHeader,],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})
export class ClienteForm {
  private fb = inject(FormBuilder);

  private clientesService =
    inject(ClientesService);

  private router = inject(Router);

  private route =
    inject(ActivatedRoute);

  private messageService =
    inject(MessageService);

  loading = signal(false);

  saving = signal(false);

  editando = signal(false);

  clienteId = signal<number | null>(
    null
  );

  form = this.fb.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
      ],
    ],
  });

  ngOnInit(): void {
    const id =
      this.route.snapshot.paramMap.get(
        'id'
      );
    if (id) {
      this.editando.set(true);
      this.clienteId.set(Number(id));
      this.cargarCliente(Number(id));
    }
  }

  cargarCliente(id: number): void {
    this.loading.set(true);
    this.clientesService
      .getById(id)
      .subscribe({
        next: (cliente) => {
          this.form.patchValue({
            nombre: cliente.nombre,
          });
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'No se pudo cargar el cliente',
          });
        },
      });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);

    const payload = {
      nombre:
        this.form.value.nombre ?? '',
    };

    if (this.editando()) {
      this.clientesService
        .update(
          this.clienteId()!,
          payload
        )
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary:
                'Cliente actualizado',
              detail:
                'Los datos fueron actualizados correctamente',
            });
            setTimeout(() => {
              this.router.navigate([
                '/clientes',
              ]);
            }, 1200);
          },
          error: (err) => {
            this.saving.set(false);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                err?.error?.message ||
                'No se pudo actualizar el cliente',
            });
          },
        });
      return;
    }
    this.clientesService
      .create(payload)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary:
              'Cliente creado',
            detail:
              'El cliente fue creado correctamente',
          });
          setTimeout(() => {
            this.router.navigate([
              '/clientes',
            ]);
          }, 1200);
        },
        error: (err) => {
          this.saving.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              err?.error?.message ||
              'No se pudo crear el cliente',
          });
        },
      });
  }

  cancelar(): void {
    this.router.navigate([
      '/clientes',
    ]);
  }
}
