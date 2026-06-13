import { RolUsuario } from '@/app/core/models/enums.model';
import { UsuariosService } from '@/app/core/services/usuarios.service';
import { PageHeader } from '@/app/shared/layout/page-header/page-header';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-usuario-form',
  imports: [ CommonModule, ReactiveFormsModule, PageHeader, ToastModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
})
export class UsuarioForm {
  private fb = inject(FormBuilder);

  private usuariosService = inject(UsuariosService);

  private router = inject(Router);

  private route = inject(ActivatedRoute);

  private messageService = inject(MessageService);

  saving = signal(false);

  loading = signal(false);

  editando = signal(false);

  usuarioId = signal<number | null>( null);

  form = this.fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
      ],
    ],
    password: [
      '',
      [
        Validators.minLength(6),
      ],
    ],
    rol: ['usuario'],
  });

  ngOnInit(): void {
    const id =
      this.route.snapshot.paramMap.get(
        'id'
      );
    if (id) {
      this.editando.set(true);
      this.usuarioId.set(Number(id));
      this.cargarUsuario(Number(id));
    }
  }

  cargarUsuario(id: number): void {
    this.loading.set(true);
    this.usuariosService
      .getById(id)
      .subscribe({
        next: (usuario) => {
          this.form.patchValue({
            username: usuario.username,
            rol: usuario.rol,
          });
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'No se pudo cargar el usuario',
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
    const payload: {
      username: string;
      rol: RolUsuario;
      password?: string;
    } = {
      username:
        this.form.value.username ?? '',
      rol:
        (this.form.value.rol as RolUsuario)
        ?? 'usuario',
    };
    if (this.form.value.password) {
      payload.password =
        this.form.value.password;
    }
    if (this.editando()) {
      this.usuariosService
        .update(
          this.usuarioId()!,
          payload,
        )
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary:
                'Usuario actualizado',
              detail:
                'Los datos fueron actualizados correctamente',
            });
            setTimeout(() => {
              this.router.navigate([
                '/usuarios',
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
                'No se pudo actualizar el usuario',
            });
          },
        });

      return;
    }
    this.usuariosService
      .create(payload)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary:
              'Usuario creado',
            detail:
              'El usuario fue creado correctamente',
          });
          setTimeout(() => {
            this.router.navigate([
              '/usuarios',
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
              'No se pudo crear el usuario',
          });
        },
      });
  }

  cancelar(): void {
    this.router.navigate([
      '/usuarios',
    ]);
  }
}
