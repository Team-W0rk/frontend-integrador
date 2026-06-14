import { Proyecto } from '@/app/core/models/proyectos.model';
import { ProyectosService } from '@/app/core/services/proyectos.service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService} from 'primeng/api';
import { Router } from '@angular/router';
import { PageHeader } from "@/app/shared/layout/page-header/page-header";
import { DataTable } from "@/app/shared/ui/data-table/data-table";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { exportToCsv } from '@/app/shared/utils/export.util';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [PageHeader, DataTable, ConfirmDialogModule, ToastModule],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css',
})
export class Proyectos implements OnInit {
  private proyectosService = inject(ProyectosService);

  private router = inject(Router);

  private confirmationService = inject(ConfirmationService);

  private messageService = inject(MessageService);

  proyectos = signal<Proyecto[]>([]);

  loading = signal(true);

  filtros = signal<{
    search: string;
    estado?: string;
  }>({
    search: '',
    estado: undefined
  });

  columns = [
    {
      field: 'nombre',
      header: 'Proyecto',
    },
    {
      field: 'cliente.nombre',
      header: 'Cliente',
    },
    {
      field: 'estado',
      header: 'Estado',
      type: 'badge',
    },
    {
      field: 'fechaFin',
      header: 'Fecha fin',
      type: 'date',
    },
  ];

  proyectosFiltrados = computed(() => {
    const { search, estado } = this.filtros();

    return this.proyectos().filter(p => {
      const matchNombre = p.nombre
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchEstado = estado
        ? p.estado === estado
        : true;
      return matchNombre && matchEstado;
    });
  });



  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos(): void {
    this.loading.set(true);
    this.proyectosService.getAll()
      .subscribe({
        next: (res) => {
          this.proyectos.set(res.datos);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  onFilters(event: { search: string; estado?: string }) {
    this.filtros.set({
      search: event.search,
      estado: event.estado
    });
  }
  
  editar(id: number): void {
    this.router.navigate([
      '/proyectos/editar',
      id,
    ]);
  }

  eliminar(proyecto: Proyecto): void {
    this.confirmationService.confirm({
      header: 'Eliminar proyecto',
      message: `¿Seguro que querés eliminar "${proyecto.nombre}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      
        accept: () => {
        this.proyectosService
          .delete(proyecto.id)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Proyecto eliminado',
                detail:
                  'El proyecto fue dado de baja',
              });
              this.cargarProyectos()
            },

            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  err?.error?.message ||
                  'No se pudo eliminar el proyecto',
              });
            },
          });
      },
    });
  }

  verDetalle(id: number): void {
    this.router.navigate([
      '/proyectos',
      id,
    ]);
  }

  exportarExcel(): void {
    const headers = [
      'Proyecto',
      'Cliente',
      'Estado',
      'Fecha fin',
    ];

    const rows = this.proyectosFiltrados().map((p) => [
      p.nombre,
      p.cliente?.nombre || 'Interno',
      p.estado,
      p.fechaFin
        ? new Date(p.fechaFin)
            .toLocaleDateString('es-AR')
        : '-',
    ]);

    exportToCsv(
      'proyectos',
      headers,
      rows,
    );
  }

  exportarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(
      'Listado de proyectos',
      14,
      20,
    );
    autoTable(doc, {
      startY: 30,
      head: [[
        'Proyecto',
        'Cliente',
        'Estado',
        'Fecha fin',
      ]],
      body: this.proyectosFiltrados().map((p) => [
        p.nombre,
        p.cliente?.nombre || '-',
        p.estado,
        p.fechaFin
          ? new Date(p.fechaFin)
              .toLocaleDateString('es-AR')
          : '-',
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
    doc.save('proyectos.pdf');
  }
}