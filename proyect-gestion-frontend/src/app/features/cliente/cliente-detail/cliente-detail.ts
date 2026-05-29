import { Cliente } from '@/app/core/models/clientes.model';
import { ClientesService } from '@/app/core/services/clientes.service';
import { PageHeader } from '@/app/shared/layout/page-header/page-header';
import { Badge } from '@/app/shared/ui/badge/badge';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-cliente-detail',
  standalone: true,
  imports: [CommonModule, Badge, PageHeader, ToastModule,],
  templateUrl: './cliente-detail.html',
  styleUrl: './cliente-detail.css',
})
export class ClienteDetail {
  private clientesService = inject(ClientesService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private messageService = inject(MessageService);

  cliente = signal<Cliente | null>( null);

  loading = signal(true);

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get(
        'id'
      )
    );
    this.cargarCliente(id);
  }

  cargarCliente(id: number): void {
    this.loading.set(true);
    this.clientesService
      .getById(id)
      .subscribe({
        next: (cliente) => {
          this.cliente.set(cliente);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              err?.error?.message ||
              'No se pudo cargar el cliente',
          });
          this.router.navigate([
            '/clientes',
          ]);
        },
      });
  }

  editar(): void {
    this.router.navigate([
      '/clientes/editar',
      this.cliente()?.id,
    ]);
  }

  getBadgeColor(
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
}