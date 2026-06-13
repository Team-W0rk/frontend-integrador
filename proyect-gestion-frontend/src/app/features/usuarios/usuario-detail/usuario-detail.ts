import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { UsuariosService } from '@/app/core/services/usuarios.service';
import { PageHeader } from '@/app/shared/layout/page-header/page-header';
import { Badge } from '@/app/shared/ui/badge/badge';
import { SectionCard } from '@/app/shared/ui/section-card/section-card';
import { Usuario } from '@/app/core/models/usuario.model';

@Component({
  selector: 'app-usuario-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    PageHeader,
    SectionCard,
    Badge,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './usuario-detail.html',
  styleUrl: './usuario-detail.css',
})
export class UsuarioDetail {
  private usuariosService = inject(UsuariosService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private messageService = inject(MessageService);

  usuario = signal<Usuario | null>( null );

  loading = signal(true);

  ngOnInit(): void {
    const id =
      Number(
        this.route.snapshot.paramMap.get(
          'id'
        )
      );
    this.cargarUsuario(id);
  }

  cargarUsuario(id: number): void {
    this.loading.set(true);
    this.usuariosService
      .getById(id)
      .subscribe({
        next: (usuario) => {
          this.usuario.set(usuario);
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
          this.router.navigate([
            '/usuarios',
          ]);
        },
      });
  }

  editar(): void {
    this.router.navigate([
      '/usuarios/editar',
      this.usuario()?.id,
    ]);
  }

  getEstadoColor(
    estado: string
  ):
    | 'green'
    | 'red'
    | 'gray' {

    switch (estado) {
      case 'activo':
        return 'green';
      case 'baja':
        return 'red';
      default:
        return 'gray';
    }
  }

  getRolColor(
    rol: string
  ):
    | 'blue'
    | 'purple' {
    switch (rol) {
      case 'admin':
        return 'purple';
      default:
        return 'blue';
    }
  }
}
