import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { Badge } from "../badge/badge";
import { PaginatorModule } from 'primeng/paginator';

type SortDir = 'asc' | 'desc' | null;

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    Badge,
    PaginatorModule
],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable {
  columns = input<any[]>([]);
  data = input<any[]>([]);
  loading = input(false);
  edit = output<any>();
  remove = output<any>();
  detail = output<any>();
  first = signal(0);
  rows = signal(10);
  sortField = signal<string | null>(null);
  sortDir = signal<SortDir>(null);

  processedData = computed(() => {
    let result = [...this.data()];
    const field = this.sortField();
    const dir = this.sortDir();

    if (field && dir) {
      result.sort((a, b) => {
        let valA = this.normalize(this.getValue(a, field));
        let valB = this.normalize(this.getValue(b, field));

        // FECHAS
        const isDate =
          typeof valA === 'string' &&
          valA.includes('/') &&
          typeof valB === 'string' &&
          valB.includes('/');

        if (isDate) {
          const dateA = this.parseDate(valA);
          const dateB = this.parseDate(valB);

          return this.sortDir() === 'asc'
            ? dateA - dateB
            : dateB - dateA;
        }

        // 🔥 STRINGS (IMPORTANTE: lowercase)
        const aStr = String(valA).toLowerCase();
        const bStr = String(valB).toLowerCase();

        if (aStr < bStr) return this.sortDir() === 'asc' ? -1 : 1;
        if (aStr > bStr) return this.sortDir() === 'asc' ? 1 : -1;

        return 0;
      });
    }
    const start = this.first();
    const end = start + this.rows();
    return result.slice(start, end);
  });

  normalize(value: any) {
    if (value === null || value === undefined) return '';
    if (value === '-') return '';
    return value;
  }

  parseDate(value: string): number {
    const [day, month, year] = value.split('/');
    return new Date(+year, +month - 1, +day).getTime();
  }

  toggleSort(field: string) {
    if (this.sortField() !== field) {
      this.sortField.set(field);
      this.sortDir.set('asc');
      return;
    }

    const current = this.sortDir();

    if (current === 'asc') this.sortDir.set('desc');
    else if (current === 'desc') {
      this.sortDir.set(null);
      this.sortField.set(null);
    } else {
      this.sortDir.set('asc');
    }
  }

  getSortIcon(field: string): string {
    if (this.sortField() !== field) return '⇅';
    return this.sortDir() === 'asc'
      ? '↑'
      : this.sortDir() === 'desc'
        ? '↓'
        : '⇅';
  }

  onPageChange(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  getValue(obj: any, field: string): any {
    return field
      .split('.')
      .reduce((acc, part) => acc?.[part], obj);
  }

  getBadgeColor(estado: string): 'green' | 'red' | 'blue' | 'gray' {
    switch (estado?.toLowerCase()) {
      case 'activo': return 'green';
      case 'finalizado': return 'blue';
      case 'baja': return 'red';
      default: return 'gray';
    }
  }
}