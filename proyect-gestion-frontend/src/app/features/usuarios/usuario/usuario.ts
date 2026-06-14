import { Usuario } from '@/app/core/models/usuario.model';
import { UsuariosService } from '@/app/core/services/usuarios.service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PageHeader } from "@/app/shared/layout/page-header/page-header";
import { DataTable } from "@/app/shared/ui/data-table/data-table";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-usuario-dashboard',
  standalone: true,
  imports: [PageHeader, DataTable, ToastModule, ConfirmDialogModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class UsuarioDashboard implements OnInit {
  private usuariosService = inject(UsuariosService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  usuarios = signal<Usuario[]>([]);
  loading = signal(true);
  filtros = signal<{
    search: string;
    estado?: string;
    rol?: string;
    }>({
    search: '',
    estado: undefined,
    rol: undefined
  });

  columns = [
    {
      field: 'username',
      header: 'Usuario',
    },
    {
      field: 'rol',
      header: 'Rol',
      type: 'badge',
    },
    {
      field: 'estado',
      header: 'Estado',
      type: 'badge',
    },
    {
      field: 'creadoEn',
      header: 'Creado',
      type: 'date',
    },
  ];

  usuariosFiltrados = computed(() => {
    const { search, estado, rol } = this.filtros();
    return this.usuarios().filter(u => {
      const matchNombre = u.username
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchEstado = estado
        ? u.estado === estado
        : true;
      const matchRol = rol
        ? u.rol === rol
        : true;
      return matchNombre && matchEstado && matchRol;
    });
  });

  onFilters(event: { search: string; estado?: string; rol?: string }) {
    this.filtros.set({
      search: event.search,
      estado: event.estado,
      rol: event.rol
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading.set(true);
    this.usuariosService
      .getAll()
      .subscribe({
        next: (res) => {
          this.usuarios.set(res);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  editar(id: number): void {
    this.router.navigate([
      '/usuarios/editar',
      id,
    ]);
  }

  verDetalle(id: number): void {
    this.router.navigate([
      '/usuarios',
      id,
    ]);
  }

  eliminar(usuario: Usuario): void {
    this.confirmationService.confirm({
      header: 'Dar de baja',
      message: `¿Dar de baja a "${usuario.username}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.usuariosService
          .delete(usuario.id)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Usuario dado de baja',
                detail:
                  'El usuario fue actualizado correctamente',
              });

              this.cargarUsuarios();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  err?.error?.message ||
                  'No se pudo dar de baja',
              });
            },
          });
      },
    });
  }
}
