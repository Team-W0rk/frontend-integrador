import { Cliente } from '@/app/core/models/clientes.model';
import { ClientesService } from '@/app/core/services/clientes.service';
import { exportToCsv } from '@/app/shared/utils/export.util';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { PageHeader } from "@/app/shared/layout/page-header/page-header";
import { DataTable } from "@/app/shared/ui/data-table/data-table";

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [ConfirmDialogModule, ToastModule, PageHeader, DataTable],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {

  private clientesService = inject(ClientesService);

  private router = inject(Router);

  private confirmationService = inject(ConfirmationService);

  private messageService = inject(MessageService);

  clientes = signal<Cliente[]>([]);

  loading = signal(true);

  search = signal('');

  columns = [
    {
      field: 'nombre',
      header: 'Cliente',
    },
    {
      field: 'estado',
      header: 'Estado',
      type: 'badge',
    },
    {
      field: 'contactos.length',
      header: 'Contactos',
    },
    {
      field: 'proyectos.length',
      header: 'Proyectos',
    },
  ];

  clientesFiltrados = computed(() => {
    const texto = this.search()
      .trim()
      .toLowerCase();

    if (!texto) {
      return this.clientes();
    }

    return this.clientes().filter((c) =>
      c.nombre.toLowerCase().includes(texto)
    );
  });

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading.set(true);
    this.clientesService
      .getAll()
      .subscribe({
        next: (res) => {
          this.clientes.set(res);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  editar(id: number): void {
    this.router.navigate([
      '/clientes/editar',
      id,
    ]);
  }

  verDetalle(id: number): void {
    this.router.navigate([
      '/clientes',
      id,
    ]);
  }

  eliminar(cliente: Cliente): void {
    this.confirmationService.confirm({
      header: 'Dar de baja cliente',
      message:
        `¿Seguro que querés dar de baja "${cliente.nombre}"?`,

      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Dar de baja',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',

      accept: () => {
        this.clientesService
          .delete(cliente.id)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Cliente actualizado',
                detail:
                  'El cliente fue dado de baja',
              });
              this.cargarClientes();
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

  exportarExcel(): void {
    const headers = [
      'Cliente',
      'Estado',
      'Contactos',
      'Proyectos',
    ];
    const rows = this.clientesFiltrados().map((c) => [
      c.nombre,
      c.estado,
      c.contactos?.length || 0,
      c.proyectos?.length || 0,
    ]);

    exportToCsv(
      'clientes',
      headers,
      rows,
    );
  }

  exportarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(
      'Listado de clientes',
      14,
      20,
    );
    autoTable(doc, {
      startY: 30,
      head: [[
        'Cliente',
        'Estado',
        'Contactos',
        'Proyectos',
      ]],
      body: this.clientesFiltrados().map((c) => [
        c.nombre,
        c.estado,
        c.contactos?.length || 0,
        c.proyectos?.length || 0,
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
    });
    doc.save('clientes.pdf');
  }
}
